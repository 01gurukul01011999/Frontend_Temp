const express = require('express');
const multer = require('multer');
const authService = require('./services/auth-service');
const { authenticateUser } = require('./middlewares/auth-middleware');

const router = express.Router();

// File upload configuration for avatars
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/uploads');
  },
  filename: function (req, file, cb) {
    const uniqueName = Date.now() + '-' + file.originalname;
    cb(null, uniqueName);
  }
});

const upload = multer({ storage });

// User registration
router.post('/user', async (req, res) => {
  try {
    const result = await authService.registerUser(req.body);
    res.json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// User login
router.post('/user-data', async (req, res) => {
  try {
    const result = await authService.loginUser(req.body);
    res.json(result);
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
});

// Protected route example
router.get('/protected', authenticateUser, async (req, res) => {
  try {
    res.json({ 
      message: 'Protected data', 
      user: req.user 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Password reset request
router.post('/reset', async (req, res) => {
  try {
    const result = await authService.requestPasswordReset(req.body.email);
    res.json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Verify reset code
router.post('/verify-code', async (req, res) => {
  try {
    const result = await authService.verifyResetCode(req.body.email, req.body.code);
    res.json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update password
router.post('/newPassword', async (req, res) => {
  try {
    const result = await authService.updatePassword(req.body.email, req.body.newPassword);
    res.json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update profile
router.post('/update_profile', authenticateUser, async (req, res) => {
  try {
    const result = await authService.updateProfile(req.user.email, req.body);
    res.json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Upload avatar
router.post('/upload-avatar', authenticateUser, upload.single('avatar'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const filePath = `/uploads/${req.file.filename}`;
    const result = await authService.updateAvatar(req.user.id, filePath);
    res.json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
