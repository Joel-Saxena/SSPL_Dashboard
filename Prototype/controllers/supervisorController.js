// Handles all supervisor functionalities
const pool = require('../config/db');
// ROUTE 1: Create new group (POST /api/supervisor/group)
// Creates a new group with the given group_name
exports.createGroup = async (req, res) => {
  // TODO: Implement logic
  res.json({ message: 'Create group (to be implemented)' });
};

// Add new admin
exports.addAdmin = async (req, res) => {
  // TODO: Implement logic
  res.json({ message: 'Add admin (to be implemented)' });
};

// Add new scientist
exports.addScientist = async (req, res) => {
  // TODO: Implement logic
  res.json({ message: 'Add scientist (to be implemented)' });
};

// Assign admin to group
exports.assignAdminToGroup = async (req, res) => {
  // TODO: Implement logic
  res.json({ message: 'Assign admin to group (to be implemented)' });
};

// Get group hierarchy
exports.getGroupHierarchy = async (req, res) => {
  // TODO: Implement logic
  res.json({ message: 'Get group hierarchy (to be implemented)' });
};

// Update admins of a group
exports.updateAdminsOfGroup = async (req, res) => {
  // TODO: Implement logic
  res.json({ message: 'Update admins of group (to be implemented)' });
};

// Change grades managed in a group
exports.changeGroupGrades = async (req, res) => {
  // TODO: Implement logic
  res.json({ message: 'Change group grades (to be implemented)' });
};
