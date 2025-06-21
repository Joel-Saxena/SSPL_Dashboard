const express = require('express');
const router = express.Router();
const supervisorController = require('../controllers/supervisorController');

// ROUTE 1: Create new group (POST /api/supervisor/group)
router.post('/group', supervisorController.createGroup);

// ROUTE 2: Add new admin (POST /api/supervisor/admin)
router.post('/admin', supervisorController.addAdmin);

// ROUTE 3: Add new scientist (POST /api/supervisor/scientist)
router.post('/scientist', supervisorController.addScientist);

// ROUTE 4: Assign admin to group (PUT /api/supervisor/admin/:id/group)
router.put('/admin/:id/group', supervisorController.assignAdminToGroup);

// ROUTE 5: Get group hierarchy (GET /api/supervisor/groups)
router.get('/groups', supervisorController.getGroupHierarchy);

// ROUTE 6: Update admins of a group (PUT /api/supervisor/group/:id/admins)
router.put('/group/:id/admins', supervisorController.updateAdminsOfGroup);

// ROUTE 7: Change grades managed in a group (PUT /api/supervisor/group/:id/grades)
router.put('/group/:id/grades', supervisorController.changeGroupGrades);

module.exports = router;
