const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { authenticate, authorizeRoles } = require('../middlewares/authMiddleware');

// Apply authentication and restrict access to users with the 'admin' role
// This middleware applies to all routes below this line
router.use(authenticate, authorizeRoles('admin'));

// ROUTE: Get all scientists in the admin's group
// GET /api/admin/scientists
router.get('/scientists', adminController.getScientistsInGroup);

// ROUTE: Update a scientist's details (only if they're in the admin's group)
// PUT /api/admin/scientist/:id
router.put('/scientist/:id', adminController.updateScientistDetails);

// ROUTE: Search scientists by name within admin's group
// GET /api/admin/search?ScientistName=...
router.get('/search', adminController.searchScientistByName);

// ROUTE: Get complete profile of a specific scientist in admin's group
// GET /api/admin/scientist/:id
router.get('/scientist/:id', adminController.getCompleteScientistDetails);

// Export the router to be used in main app.js or index.js
module.exports = router;
