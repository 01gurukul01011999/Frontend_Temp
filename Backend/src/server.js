import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import multer from "multer";

// Import authentication module
import { authRoutes, authMiddleware } from './modules/authentication/index.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(bodyParser.json());
app.use(cors());
app.use('/uploads', express.static('public/uploads'));

// File upload configuration for other uploads (non-auth related)
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

// Register authentication routes
app.use('/', authRoutes);

// Protected route example using auth middleware
app.get('/protected', authMiddleware.authenticateUser, async (req, res) => {
  try {
    res.json({ 
      message: 'Protected data', 
      user: req.user 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Order management routes (protected)
app.post("/orderfetch", authMiddleware.authenticateUser, async (req, res) => {
  try {
    // Your order fetching logic here
    res.json({ message: 'Orders fetched successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Bulk image upload (protected)
app.post('/api/bulkImgupload', authMiddleware.authenticateUser, upload.array('images'), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'No files uploaded' });
    }

    const results = [];
    for (const file of req.files) {
      const imgId = 'img' + Date.now() + '-' + Math.floor(Math.random() * 1000000);
      const imgName = file.filename;
      const originalName = file.originalname;
      
      // Store image information in your database
      // This is a placeholder - implement your image storage logic
      results.push({ img_id: imgId, img_name: imgName, original_name: originalName });
    }

    res.json({ success: true, files: results });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Error:', error);
  res.status(500).json({ error: 'Internal server error' });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.listen(PORT, () => {
  console.log(`Connected to backend on port ${PORT}`);
});
