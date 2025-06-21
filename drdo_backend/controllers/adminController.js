const pool = require('../config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.login = async (req, res) => {
  const { emp_no, password } = req.body;

  try {
    const [rows] = await pool.query('SELECT * FROM admin_employees WHERE emp_no = ?', [emp_no]);
    const admin = rows[0];

    if (!admin) return res.status(401).json({ message: 'Invalid credentials' });

    const match = await bcrypt.compare(password, admin.password);
    if (!match) return res.status(401).json({ message: 'Invalid credentials' });

    const token = jwt.sign(
      { id: admin.id, role: 'admin', group_id: admin.group_id },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.json({ message: 'Login successful', token, admin });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.addScientist = async (req, res) => {
  const {
    emp_no, name, age, gender, phone, email,
    qualification, date_of_joining, current_grade, department
  } = req.body;

  const group_id = req.user.group_id; // ✅ Extract group ID from token

  try {
    // 1. Check if scientist already exists
    const [existing] = await pool.query('SELECT * FROM scientists WHERE emp_no = ?', [emp_no]);
    if (existing.length > 0) {
      return res.status(400).json({ message: 'Scientist with this employee number already exists' });
    }

    // 2. Validate grade belongs to the current admin's group
    const [groupRange] = await pool.query(
      `SELECT grade_start, grade_end FROM admin_groups WHERE id = ?`,
      [group_id]
    );

    if (groupRange.length === 0) {
      return res.status(400).json({ message: 'Your admin group does not exist' });
    }

    const { grade_start, grade_end } = groupRange[0];

    if (current_grade < grade_start || current_grade > grade_end) {
      return res.status(403).json({
        message: `You are not authorized to add a scientist of Grade ${current_grade}. Your group can manage only Grade ${grade_start} to ${grade_end}.`
      });
    }

    // 3. Insert scientist under the same group as admin
    await pool.query(
      `INSERT INTO scientists 
       (emp_no, name, age, gender, phone, email, qualification, date_of_joining, department, current_grade, group_id) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [emp_no, name, age, gender, phone, email, qualification, date_of_joining, department, current_grade, group_id]
    );

    res.status(201).json({ message: 'Scientist added successfully' });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error while adding scientist' });
  }
};

exports.getScientistsUnderGroup = async (req, res) => {
  const groupId = req.user.group_id;

  try {
    const [scientists] = await pool.query(
      `SELECT id, name, emp_no, current_grade, department 
       FROM scientists 
       WHERE group_id = ?`,
      [groupId]
    );

    res.json(scientists);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch scientists' });
  }
};