// Handles all admin functionalities (for scientists in their group only)
const pool = require('../db_config/db_connection');

// TODO: All logic that ensures 'Only allow update if scientist is in admin's group" will be based on JWT token later.

// ROUTE 1: Get all scientists in admin's group (GET /api/admin/scientists)
// Get all scientists in admin's group
exports.getScientistsInGroup = async (req, res) => {
  try {
    const groupId = req.body.group_id;
    const [scientists] = await pool.query(
      `SELECT s.emp_id, e.firstname, e.lastname, s.grade, s.category, s.research_area
       FROM scientist s JOIN employee e ON s.emp_id = e.id WHERE s.group_id = ?`,
      [groupId]
    );
    res.json(scientists);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching scientists' });
  }
};

// ROUTE 2: Update scientist details (PUT /api/admin/scientist/:id)
// Update scientist details
exports.updateScientistDetails = async (req, res) => {
  try {
    const groupId = req.body.admin_group_id;
    const sciId = req.params.id;

    // Only allow update if scientist is in admin's group
    const [rows] = await pool.query('SELECT * FROM scientist WHERE emp_id = ? AND group_id = ?', [sciId, groupId]);
    if (rows.length === 0) return res.status(403).json({ message: 'Not authorized' });

    // Update employee table fields
    const { firstname, middlename, lastname, gender, salary, aadhaar, education_qualification, category, research_area, grade } = req.body;
    let affectedRows = 0;

    if (firstname || middlename || lastname || gender || salary || aadhaar || education_qualification) {
      const [empResult] = await pool.query(
        `UPDATE employee SET firstname = COALESCE(?, firstname), middlename = COALESCE(?, middlename), lastname = COALESCE(?, lastname), gender = COALESCE(?, gender), salary = COALESCE(?, salary), aadhaar = COALESCE(?, aadhaar), education_qualification = COALESCE(?, education_qualification) WHERE id = ?`,
        [firstname, middlename, lastname, gender, salary, aadhaar, education_qualification, sciId]
      );
      affectedRows += empResult.affectedRows;
    }

    // If grade is being updated, check if group manages the new grade
    if (grade) {
      // Get current group_id of the scientist
      const [[sci]] = await pool.query('SELECT group_id FROM scientist WHERE emp_id = ?', [sciId]);
      if (sci && sci.group_id !== null) {
        // Check if the group manages the new grade
        const [managed] = await pool.query(
          'SELECT * FROM managed_scientist_grade WHERE group_id = ? AND scientist_grade = ?',
          [sci.group_id, grade]
        );
        if (managed.length === 0) {
          // Group does not manage new grade, set group_id to NULL
          const [sciResult] = await pool.query(
            'UPDATE scientist SET grade = ?, group_id = NULL, category = COALESCE(?, category), research_area = COALESCE(?, research_area) WHERE emp_id = ?',
            [grade, category, research_area, sciId]
          );
          affectedRows += sciResult.affectedRows;
        } else {
          // Group manages new grade, update normally
          const [sciResult] = await pool.query(
            'UPDATE scientist SET grade = ?, category = COALESCE(?, category), research_area = COALESCE(?, research_area) WHERE emp_id = ?',
            [grade, category, research_area, sciId]
          );
          affectedRows += sciResult.affectedRows;
        }
      } else {
        // No group assigned, just update
        const [sciResult] = await pool.query(
          'UPDATE scientist SET grade = ?, category = COALESCE(?, category), research_area = COALESCE(?, research_area) WHERE emp_id = ?',
          [grade, category, research_area, sciId]
        );
        affectedRows += sciResult.affectedRows;
      }
    } else if (category || research_area) {
      // Only category or research_area is being updated
      const [sciResult] = await pool.query(
        'UPDATE scientist SET category = COALESCE(?, category), research_area = COALESCE(?, research_area) WHERE emp_id = ?',
        [category, research_area, sciId]
      );
      affectedRows += sciResult.affectedRows;
    }

    if (affectedRows === 0) {
      return res.status(404).json({ message: 'No scientist found or nothing updated' });
    }
    
    res.json({ message: 'Scientist updated successfully' });
  } catch (err) {
    res.status(500).json({ message: `Error updating scientist: ${err.message}` });
  }
};

// ROUTE 3: Search scientist by name (GET /api/admin/search)
// Search scientist by name
exports.searchScientistByName = async (req, res) => {
  try {
    // Use admin_group_id from request body to ensure search is within admin's group
    const groupId = req.body.admin_group_id;
    const { name } = req.query;
    if (!name) return res.status(400).json({ message: 'Name is required' });
    const [scientists] = await pool.query(
      `SELECT s.emp_id, e.firstname, e.lastname, s.grade, s.category, s.research_area
       FROM scientist s JOIN employee e ON s.emp_id = e.id
       WHERE s.group_id = ? AND (e.firstname LIKE ? OR e.lastname LIKE ?)`,
      [groupId, `%${name}%`, `%${name}%`]
    );
    res.json(scientists);
  } catch (err) {
    res.status(500).json({ message: 'Error searching scientist' });
  }
};

// ROUTE 4: Get complete scientist details (GET /api/admin/scientist/:id)
// Get complete scientist details
exports.getCompleteScientistDetails = async (req, res) => {
  try {
    const groupId = req.body.admin_group_id;
    const sciId = req.params.id;

    // console.log(`Fetching details for scientist ID: ${sciId} in group ID: ${groupId}`);

    // Only allow if scientist is in admin's group
    const [rows] = await pool.query('SELECT * FROM scientist WHERE emp_id = ? AND group_id = ?', [sciId, groupId]);
    if (rows.length === 0) return res.status(404).json({ message: 'Scientist not found or not in your group' });
    const [profileRows] = await pool.query(
      `SELECT e.*, s.category, s.research_area, s.grade, s.group_id
       FROM employee e JOIN scientist s ON e.id = s.emp_id WHERE s.emp_id = ?`,
      [sciId]
    );
    const [phones] = await pool.query('SELECT phone_no FROM phone_number WHERE emp_id = ?', [sciId]);
    const [history] = await pool.query('SELECT * FROM history WHERE sci_id = ?', [sciId]);
    res.json({ profile: profileRows[0], phones, history });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching scientist details' });
  }
};
