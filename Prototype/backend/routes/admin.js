import express from 'express';
import * as adminController from '../controllers/adminController.js';
import { authenticate, authorizeRoles } from '../middlewares/authMiddleware.js';
import multer from 'multer';

const storage = multer.memoryStorage()
const upload = multer({ storage: storage })

const router = express.Router();

router.use(authenticate, authorizeRoles('admin'));

// ROUTE 1: Get all scientists in admin's group (GET /api/admin/scientists)
router.get('/scientists', adminController.getScientistsInGroup);

// ROUTE 2: Update scientist details (PUT /api/admin/scientist/:id)
router.put('/scientist/:id', adminController.updateScientistDetails);

// ROUTE 3: Search scientist by name (GET /api/admin/search)
router.get('/search', adminController.searchScientistByName);

// ROUTE 4: Get complete scientist details (GET /api/admin/scientist/:id)
router.get('/scientist/:id', adminController.getCompleteScientistDetails);

// ROUTE 5: upload file (POST /api/admin/upload)
router.post('/upload', upload.single('profile_pic'), adminController.uploadFile);

// ROUTE 6: Get file (GET /api/admin/getfile?emp_id=:id&file_type=:fileType)
router.get('/getfile', adminController.getFile);

export default router;


