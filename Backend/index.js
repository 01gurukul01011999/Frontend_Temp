import express from "express";
import jwt from "jsonwebtoken";
import cors from 'cors';
import multer from "multer";
import path from "path";
import fs from 'fs';
import crypto from 'crypto';
import { fileURLToPath } from "url";
import pkg from "pg";
import { createClient } from '@supabase/supabase-js';
import dotenv from "dotenv";
dotenv.config();

const { Pool } = pkg;
const app = express();
app.use(express.json());

// (diagnostic wrapper removed) Normal route registration is used below.

// Allow CORS from frontend (adjust origin as needed)
const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN || 'http://localhost:3000';
app.use(cors({ origin: FRONTEND_ORIGIN, credentials: true }));
// Respond to preflight OPTIONS requests with explicit headers to avoid
// registering an `app.options('*', ...)` route which can trigger
// path-to-regexp parsing in some environments.
app.use((req, res, next) => {
  if (req.method === 'OPTIONS') {
    res.header('Access-Control-Allow-Origin', FRONTEND_ORIGIN);
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
    return res.sendStatus(204);
  }
  next();
});

// Environment variables
const JWT_SECRET = process.env.JWT_SECRET || "your_secret_key_here";
const PORT = process.env.PORT || 4000;
// Table to update for user/profile records (can be 'users', 'profiles', etc.)
const USERS_TABLE = process.env.SUPABASE_USERS_TABLE || process.env.SUPABASE_USER_TABLE || 'profiles';

// Use Supabase server client (service role) to avoid direct Postgres DNS dependency
const SUPABASE_URL = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
// prefer a server-only service role key, but fall back to other env names if present
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;

let supabaseAdmin = null;
if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error('⚠️ Supabase admin client not initialized: SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY missing.');
} else {
  supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    auth: { persistSession: false },
  });
  console.log('✅ Supabase admin client initialized');
}

let dbConnected = false;
let lastDbError = null;

// ============ File Upload Setup ============
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure uploads directory exists to avoid ENOENT when writing/reading files
const uploadsDir = path.join(__dirname, 'uploads');
try {
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
    console.log(`✅ Created uploads directory at ${uploadsDir}`);
  }
} catch (e) {
  console.error('Failed to ensure uploads directory exists:', e);
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "uploads"));
  },
  filename: (req, file, cb) => {
    const uniqueName =
      Date.now() + "-" + Math.round(Math.random() * 1e9) + path.extname(file.originalname);
    cb(null, uniqueName);
  },
});

const upload = multer({ storage });

// Serve uploaded files so frontend can fetch them directly from the backend
app.use('/uploads', express.static(uploadsDir));

// ============ Routes ============

// ✅ Register User
app.post("/user", async (req, res) => {
  const id = Math.floor(Math.random() * 1000000);
  const q = `
    INSERT INTO users (fname, lname, id, email, password, ac_sta, roll) 
    VALUES ($1, $2, $3, $4, $5, $6, $7)
  `;
  const values = [
    req.body.firstName,
    req.body.lastName,
    id,
    req.body.email,
    req.body.password,
    "reg",
    "seller",
  ];

  try {
  if (!supabaseAdmin) return res.status(500).json({ error: 'Supabase admin client not configured' });
  const { data: insertData, error: insertError } = await supabaseAdmin.from('users').insert([{ fname: req.body.firstName, lname: req.body.lastName, id, email: req.body.email, password: req.body.password, ac_sta: 'reg', roll: 'seller' }]);
  if (insertError) throw insertError;

    const token = jwt.sign(
      {
        email: req.body.email,
        fname: req.body.firstName,
        lname: req.body.lastName,
        id: id,
      },
      JWT_SECRET,
      { expiresIn: 3600 }
    );

  res.json({ token });
  } catch (err) {
    console.error("Error executing query:", err.message);
    res.status(500).send("Internal Server Error");
  }
});

