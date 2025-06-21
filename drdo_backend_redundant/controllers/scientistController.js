const pool = require('../config/db');

exports.updateScientist = async (req, res) => {
  const id = req.params.id;
  const updates = req.body;
  const groupId = req.user.group_id;

  try {
    const [existing] = await pool.query(
      'SELECT * FROM scientists WHERE id = ? AND group_id = ?',
      [id, groupId]
    );

    if (existing.length === 0) {
      return res.status(403).json({ message: 'You are not authorized to update this scientist' });
    }

    const fields = Object.keys(updates);
    const values = Object.values(updates);

    if (fields.length === 0) {
      return res.status(400).json({ message: 'No fields provided for update' });
    }

    const setClause = fields.map(field => `${field} = ?`).join(', ');
    values.push(id);

    await pool.query(`UPDATE scientists SET ${setClause} WHERE id = ?`, values);
    res.json({ message: 'Scientist updated successfully' });
  } catch (err) {
    console.error('Update Error:', err);
    res.status(500).json({ message: 'Error updating scientist' });
  }
};

exports.addHistory = async (req, res) => {
  const scientist_id = req.params.id;
  const { type, title, description, amount, from_date, to_date } = req.body;

  const conn = await pool.getConnection();
  await conn.beginTransaction();

  try {
    await conn.query(
      `INSERT INTO scientist_history 
       (scientist_id, type, title, description, amount, from_date, to_date) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [scientist_id, type, title, description, amount, from_date, to_date]
    );

    if (type === 'promotion') {
      const gradeMatch = title.match(/Grade\s([A-G])/);
      if (!gradeMatch) throw new Error('Invalid promotion title format');

      const newGrade = gradeMatch[1];
      const [groupRows] = await conn.query(
        `SELECT id FROM admin_groups WHERE ? BETWEEN grade_start AND grade_end`,
        [newGrade]
      );

      if (groupRows.length === 0) throw new Error('No admin group for new grade');

      const newGroupId = groupRows[0].id;

      await conn.query(
        `UPDATE scientists SET current_grade = ?, group_id = ? WHERE id = ?`,
        [newGrade, newGroupId, scientist_id]
      );
    }

    await conn.commit();
    res.json({ message: 'History entry added successfully' });
  } catch (err) {
    await conn.rollback();
    console.error(err);
    res.status(500).json({ message: 'Error adding history entry' });
  } finally {
    conn.release();
  }
};

exports.searchScientistByName = async (req, res) => {
  const groupId = req.user.group_id;
  const { name } = req.query;

  if (!name) return res.status(400).json({ message: 'Name is required' });

  try {
    const [scientists] = await pool.query(
      `SELECT emp_no, name, current_grade, department FROM scientists 
       WHERE group_id = ? AND name LIKE ?`,
      [groupId, `%${name}%`]
    );

    res.json(scientists);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Search error' });
  }
};

exports.getCompleteScientistDetails = async (req, res) => {
  const groupId = req.user.group_id;
  const emp_no = req.params.emp_no;

  try {
    const [profileRows] = await pool.query(
      `SELECT * FROM scientists WHERE emp_no = ? AND group_id = ?`,
      [emp_no, groupId]
    );

    if (profileRows.length === 0) {
      return res.status(404).json({ message: 'Scientist not found or not under your group' });
    }

    const scientist = profileRows[0];

    const [historyRows] = await pool.query(
      `SELECT type, title, description, amount, from_date, to_date, created_at 
       FROM scientist_history 
       WHERE scientist_id = ? 
       ORDER BY from_date DESC`,
      [scientist.id]
    );

    const history = {
      promotion: [],
      salary: [],
      leave: [],
      transfer: [],
      award: []
    };

    historyRows.forEach(record => {
      if (history[record.type]) {
        history[record.type].push(record);
      }
    });

    res.json({
      profile: scientist,
      history: history
    });
  } catch (err) {
    console.error('Complete Scientist Error:', err);
    res.status(500).json({ message: 'Failed to fetch complete scientist details' });
  }
};
