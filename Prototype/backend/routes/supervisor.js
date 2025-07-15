const express = require('express');
const router = express.Router();
const supervisorController = require('../controllers/supervisorController');
const { authenticate, authorizeRoles } = require('../middlewares/authMiddleware');

router.use(authenticate, authorizeRoles('super_admin'));

router.post('/group', supervisorController.createGroup);
router.post('/admin', supervisorController.addAdmin);
router.post('/scientist', supervisorController.addScientist);
router.put('/admin/group', supervisorController.assignAdminToGroup);
router.get('/groups', supervisorController.getGroupHierarchy);

module.exports = router;
