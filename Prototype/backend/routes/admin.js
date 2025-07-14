const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { authenticate, authorizeRoles } = require('../middlewares/authMiddleware');

router.use(authenticate, authorizeRoles('admin'));

router.get('/scientists', adminController.getScientistsInGroup);
router.put('/scientist/:id', adminController.updateScientistDetails);
router.get('/search', adminController.searchScientistByName);
router.get('/scientist/:id', adminController.getCompleteScientistDetails);

module.exports = router;
