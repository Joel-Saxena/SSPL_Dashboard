const pool = require('../config/db');

// Create new group
exports.createGroup = async (req, res) => {
  const { group_name } = req.body;
  if (!group_name) {
    return res.status(400).json({ error: "Group name is required" });
  }

  try {
    const result = await pool.query(
      'INSERT INTO "group" (group_name) VALUES ($1) RETURNING *',
      [group_name]
    );
    
    if (result.rows.length === 0) {
      return res.status(500).json({ error: "Group creation failed" });
    }
    
    res.status(201).json({
      message: "Group created successfully",
      group: result.rows[0]
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Server error" });
  }
};

// Add new admin
exports.addAdmin = async (req, res) => {
  const { 
    employeeData, 
    supervisor_id, 
    group_id 
  } = req.body;

  if (!employeeData || !group_id) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // Create employee
    const empQuery = `
      INSERT INTO employee (
        firstname, middlename, lastname, 
        email, gender, salary, aadhaar, education_qualification
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) 
      RETURNING id
    `;
    const empValues = [
      employeeData.firstname,
      employeeData.middlename || null,
      employeeData.lastname,
      employeeData.email,
      employeeData.gender,
      employeeData.salary,
      employeeData.aadhaar,
      employeeData.education_qualification
    ];
    
    const empResult = await client.query(empQuery, empValues);
    if (empResult.rows.length === 0) {
      throw new Error("Employee creation failed");
    }
    
    const empId = empResult.rows[0].id;

    // Create administrator
    const adminQuery = `
      INSERT INTO administrator (id, supervisor_id, group_id)
      VALUES ($1, $2, $3)
      RETURNING *
    `;
    const adminResult = await client.query(adminQuery, [
      empId, 
      supervisor_id || null, 
      group_id
    ]);
    
    if (adminResult.rows.length === 0) {
      throw new Error("Administrator creation failed");
    }

    await client.query('COMMIT');
    res.status(201).json({
      message: "Admin added successfully",
      admin: adminResult.rows[0]
    });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error(error.message);
    res.status(500).json({ 
      error: error.message || "Server error" 
    });
  } finally {
    client.release();
  }
};

// Add new scientist
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

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // Create employee
    const empQuery = `
      INSERT INTO employee (
        firstname, middlename, lastname, 
        email, gender, salary, aadhaar, education_qualification
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) 
      RETURNING id
    `;
    const empValues = [
      employeeData.firstname,
      employeeData.middlename || null,
      employeeData.lastname,
      employeeData.email,
      employeeData.gender,
      employeeData.salary,
      employeeData.aadhaar,
      employeeData.education_qualification
    ];
    
    const empResult = await client.query(empQuery, empValues);
    if (empResult.rows.length === 0) {
      throw new Error("Employee creation failed");
    }
    
    const empId = empResult.rows[0].id;

    // Create scientist
    const sciQuery = `
      INSERT INTO scientist (emp_id, category, research_area, grade, group_id)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `;
    const sciResult = await client.query(sciQuery, [
      empId, 
      category, 
      research_area || null, 
      grade, 
      group_id
    ]);
    
    if (sciResult.rows.length === 0) {
      throw new Error("Scientist creation failed");
    }

    await client.query('COMMIT');
    res.status(201).json({
      message: "Scientist added successfully",
      scientist: sciResult.rows[0]
    });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error(error.message);
    res.status(500).json({ 
      error: error.message || "Server error" 
    });
  } finally {
    client.release();
  }
};

// Assign admin to group
exports.assignAdminToGroup = async (req, res) => {
  const { admin_id, group_id } = req.body;
  if (!admin_id || !group_id) {
    return res.status(400).json({ error: "Admin ID and Group ID are required" });
  }

  try {
    const result = await pool.query(
      `UPDATE administrator 
       SET group_id = $1 
       WHERE id = $2 
       RETURNING *`,
      [group_id, admin_id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Admin not found or update failed" });
    }

    res.json({
      message: "Admin assigned to group successfully",
      admin: result.rows[0]
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Server error" });
  }
};

// Get group hierarchy
exports.getGroupHierarchy = async (req, res) => {
  try {
    // Get all groups
    const groupsQuery = 'SELECT * FROM "group"';
    const groupsResult = await pool.query(groupsQuery);
    
    if (groupsResult.rows.length === 0) {
      return res.status(404).json({ error: "No groups found" });
    }

    const groups = groupsResult.rows;
    
    // Get administrators for each group
    const adminsQuery = `
      SELECT a.id, a.group_id, e.firstname, e.lastname, a.supervisor_id
      FROM administrator a
      JOIN employee e ON a.id = e.id
    `;
    const adminsResult = await pool.query(adminsQuery);
    const admins = adminsResult.rows;
    
    // Get scientists for each group
    const scientistsQuery = `
      SELECT s.emp_id, s.group_id, e.firstname, e.lastname, s.grade
      FROM scientist s
      JOIN employee e ON s.emp_id = e.id
    `;
    const scientistsResult = await pool.query(scientistsQuery);
    const scientists = scientistsResult.rows;
    
    // Get managed grades for each group
    const gradesQuery = 'SELECT * FROM managed_scientist_grade';
    const gradesResult = await pool.query(gradesQuery);
    const grades = gradesResult.rows;

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

// Update admins of a group
exports.updateAdminsOfGroup = async (req, res) => {
  const { group_id, admin_ids } = req.body;
  if (!group_id || !admin_ids || !Array.isArray(admin_ids)) {
    return res.status(400).json({ 
      error: "Group ID and array of Admin IDs are required" 
    });
  }

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // Clear existing group assignments
    await client.query(
      `UPDATE administrator 
       SET group_id = NULL 
       WHERE group_id = $1`,
      [group_id]
    );

    // Assign new admins
    for (const admin_id of admin_ids) {
      await client.query(
        `UPDATE administrator 
         SET group_id = $1 
         WHERE id = $2`,
        [group_id, admin_id]
      );
    }

    await client.query('COMMIT');
    res.json({ 
      message: `Group admins updated successfully for group ${group_id}` 
    });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error(error.message);
    res.status(500).json({ error: "Server error" });
  } finally {
    client.release();
  }
};

// Change grades managed in a group
exports.changeGroupGrades = async (req, res) => {
  const { group_id, grades } = req.body;
  if (!group_id || !grades || !Array.isArray(grades)) {
    return res.status(400).json({ 
      error: "Group ID and grades array are required" 
    });
  }

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // Remove existing grades
    await client.query(
      `DELETE FROM managed_scientist_grade 
       WHERE group_id = $1`,
      [group_id]
    );

    // Insert new grades
    for (const grade of grades) {
      await client.query(
        `INSERT INTO managed_scientist_grade (group_id, scientist_grade)
         VALUES ($1, $2)`,
        [group_id, grade]
      );
    }

    await client.query('COMMIT');
    res.json({ 
      message: `Managed grades updated for group ${group_id}`,
      updated_grades: grades
    });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error(error.message);
    res.status(500).json({ error: "Server error" });
  } finally {
    client.release();
  }
};