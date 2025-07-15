const pool = require('../db_config/db_connection');

// ROUTE 1: Create a new group (POST /api/supervisor/group)
exports.createGroup = async (req, res) => {
  const { group_name } = req.body;

  // Validate group name
  if (!group_name) {
    return res.status(400).json({ error: "Group name is required" });
  }

  try {
    // Insert new group into the `group` table
    const [result] = await pool.query(
      'INSERT INTO `group` (group_name) VALUES (?)',
      [group_name]
    );

    // Check if insertion was successful
    if (!result.insertId) {
      return res.status(500).json({ error: "Group creation failed" });
    }

    // Respond with created group details
    res.status(201).json({
      message: "Group created successfully",
      group: { group_id: result.insertId, group_name }
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Server error" });
  }
};

// ROUTE 2: Add a new admin (POST /api/supervisor/admin)
exports.addAdmin = async (req, res) => {
  const { employeeData, supervisor_id, group_id } = req.body;

  // Validate required fields
  if (!employeeData || !group_id) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  // Use manual transaction for consistency
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    // Step 1: Insert admin's details into the employee table
    const empQuery = `
      INSERT INTO employee (
        password, firstname, middlename, lastname, email, gender, cadre, pay_level,
        category, education_qualification, university, subject, date_of_birth,
        aadhaar, pan_number, pis_pin_number, date_of_joining, date_of_retirement,
        date_in_present_designation, address1_permanent, address2_temporary
      ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
    `;
    const empValues = [
      employeeData.password,
      employeeData.firstname,
      employeeData.middlename || null,
      employeeData.lastname,
      employeeData.email,
      employeeData.gender,
      employeeData.cadre || null,
      employeeData.pay_level || null,
      employeeData.category || null,
      employeeData.education_qualification,
      employeeData.university || null,
      employeeData.subject || null,
      employeeData.date_of_birth || null,
      employeeData.aadhaar,
      employeeData.pan_number || null,
      employeeData.pis_pin_number || null,
      employeeData.date_of_joining || null,
      employeeData.date_of_retirement || null,
      employeeData.date_in_present_designation || null,
      employeeData.address1_permanent || null,
      employeeData.address2_temporary || null
    ];
    const [empResult] = await connection.query(empQuery, empValues);

    if (!empResult.insertId) throw new Error("Employee creation failed");

    const empId = empResult.insertId;

    // Step 2: Register employee as admin in administrator table
    const adminQuery = `
      INSERT INTO administrator (id, supervisor_id, group_id)
      VALUES (?, ?, ?)
    `;
    const [adminResult] = await connection.query(adminQuery, [
      empId,
      supervisor_id || null,
      group_id
    ]);

    if (!adminResult.affectedRows) throw new Error("Administrator creation failed");

    await connection.commit();

    res.status(201).json({
      message: "Admin added successfully",
      admin: { id: empId, supervisor_id, group_id }
    });
  } catch (error) {
    await connection.rollback();
    console.error(error.message);
    res.status(500).json({ error: error.message || "Server error" });
  } finally {
    connection.release();
  }
};

// ROUTE 3: Add a new scientist (POST /api/supervisor/scientist)
exports.addScientist = async (req, res) => {
  const { employeeData, category, research_area, grade, group_id } = req.body;

  // Validate required fields
  if (!employeeData || !category || !grade || !group_id) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    // Step 1: Insert scientist's data into employee table
    const empQuery = `
      INSERT INTO employee (
        password, firstname, middlename, lastname, email, gender, cadre, pay_level,
        category, education_qualification, university, subject, date_of_birth,
        aadhaar, pan_number, pis_pin_number, date_of_joining, date_of_retirement,
        date_in_present_designation, address1_permanent, address2_temporary
      ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
    `;
    const empValues = [
      employeeData.password,
      employeeData.firstname,
      employeeData.middlename || null,
      employeeData.lastname,
      employeeData.email,
      employeeData.gender,
      employeeData.cadre || null,
      employeeData.pay_level || null,
      employeeData.category || null,
      employeeData.education_qualification,
      employeeData.university || null,
      employeeData.subject || null,
      employeeData.date_of_birth || null,
      employeeData.aadhaar,
      employeeData.pan_number || null,
      employeeData.pis_pin_number || null,
      employeeData.date_of_joining || null,
      employeeData.date_of_retirement || null,
      employeeData.date_in_present_designation || null,
      employeeData.address1_permanent || null,
      employeeData.address2_temporary || null
    ];
    const [empResult] = await connection.query(empQuery, empValues);
    if (!empResult.insertId) throw new Error("Employee creation failed");

    const empId = empResult.insertId;

    // Step 2: Add entry into scientist table
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
    if (!sciResult.affectedRows) throw new Error("Scientist creation failed");

    // Step 3: Ensure grade is registered for this group
    const [gradeRows] = await connection.query(
      `SELECT 1 FROM managed_scientist_grade WHERE group_id = ? AND scientist_grade = ?`,
      [group_id, grade]
    );
    if (gradeRows.length === 0) {
      // Register the grade for this group
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
    res.status(500).json({ error: error.message || "Server error" });
  } finally {
    connection.release();
  }
};

// ROUTE 4: Assign an admin to a group (PUT /api/supervisor/admin/group)
exports.assignAdminToGroup = async (req, res) => {
  const { admin_id, group_id } = req.body;

  // Validate inputs
  if (!admin_id || !group_id) {
    return res.status(400).json({ error: "Admin ID and Group ID are required" });
  }

  try {
    // Update group assignment in administrator table
    const [result] = await pool.query(
      `UPDATE administrator 
       SET group_id = ? 
       WHERE id = ?`,
      [group_id, admin_id]
    );

    // If no rows affected, admin ID is likely invalid
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

// ROUTE 5: Get full group hierarchy (GET /api/supervisor/groups)
exports.getGroupHierarchy = async (req, res) => {
  try {
    // Step 1: Fetch all groups
    const [groups] = await pool.query('SELECT * FROM `group`');
    if (groups.length === 0) {
      return res.status(404).json({ error: "No groups found" });
    }

    // Step 2: Fetch all admins
    const [admins] = await pool.query(`
      SELECT a.id, a.group_id, e.firstname, e.lastname, a.supervisor_id
      FROM administrator a
      JOIN employee e ON a.id = e.id
    `);

    // Step 3: Fetch all scientists
    const [scientists] = await pool.query(`
      SELECT s.emp_id, s.group_id, e.firstname, e.lastname, s.grade
      FROM scientist s
      JOIN employee e ON s.emp_id = e.id
    `);

    // Step 4: Fetch all managed grades
    const [grades] = await pool.query('SELECT * FROM managed_scientist_grade');

    // Step 5: Build nested structure with related admins, scientists, grades
    const hierarchy = groups.map(group => ({
      group_id: group.group_id,
      group_name: group.group_name,
      managed_grades: grades
        .filter(g => g.group_id === group.group_id)
        .map(g => g.scientist_grade),
      administrators: admins.filter(a => a.group_id === group.group_id),
      scientists: scientists.filter(s => s.group_id === group.group_id)
    }));
    res.json({ hierarchy });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Server error" });
  }
};
