const pool = require('../config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.login = async (req, res) => {
  const { username, password } = req.body;

  try {
    const [rows] = await pool.query('SELECT * FROM super_admin WHERE username = ?', [username]);
    const user = rows[0];

    if (!user) return res.status(401).json({ message: 'Invalid credentials' });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ message: 'Invalid credentials' });

    const token = jwt.sign(
      { id: user.id, role: 'superadmin' },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.json({ message: 'Login successful', token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.addGroup = async (req, res) => {
  const { group_name, grade_start, grade_end } = req.body;

  try {
    const [existing] = await pool.query('SELECT * FROM admin_groups WHERE group_name = ?', [group_name]);
    if (existing.length > 0) {
      return res.status(400).json({ message: 'Group name already exists' });
    }

    await pool.query(
      'INSERT INTO admin_groups (group_name, grade_start, grade_end) VALUES (?, ?, ?)',
      [group_name, grade_start, grade_end]
    );

    res.json({ message: 'Group added successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.addAdmin = async (req, res) => {
  const { emp_no, name, password, date_of_joining, group_id } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    await pool.query(
      'INSERT INTO admin_employees (emp_no, name, password, date_of_joining, group_id) VALUES (?, ?, ?, ?, ?)',
      [emp_no, name, hashedPassword, date_of_joining, group_id]
    );

    res.json({ message: 'Admin employee added successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error adding admin employee' });
  }
};

exports.getGroupHierarchy = async (req, res) => {
  try {
    const [groups] = await pool.query('SELECT * FROM admin_groups');

    const result = [];

    for (const group of groups) {
      const [admins] = await pool.query(
        `SELECT id, emp_no, name, date_of_joining 
         FROM admin_employees 
         WHERE group_id = ?`,
        [group.id]
      );

      const [scientists] = await pool.query(
        `SELECT id, emp_no, name, current_grade, department 
         FROM scientists 
         WHERE group_id = ?`,
        [group.id]
      );

      result.push({
        group_id: group.id,
        group_name: group.group_name,
        grade_range: `${group.grade_start} to ${group.grade_end}`,
        admins,
        scientists
      });
    }

    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching group hierarchy' });
  }
};

exports.updateAdminGroup = async (req, res) => {
  const { admin_id, new_group_id } = req.body;

  try {
    const [admin] = await pool.query('SELECT * FROM admin_employees WHERE id = ?', [admin_id]);
    if (admin.length === 0) {
      return res.status(404).json({ message: 'Admin employee not found' });
    }

    await pool.query(
      'UPDATE admin_employees SET group_id = ? WHERE id = ?',
      [new_group_id, admin_id]
    );

    res.json({ message: 'Admin group updated successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error updating admin group' });
  }
};

exports.updateGroupGradeRange = async (req, res) => {
  const { group_id, grade_start, grade_end } = req.body;

  try {
    const [group] = await pool.query('SELECT * FROM admin_groups WHERE id = ?', [group_id]);
    if (group.length === 0) {
      return res.status(404).json({ message: 'Group not found' });
    }

    await pool.query(
      'UPDATE admin_groups SET grade_start = ?, grade_end = ? WHERE id = ?',
      [grade_start, grade_end, group_id]
    );

    res.json({ message: 'Group grade range updated successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error updating group grade range' });
  }
};
