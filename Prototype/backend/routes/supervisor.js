const express = require('express');
const router = express.Router();
const supervisorController = require('../controllers/supervisorController');
const { authenticate, authorizeRoles } = require('../middlewares/authMiddleware');

// Apply authentication and ensure only users with 'super_admin' role can access these routes
router.use(authenticate, authorizeRoles('super_admin'));

// ROUTE: Create a new group
// POST /api/supervisor/group
router.post('/group', supervisorController.createGroup);

// ROUTE: Add a new admin and associate them with a group
// POST /api/supervisor/admin
router.post('/admin', supervisorController.addAdmin);

// ROUTE: Add a new scientist to a group with a grade
// POST /api/supervisor/scientist
router.post('/scientist', supervisorController.addScientist);

// ROUTE: Assign or update an admin’s group
// PUT /api/supervisor/admin/group
router.put('/admin/group', supervisorController.assignAdminToGroup);

// ROUTE: Get full hierarchy of groups with their admins, scientists, and managed grades
// GET /api/supervisor/groups
router.get('/groups', supervisorController.getGroupHierarchy);

// Export the router to be used in your main application
module.exports = router;
