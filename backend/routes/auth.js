const express = require('express');
const { sendResetLink, resetPassword } = require('../controllers/auth_controller'); // Controllers
const router = express.Router();

router.post('/send/forgotpassword', sendResetLink);
router.post('/resetpassword', resetPassword);

module.exports = router;
