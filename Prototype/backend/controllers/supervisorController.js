const pool = require('../db_config/db_connection');

// ROUTE 1: Create new group (POST /api/supervisor/group)
exports.createGroup = async (req, res) => {
  const { group_name } = req.body;
  if (!group_name) {
    return res.status(400).json({ error: "Group name is required" });
  }

  try {
    const [result] = await pool.query(
      'INSERT INTO `group` (group_name) VALUES (?)',
      [group_name]
    );
    if (!result.insertId) {
      return res.status(500).json({ error: "Group creation failed" });
    }
    res.status(201).json({
      message: "Group created successfully",
      group: { group_id: result.insertId, group_name }
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Server error" });
  }
};

// ROUTE 2: Add new admin (POST /api/supervisor/admin)
exports.addAdmin = async (req, res) => {
  const { 
    employeeData, 
    supervisor_id, 
    group_id 
  } = req.body;

  if (!employeeData || !group_id) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    // Create employee
    const empQuery = `
      INSERT INTO employee (
        password, firstname, middlename, lastname, 
        email, gender, salary, aadhaar, education_qualification
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const empValues = [
      employeeData.password,
      employeeData.firstname,
      employeeData.middlename || null,
      employeeData.lastname,
      employeeData.email,
      employeeData.gender,
      employeeData.salary,
      employeeData.aadhaar,
      employeeData.education_qualification
    ];
    const [empResult] = await connection.query(empQuery, empValues);
    if (!empResult.insertId) {
      throw new Error("Employee creation failed");
    }
    const empId = empResult.insertId;

    // Create administrator
    const adminQuery = `
      INSERT INTO administrator (id, supervisor_id, group_id)
      VALUES (?, ?, ?)
    `;
    const [adminResult] = await connection.query(adminQuery, [
      empId, 
      supervisor_id || null, 
      group_id
    ]);
    if (!adminResult.affectedRows) {
      throw new Error("Administrator creation failed");
    }

    await connection.commit();
    res.status(201).json({
      message: "Admin added successfully",
      admin: { id: empId, supervisor_id, group_id }
    });
  } catch (error) {
    await connection.rollback();
    console.error(error.message);
    res.status(500).json({ 
      error: error.message || "Server error" 
    });
  } finally {
    connection.release();
  }
};

// ROUTE 3: Add new scientist (POST /api/supervisor/scientist)
exports.addScientist = async (req, res) => {
  const { 
    employeeData, 
    category, 
    research_area, 
    grade, 
    group_id 
  } = req.body;

  if (!employeeData || !category || !grade || !group_id) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    // Create employee
    const empQuery = `
      INSERT INTO employee (
        password, firstname, middlename, lastname, 
        email, gender, salary, aadhaar, education_qualification
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const empValues = [
      employeeData.password,
      employeeData.firstname,
      employeeData.middlename || null,
      employeeData.lastname,
      employeeData.email,
      employeeData.gender,
      employeeData.salary,
      employeeData.aadhaar,
      employeeData.education_qualification
    ];
    const [empResult] = await connection.query(empQuery, empValues);
    if (!empResult.insertId) {
      throw new Error("Employee creation failed");
    }
    const empId = empResult.insertId;

    // Create scientist
    const sciQuery = `
      INSERT INTO scientist (emp_id, category, research_area, grade, group_id)
      VALUES (?, ?, ?, ?, ?)
    `;
    const [sciResult] = await connection.query(sciQuery, [
      empId, 
      category, 
      research_area || null, 
      grade, 
      group_id
    ]);
    if (!sciResult.affectedRows) {
      throw new Error("Scientist creation failed");
    }

    // Ensure the grade is managed by the group
    const [gradeRows] = await connection.query(
      `SELECT 1 FROM managed_scientist_grade WHERE group_id = ? AND scientist_grade = ?`,
      [group_id, grade]
    );
    if (gradeRows.length === 0) {
      await connection.query(
        `INSERT INTO managed_scientist_grade (group_id, scientist_grade) VALUES (?, ?)`,
        [group_id, grade]
      );
    }

    await connection.commit();
    res.status(201).json({
      message: "Scientist added successfully",
      scientist: { emp_id: empId, category, research_area, grade, group_id }
    });
  } catch (error) {
    await connection.rollback();
    console.error(error.message);
    res.status(500).json({ 
      error: error.message || "Server error" 
    });
  } finally {
    connection.release();
  }
};

// ROUTE 4: Update admin's group (PUT /api/supervisor/admin/group)
exports.assignAdminToGroup = async (req, res) => {
  const { admin_id, group_id } = req.body;
  if (!admin_id || !group_id) {
    return res.status(400).json({ error: "Admin ID and Group ID are required" });
  }

  try {
    const [result] = await pool.query(
      `UPDATE administrator 
       SET group_id = ? 
       WHERE id = ?`,
      [group_id, admin_id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Admin not found or update failed" });
    }

    res.json({
      message: "Admin assigned to group successfully",
      admin: { id: admin_id, group_id }
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Server error" });
  }
};

// ROUTE 5: Get group hierarchy (GET /api/supervisor/groups)
exports.getGroupHierarchy = async (req, res) => {
  try {
    // Get all groups
    const [groups] = await pool.query('SELECT * FROM `group`');
    if (groups.length === 0) {
      return res.status(404).json({ error: "No groups found" });
    }

    // Get administrators for each group
    const [admins] = await pool.query(`
      SELECT a.id, a.group_id, e.firstname, e.lastname, a.supervisor_id
      FROM administrator a
      JOIN employee e ON a.id = e.id
    `);

    // Get scientists for each group
    const [scientists] = await pool.query(`
      SELECT s.emp_id, s.group_id, e.firstname, e.lastname, s.grade
      FROM scientist s
      JOIN employee e ON s.emp_id = e.id
    `);

    // Get managed grades for each group
    const [grades] = await pool.query('SELECT * FROM managed_scientist_grade');

    // Build hierarchy structure
    const hierarchy = groups.map(group => ({
      group_id: group.group_id,
      group_name: group.group_name,
      managed_grades: grades
        .filter(g => g.group_id === group.group_id)
        .map(g => g.scientist_grade),
      administrators: admins
        .filter(a => a.group_id === group.group_id),
      scientists: scientists
        .filter(s => s.group_id === group.group_id)
    }));

    res.json({ hierarchy });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Server error" });
  }
};

