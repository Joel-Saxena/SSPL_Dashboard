// Handles all admin functionalities (for scientists in their group only)
import pool from '../db_config/db_connection.js';
import { uploadProfilePicture, getProfilePicture } from './fileupload.js';
import { pipeline } from 'stream/promises';
import { createWriteStream } from 'fs';


// ROUTE 1: Get all scientists in admin's group (GET /api/admin/scientists)
export const getScientistsInGroup = async (req, res) => {
  try {
    const groupId = req.user.group_id;
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
export const updateScientistDetails = async (req, res) => {
  try {
    const groupId = req.user.group_id;
    const sciId = req.params.id;

    // Only allow update if scientist is in admin's group
    const [rows] = await pool.query('SELECT * FROM scientist WHERE emp_id = ? AND group_id = ?', [sciId, groupId]);
    if (rows.length === 0) return res.status(403).json({ message: 'Not authorized' });

    // destructure possible updates
    const {
      firstname, middlename, lastname, gender, aadhaar, education_qualification,
      category, research_area, grade, pay_level, university, subject, date_of_birth,
      date_of_joining, date_of_retirement, date_in_present_designation,
      address1_permanent, address2_temporary
    } = req.body;

    let affectedRows = 0;

    // update employee fields
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
export const searchScientistByName = async (req, res) => {
  try {
    const groupId = req.user.group_id;
    const { ScientistName } = req.query;
    if (!ScientistName) return res.status(400).json({ message: 'Name is required' });

    const [scientists] = await pool.query(
      `SELECT s.emp_id, e.firstname, e.lastname, s.grade, s.category, s.research_area
       FROM scientist s JOIN employee e ON s.emp_id = e.id
       WHERE s.group_id = ? AND (e.firstname LIKE ? OR e.lastname LIKE ?)`,
      [groupId, `%${ScientistName}%`, `%${ScientistName}%`]
    );
    res.json(scientists);
  } catch (err) {
    res.status(500).json({ message: 'Error searching scientist' });
  }
};

// ROUTE 4: Get complete scientist details (GET /api/admin/scientist/:id)
export const getCompleteScientistDetails = async (req, res) => {
  try {
    const groupId = req.user.group_id;
    const sciId = req.params.id;

    // Only allow if scientist is in admin's group
    const [rows] = await pool.query('SELECT * FROM scientist WHERE emp_id = ? AND group_id = ?', [sciId, groupId]);
    if (rows.length === 0) return res.status(404).json({ message: 'Scientist not found or not in your group' });

    const [profileRows] = await pool.query(
      `SELECT e.*, s.category, s.research_area, s.grade, s.group_id
       FROM employee e JOIN scientist s ON e.id = s.emp_id WHERE s.emp_id = ?`,
      [sciId]
    );
    const [phones] = await pool.query('SELECT phone_no FROM phone_number WHERE emp_id = ?', [sciId]);
    const [landlines] = await pool.query('SELECT landline_no FROM landline_number WHERE emp_id = ?', [sciId]);
    const [history] = await pool.query('SELECT * FROM history WHERE sci_id = ?', [sciId]);

    res.json({ profile: profileRows[0], phones, landlines, history });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching scientist details' });
  }
};

// ROUTE 5: upload file (POST /api/admin/upload)
export const uploadFile = async (req, res) => {
  try {
    const file = req.file;
    const userId = req.body.user_id;
    if (!file || !userId) {
      return res.status(400).json({ message: 'File and user ID are required' });
    }
    else {
      const uploadResult = await uploadProfilePicture(file, userId);
      if (uploadResult) {
        res.json({ message: 'File uploaded successfully' });
      } else {
        res.status(500).json({ message: 'Failed to upload file' });
      }
    }
  } catch (error) {
    res.status(500).json({ message: `Error uploading file: ${error.message}` });
  }
}

// ROUTE 6: Get file (GET /api/admin/getfile?emp_id=:id&file_type=:fileType)
export const getFile = async (req, res) => {
  try {
    const userId = req.query.emp_id;
    const fileType = req.query.file_type;

    if (!userId || !fileType) {
      console.log("RETURNING ERROR 2 TO FRONTEND");
      return res.status(400).json({ message: 'Employee ID and file type are required' });
    }

    if (fileType == 'profile_pic') {
      // For profile picture, use the dedicated function
      const dataStream = await getProfilePicture(userId);
      if (!dataStream) {
        return res.status(404).json({ message: 'Profile picture not found' });
      }

      // For testing: Save file to local "./controllers/test" directory as "{userId}_profile_pic.jpg". You have to Manually Create "./controllers/test" directory.
      // const path = `./controllers/test/${userId}_profile_pic.jpg`;
      // await pipeline(dataStream, createWriteStream(path));
      // console.log(`Saved profile picture locally at ${path}`);

      // return res.status(200).json({ message: 'File saved successfully' });
      res.setHeader('Content-Type', 'image/jpeg');
      console.log("RETURNING IMAGE TO FRONTEND");
      return dataStream.pipe(res);
    }

    // Handle unknown file types
    console.log("RETURNING ERROR 2 TO FRONTEND");
    return res.status(400).json({ message: 'Unsupported file type requested' });

  } catch (error) {
    console.error('getFile error:', error);
    res.status(500).json({ message: `Error retrieving file: ${error.message}` });
  }
};
