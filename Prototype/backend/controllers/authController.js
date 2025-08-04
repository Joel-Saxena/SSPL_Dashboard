// Handles login for admin/supervisor
import jwt from 'jsonwebtoken';
import pool from '../db_config/db_connection.js';

// ROUTE 1: Login (POST /api/auth/login)
// Allows admin or scientist to login with emp_id and password
export const login = async (req, res) => {
  const { emp_id, password } = req.body;

  // Validate input fields
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
    let role = null;
    let group_id = null;

    if (adminRows.length > 0) {
      // Step 3: Determine role — either 'super_admin' or 'admin'
      if (adminRows[0].supervisor_id === adminRows[0].id) {
        role = 'super_admin'; // Supervisor of themselves = super admin
      } else {
        role = 'admin';
        group_id = adminRows[0].group_id;

        // Admin must have a group assigned
        if (!group_id) {
          return res.status(500).json({ message: 'Administrator group_id missing' });
        }
      }
    } else {
      // If not found in administrator table, deny access
      return res.status(403).json({ message: 'Access denied — Not an admin' });
    }

    // Step 4: Generate JWT token with role and group info
    const token = jwt.sign(
      { emp_id, role, group_id },       // Payload
      process.env.JWT_SECRET            // Secret key from .env
    );

    // Step 5: Respond with token and user info
    res.json({ token, role, emp_id, group_id });

  } catch (err) {
    // Handle unexpected errors
    res.status(500).json({ message: 'Error during login' });
  }
};
