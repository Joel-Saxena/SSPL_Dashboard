// Handles login for admin/supervisor
const jwt = require('jsonwebtoken');
const pool = require('../db_config/db_connection');

// ROUTE 1: Login (POST /api/auth/login)
// Allows admin or scientist to login with emp_id and password
exports.login = async (req, res) => {
  const { emp_id, password } = req.body;
  if (!emp_id || !password) {
    return res.status(400).json({ message: 'emp_id and password required' });
  }
  try {
    // Check if employee exists with given emp_id and password
    const [rows] = await pool.query('SELECT * FROM employee WHERE id = ? AND password = ?', [emp_id, password]);
    if (rows.length === 0) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    // Optionally, check if user is admin or scientist
    const [adminRows] = await pool.query('SELECT * FROM administrator WHERE id = ?', [emp_id]);
    const [sciRows] = await pool.query('SELECT * FROM scientist WHERE emp_id = ?', [emp_id]);
    let role = null;
    let group_id = null;

    if (adminRows.length > 0) {
      if (adminRows[0].supervisor_id === adminRows[0].id) {
        role = 'super_admin';
      } else {
        role = 'admin';
      group_id = adminRows[0].group_id;
        if (!group_id) {
          return res.status(500).json({ message: 'Administrator group_id missing' });
        }
      }
    } else {
      return res.status(403).json({ message: 'Access denied — Not an admin' });
    }

    const token = jwt.sign(
      { emp_id, role, group_id },
      process.env.JWT_SECRET
    );

    res.json({ token, role, emp_id });
  } catch (err) {
    res.status(500).json({ message: 'Error during login' });
  }
};
