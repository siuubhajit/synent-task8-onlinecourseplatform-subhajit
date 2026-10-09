const express = require('express');
const router = express.Router();
const {
  createOrder,
  verifyPayment,
  freeEnroll
} = require('../controllers/paymentController');
const { protect } = require('../middleware/authMiddleware');

router.post('/create-order', protect, createOrder);
router.post('/verify-payment', protect, verifyPayment);
router.post('/free-enroll', protect, freeEnroll);

module.exports = router;
