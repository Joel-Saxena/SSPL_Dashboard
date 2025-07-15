const pool = require('../db_config/db_connection');

// ROUTE 1: Get all scientists in the admin's group (GET /api/admin/scientists)
exports.getScientistsInGroup = async (req, res) => {
  try {
    const groupId = req.user.group_id; // Extract group_id from authenticated user's JWT
    const [scientists] = await pool.query(
      `SELECT s.emp_id, e.firstname, e.lastname, s.grade, s.category, s.research_area
       FROM scientist s 
       JOIN employee e ON s.emp_id = e.id 
       WHERE s.group_id = ?`,
      [groupId]
    );
    res.json(scientists); // Return list of scientists in the admin's group
  } catch (err) {
    res.status(500).json({ message: 'Error fetching scientists' });
  }
};

// ROUTE 2: Update scientist details (PUT /api/admin/scientist/:id)
exports.updateScientistDetails = async (req, res) => {
  try {
    const groupId = req.user.group_id; // Admin's group_id from JWT
    const sciId = req.params.id; // Scientist's employee ID from URL

    // Check if the scientist belongs to this admin's group
    const [rows] = await pool.query(
      'SELECT * FROM scientist WHERE emp_id = ? AND group_id = ?', 
      [sciId, groupId]
    );
    if (rows.length === 0) return res.status(403).json({ message: 'Not authorized' });

    // Extract updatable fields from request body
    const {
      firstname, middlename, lastname, gender, aadhaar, education_qualification,
      category, research_area, grade, pay_level, university, subject, date_of_birth,
      date_of_joining, date_of_retirement, date_in_present_designation,
      address1_permanent, address2_temporary
    } = req.body;

    let affectedRows = 0;

    // Update EMPLOYEE details if any of the personal fields are present
    if (
      firstname || middlename || lastname || gender || aadhaar || education_qualification ||
      pay_level || university || subject || date_of_birth || date_of_joining || date_of_retirement ||
      date_in_present_designation || address1_permanent || address2_temporary
    ) {
      const [empResult] = await pool.query(
        `UPDATE employee SET
           firstname = COALESCE(?, firstname),
           middlename = COALESCE(?, middlename),
           lastname = COALESCE(?, lastname),
           gender = COALESCE(?, gender),
           aadhaar = COALESCE(?, aadhaar),
           education_qualification = COALESCE(?, education_qualification),
           pay_level = COALESCE(?, pay_level),
           university = COALESCE(?, university),
           subject = COALESCE(?, subject),
           date_of_birth = COALESCE(?, date_of_birth),
           date_of_joining = COALESCE(?, date_of_joining),
           date_of_retirement = COALESCE(?, date_of_retirement),
           date_in_present_designation = COALESCE(?, date_in_present_designation),
           address1_permanent = COALESCE(?, address1_permanent),
           address2_temporary = COALESCE(?, address2_temporary)
         WHERE id = ?`,
        [
          firstname, middlename, lastname, gender, aadhaar, education_qualification,
          pay_level, university, subject, date_of_birth, date_of_joining, date_of_retirement,
          date_in_present_designation, address1_permanent, address2_temporary, sciId
        ]
      );
      affectedRows += empResult.affectedRows;
    }

    // If GRADE is updated, check its validity against managed grades
    if (grade) {
      const [[sci]] = await pool.query(
        'SELECT group_id FROM scientist WHERE emp_id = ?', [sciId]
      );

      if (sci && sci.group_id !== null) {
        // Check if this grade is allowed for this group
        const [managed] = await pool.query(
          'SELECT * FROM managed_scientist_grade WHERE group_id = ? AND scientist_grade = ?',
          [sci.group_id, grade]
        );

        // If the grade is not managed, unassign the scientist from the group
        if (managed.length === 0) {
          const [sciResult] = await pool.query(
            'UPDATE scientist SET grade = ?, group_id = NULL, category = COALESCE(?, category), research_area = COALESCE(?, research_area) WHERE emp_id = ?',
            [grade, category, research_area, sciId]
          );
          affectedRows += sciResult.affectedRows;
        } else {
          // Grade is valid for this group — update without removing group
          const [sciResult] = await pool.query(
            'UPDATE scientist SET grade = ?, category = COALESCE(?, category), research_area = COALESCE(?, research_area) WHERE emp_id = ?',
            [grade, category, research_area, sciId]
          );
          affectedRows += sciResult.affectedRows;
        }
      } else {
        // No group associated, just update grade/category/research area
        const [sciResult] = await pool.query(
          'UPDATE scientist SET grade = ?, category = COALESCE(?, category), research_area = COALESCE(?, research_area) WHERE emp_id = ?',
          [grade, category, research_area, sciId]
        );
        affectedRows += sciResult.affectedRows;
      }
    } else if (category || research_area) {
      // If only category or research_area changed
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

// ROUTE 3: Search scientist by name (GET /api/admin/search?ScientistName=...)
exports.searchScientistByName = async (req, res) => {
  try {
    const groupId = req.user.group_id; // Admin's group
    const { ScientistName } = req.query;

    if (!ScientistName)
      return res.status(400).json({ message: 'Name is required' });

    // Search by first or last name (case-insensitive, partial match)
    const [scientists] = await pool.query(
      `SELECT s.emp_id, e.firstname, e.lastname, s.grade, s.category, s.research_area
       FROM scientist s 
       JOIN employee e ON s.emp_id = e.id
       WHERE s.group_id = ? AND (e.firstname LIKE ? OR e.lastname LIKE ?)`,
      [groupId, `%${ScientistName}%`, `%${ScientistName}%`]
    );

    res.json(scientists);
  } catch (err) {
    res.status(500).json({ message: 'Error searching scientist' });
  }
};

// ROUTE 4: Get complete profile of a scientist (GET /api/admin/scientist/:id)
exports.getCompleteScientistDetails = async (req, res) => {
  try {
    const groupId = req.user.group_id;
    const sciId = req.params.id;

    // Check if scientist exists and belongs to the admin's group
    const [rows] = await pool.query(
      'SELECT * FROM scientist WHERE emp_id = ? AND group_id = ?', 
      [sciId, groupId]
    );
    if (rows.length === 0)
      return res.status(404).json({ message: 'Scientist not found or not in your group' });

    // Fetch personal and scientific info
    const [profileRows] = await pool.query(
      `SELECT e.*, s.category, s.research_area, s.grade, s.group_id
       FROM employee e 
       JOIN scientist s ON e.id = s.emp_id 
       WHERE s.emp_id = ? AND s.group_id = ?`,
      [sciId, groupId]
    );

    // Fetch all associated phone numbers
    const [phones] = await pool.query('SELECT phone_no FROM phone_number WHERE emp_id = ?', [sciId]);
    const [landlines] = await pool.query('SELECT landline_no FROM landline_number WHERE emp_id = ?', [sciId]);

    // Fetch scientist’s grade/history records
    const [history] = await pool.query('SELECT * FROM history WHERE sci_id = ?', [sciId]);

    res.json({ profile: profileRows[0], phones, landlines, history });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching scientist details' });
  }
};
