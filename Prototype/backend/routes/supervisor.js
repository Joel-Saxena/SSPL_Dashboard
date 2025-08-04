import express from 'express';
import * as supervisorController from '../controllers/supervisorController.js';
import { authenticate, authorizeRoles } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Apply authentication and ensure only users with 'super_admin' role can access these routes
router.use(authenticate, authorizeRoles('super_admin'));

// ROUTE 1: Create new group (POST /api/supervisor/group)
// Request body: { group_name }
router.post('/group', supervisorController.createGroup);

// ROUTE 2: Add new admin (POST /api/supervisor/admin)
// Request body: { employeeData, supervisor_id, group_id }
router.post('/admin', supervisorController.addAdmin);

// ROUTE 3: Add new scientist (POST /api/supervisor/scientist)
// Request body: { employeeData, category, research_area, grade, group_id }
router.post('/scientist', supervisorController.addScientist);

// ROUTE 4: Update admin's group (PUT /api/supervisor/admin/group)
// Request body: { admin_id, group_id }
router.put('/admin/group', supervisorController.assignAdminToGroup);

// ROUTE 5: Get group hierarchy (GET /api/supervisor/groups)
// Returns complete group hierarchy with admins, scientists, and managed grades
router.get('/groups', supervisorController.getGroupHierarchy);

export default router;