// ✅ Login
app.post("/login", async (req, res) => {
  const q = "SELECT * FROM users WHERE email = $1 AND password = $2";
  const values = [req.body.email, req.body.password];

  try {
  if (!supabaseAdmin) return res.status(500).json({ error: 'Supabase admin client not configured' });
  const { data: users, error: fetchError } = await supabaseAdmin.from('users').select('*').eq('email', req.body.email).eq('password', req.body.password);
  if (fetchError) throw fetchError;
  if (!users || users.length === 0) return res.status(401).json({ error: 'Invalid credentials' });
  const user = users[0];
    const token = jwt.sign(
      {
        email: user.email,
        fname: user.fname,
        lname: user.lname,
        id: user.id,
      },
      JWT_SECRET,
      { expiresIn: 3600 }
    );

    res.json({ token });
  } catch (err) {
    console.error("Login error:", err.message);
    res.status(500).send("Internal Server Error");
  }
});

// DB status endpoint for diagnostics
app.get('/api/db-status', async (req, res) => {
  let host = null;
  try {
    const url = new URL(SUPABASE_URL || '');
    host = url.hostname;
  } catch (e) {
    // ignore
  }

  res.json({
    connected: !!supabaseAdmin,
    host,
    lastError: lastDbError ? String(lastDbError.message || lastDbError) : null,
  });
});
//Bulk Image Upload
app.post("/api/bulkImgupload", upload.array("images"), async (req, res) => {
  const uploader_id = req.body.uploaderId;
  const bucket = process.env.SUPABASE_STORAGE_BUCKET || process.env.SUPABASE_BUCKET || 'images';
  const results = [];
  const uploadedFiles = req.files || [];

  try {
    if (!supabaseAdmin) return res.status(500).json({ success: false, error: 'Supabase admin client not configured' });

    for (let file of uploadedFiles) {
      // Defensive: ensure the file was actually written to disk by multer
      if (!file || !file.path || !fs.existsSync(file.path)) {
        const eno = new Error(`Uploaded file not found: ${file && file.path ? file.path : "(unknown)"}`);
        eno.code = 'ENOENT';
        eno.path = file && file.path ? file.path : uploadsDir;
        throw eno;
      }

      // generate a proper UUID for img_id since the images.img_id column is a UUID
      const img_id = crypto.randomUUID();
      const original_name = file.originalname;
      const datestamp = new Date();

      // Read file buffer from disk and upload to Supabase Storage
      const buffer = fs.readFileSync(file.path);
      // Build a storage path that includes the uuid to avoid collisions
      const storagePath = `products/${img_id}_${file.originalname}`.replace(/\s+/g, '_');

      const { data: storageData, error: storageError } = await supabaseAdmin.storage.from(bucket).upload(storagePath, buffer, {
        contentType: file.mimetype || 'application/octet-stream',
        upsert: false,
      });
      if (storageError) throw storageError;

      // Create a signed URL valid for 1 hour so frontend can preview/download privately
      const signedTtl = 60 * 60; // 1 hour
      const { data: signedData, error: signedErr } = await supabaseAdmin.storage.from(bucket).createSignedUrl(storagePath, signedTtl);
      if (signedErr) {
        // not fatal; continue but record the error
        console.warn('createSignedUrl error for', storagePath, signedErr.message || signedErr);
      }

      // Insert metadata into images table. Some projects may not have a `storage_path` column yet;
      // attempt to insert with storage_path and if the DB/schema complains, retry without it.
      const img_name = path.basename(storagePath);
      let dbData = null;
      try {
        const { data: _dbData, error: dbError } = await supabaseAdmin.from('images').insert([{ img_id, img_name, original_name, datestamp, uploader_id, storage_path: storagePath }]);
        if (dbError) throw dbError;
        dbData = _dbData;
      } catch (dbErr) {
        const msg = String((dbErr && (dbErr.message || dbErr)) || dbErr);
        // Detect PostgREST/schema error mentioning missing column
        if (msg.includes("storage_path") || msg.includes("Could not find the 'storage_path'")) {
          console.warn('images.storage_path column not present; retrying insert without storage_path');
          const { data: _dbData2, error: dbError2 } = await supabaseAdmin.from('images').insert([{ img_id, img_name, original_name, datestamp, uploader_id }]);
          if (dbError2) throw dbError2;
          dbData = _dbData2;
        } else {
          throw dbErr;
        }
      }

      // Build a public URL (works for public buckets) and include both public and signed URLs in the response
      let publicUrl = null;
      try {
        const { data: publicData } = supabaseAdmin.storage.from(bucket).getPublicUrl(storagePath);
        publicUrl = publicData?.publicUrl || null;
      } catch (e) {
        console.warn('getPublicUrl failed for', storagePath, e?.message || e);
      }

      // push result including identifiers and the signed URL if available
      results.push({ img_id, img_name, original_name, datestamp, uploader_id, storagePath, storageData, publicUrl, signedUrl: signedData?.signedUrl || null, db: dbData });

      // cleanup local temp file
      try { fs.unlinkSync(file.path); } catch (e) { /* ignore cleanup errors */ }
    }

    res.json({ success: true, files: results });
    //console.log("Processed", results);
  } catch (err) {
    console.error("Error processing image upload:", err?.message || err);
    // Attempt to clean up any temp files that remain
    try {
      for (let f of uploadedFiles || []) {
        if (f && f.path && fs.existsSync(f.path)) {
          fs.unlinkSync(f.path);
        }
      }
    } catch (cleanupErr) {
      console.warn('Error cleaning up temp files:', cleanupErr);
    }

    // If file missing on disk, surface path and ENOENT code to client for debugging
    if (err && (err.code === 'ENOENT' || (err.message && err.message.includes('ENOENT')))) {
      const pathInfo = err.path || (uploadedFiles && uploadedFiles.length ? uploadedFiles.map(f => f.path) : null);
      return res.status(500).json({ success: false, error: 'File not found on server', code: 'ENOENT', path: pathInfo });
    }
    res.status(500).json({ success: false, error: err?.message || String(err) });
  }
});

