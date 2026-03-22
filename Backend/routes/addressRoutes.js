const express = require('express');
const router = express.Router();
const addressController = require('../controllers/addressController');
const { authenticate } = require('../middleware/authMiddleware');

router.use(authenticate); // Tất cả routes đều cần auth

router.get('/', addressController.getAddresses);
router.post('/', addressController.addAddress);
router.put('/:id', addressController.updateAddress);
router.delete('/:id', addressController.deleteAddress);
router.post('/:id/default', addressController.setDefaultAddress);

module.exports = router;