const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { authenticate } = require('../middleware/authMiddleware');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

router.get('/profile', authenticate, userController.getCurrentUser);
router.get('/profile/:id', authenticate, userController.getUserById);
router.put('/update/:id', authenticate, userController.updateUser);
router.post('/change-password', authenticate, userController.changePassword);
router.post('/avatar/:id', authenticate, upload.single('avatar'), userController.uploadAvatar);
router.post('/cover/:id', authenticate, upload.single('cover'), userController.uploadCover); // Thêm route này
router.delete('/delete/:id', authenticate, userController.deleteUser);
router.get('/all', authenticate, userController.getAllUsers);

module.exports = router;