// ✅ Get Images by Uploader
app.get("/api/images/:uploaderId", async (req, res) => {
  try {
    if (!supabaseAdmin) return res.status(500).json({ error: 'Supabase admin client not configured' });
    const { data, error } = await supabaseAdmin.from('images').select('*').eq('uploader_id', req.params.uploaderId);
    if (error) {
      console.error('Error fetching images:', error);
      return res.status(500).json({ error: error.message || error });
    }
    res.json(data);
  } catch (err) {
    console.error("Error fetching images:", err?.message || err);
    res.status(500).send("Internal Server Error");
  }
});


app.post("/api/catalogs", async (req, res) => {
  try {
    // express.json() middleware parses the body into req.body
    const payload = req.body;

    if (!payload || typeof payload !== 'object') {
      return res.status(400).json({ error: 'Invalid payload' });
    }

    // Use the pre-initialized supabaseAdmin client created at server startup
    if (!supabaseAdmin) {
      console.error('Supabase admin client not configured');
      return res.status(500).json({ error: 'Server configuration error: Supabase admin client not configured' });
    }

    const { data, error } = await supabaseAdmin.from('catalogs').insert([payload]).select();

    if (error) {
      console.error('Supabase insert error', error);
      return res.status(500).json({ error });
    }

    return res.status(200).json({ data });
  } catch (err) {
    console.error('API /api/catalogs error', err);
    return res.status(500).json({ error: String(err) });
  }
});


