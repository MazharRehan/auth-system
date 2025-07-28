const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/authMiddleware');
const { restrictTo } = require('../middlewares/roleMiddleware');
const userController = require('../controllers/userController');

router.get('/all', protect, restrictTo('admin'), userController.getAllUsers);
router.get('/profile', protect, userController.getProfile);
router.put('/profile', protect, userController.updateProfile);
router.put('/change-password', protect, userController.changePassword);
router.delete('/delete', protect, userController.deleteUser);

module.exports = router;