app.post("/upload-avatar", upload.single("avatar"), async (req, res) => {
  const userId = req.body.userId;
  const file = req.file;

  try {
    if (!supabaseAdmin) return res.status(500).json({ error: 'Supabase admin client not configured' });

    if (!file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    // Read buffer from disk (diskStorage is used)
    let buffer = null;
    try {
      buffer = fs.readFileSync(file.path);
    } catch (e) {
      console.error('Failed to read uploaded file from disk:', e);
      return res.status(500).json({ error: 'Failed to read uploaded file on server' });
    }

    // Unique filename stored in bucket path
    const fileName = `${userId}-${Date.now()}-${file.originalname}`.replace(/\s+/g, '_');

    // Default storage bucket and path: bucket 'techpotli', folder 'avatars'
    // You can override by setting SUPABASE_STORAGE_BUCKET in .env to a different bucket name.
    const bucket = process.env.SUPABASE_STORAGE_BUCKET || process.env.SUPABASE_BUCKET || 'techpotli';
    const storagePath = `avatars/${fileName}`.replace(/\s+/g, '_');

    // Helper to perform upload; will attempt to create bucket if missing
    async function performUpload() {
      const { error } = await supabaseAdmin.storage.from(bucket).upload(storagePath, buffer, {
        contentType: file.mimetype || 'application/octet-stream',
        upsert: true,
      });
      return error;
    }

    let uploadError = await performUpload();

    // If bucket not found, try to create it (requires admin privileges) then retry
    if (uploadError) {
      const msg = (uploadError && (uploadError.message || String(uploadError))) || String(uploadError);
      if (msg.includes('Bucket not found') || msg.includes('bucket not found') || msg.includes('Could not find bucket')) {
        try {
          console.warn(`Bucket '${bucket}' not found. Attempting to create it.`);
          const { error: createErr } = await supabaseAdmin.storage.createBucket(bucket, { public: true });
          if (createErr) throw createErr;
          // retry upload
          uploadError = await performUpload();
        } catch (createOrUploadErr) {
          console.error('Upload/create bucket failed:', createOrUploadErr);
          try { fs.unlinkSync(file.path); } catch (e) { /* ignore */ }
          return res.status(500).json({ error: 'Upload failed', details: createOrUploadErr.message || String(createOrUploadErr) });
        }
      } else {
        console.error("Upload error:", uploadError);
        try { fs.unlinkSync(file.path); } catch (e) { /* ignore */ }
        return res.status(500).json({ error: 'Upload failed', details: uploadError.message || String(uploadError) });
      }
    }

    // Get public URL for the uploaded object
    let avatarUrl = null;
    try {
      const { data: publicData } = await supabaseAdmin.storage.from(bucket).getPublicUrl(storagePath);
      avatarUrl = publicData?.publicUrl || null;
    } catch (e) {
      console.warn('getPublicUrl failed:', e?.message || e);
    }

    // Update user/profile table in Supabase (table configurable via env)
    // If the configured table name is wrong (PGRST205), try the common alternate
    // ('users' <-> 'profiles') before failing so deployments with differing
    // schemas can still succeed without immediate env changes.
    let dbError = null;
    let updatedTable = null;
    try {
      const { error } = await supabaseAdmin
        .from(USERS_TABLE)
        .update({ avatar_url: avatarUrl })
        .eq("id", userId);
      dbError = error || null;
      if (!dbError) updatedTable = USERS_TABLE;
    } catch (e) {
      dbError = e;
    }

    // If PostgREST reports missing table (PGRST205), try the alternate table name
    if (dbError && dbError.code === 'PGRST205') {
      const altTable = USERS_TABLE === 'users' ? 'profiles' : 'users';
      console.warn(`Primary table '${USERS_TABLE}' missing; attempting update on '${altTable}'.`);
      try {
        const { error: altErr } = await supabaseAdmin
          .from(altTable)
          .update({ avatar_url: avatarUrl })
          .eq('id', userId);
        if (!altErr) {
          dbError = null;
          updatedTable = altTable;
        } else {
          dbError = altErr;
        }
      } catch (altCatch) {
        dbError = altCatch;
      }
    }

    // cleanup temp file
    try { fs.unlinkSync(file.path); } catch (e) { /* ignore */ }

    if (dbError) {
      console.error("DB update error:", dbError);
      if (dbError && dbError.code === 'PGRST205') {
        return res.status(500).json({ error: 'DB update failed', message: dbError.message, code: dbError.code, hint: 'Check SUPABASE_USERS_TABLE and ensure the table exists in your Supabase project' });
      }
      return res.status(500).json({ error: "DB update failed", details: dbError.message || dbError });
    }

    res.json({ message: "Avatar updated successfully", avatar: avatarUrl, table: updatedTable });
  } catch (err) {
    console.error("Server error in /upload-avatar:", err?.message || err);
    // Attempt to cleanup temp file if present
    try { if (file && file.path && fs.existsSync(file.path)) fs.unlinkSync(file.path); } catch (e) { /* ignore */ }
    res.status(500).json({ error: "Internal Server Error", details: String(err) });
  }
});




// ============ Start Server ============
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
