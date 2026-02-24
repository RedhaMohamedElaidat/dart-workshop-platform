import express from 'express';
import initSqlJs from 'sql.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors';
import bodyParser from 'body-parser';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Database initialization
const dbPath = path.join(__dirname, 'database.db');
let db = null;
let SQL = null;

// Initialize SQL.js and load/create database
async function initializeDatabase() {
  // Initialize sql.js
  SQL = await initSqlJs();

  // Load existing database or create new one
  let dbBuffer = null;
  if (fs.existsSync(dbPath)) {
    dbBuffer = fs.readFileSync(dbPath);
  }

  db = new SQL.Database(dbBuffer);

  // Create tables if they don't exist
  const schema = `
    CREATE TABLE IF NOT EXISTS submissions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      full_name TEXT NOT NULL,
      activity_number INTEGER NOT NULL,
      code_text TEXT NOT NULL,
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(full_name, activity_number)
    );

    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      full_name TEXT UNIQUE NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `;

  const statements = schema.split(';').filter(s => s.trim());
  statements.forEach(statement => {
    if (statement.trim()) {
      try {
        db.run(statement);
      } catch (err) {
        console.log('Table creation info:', err.message);
      }
    }
  });

  // Initialize allowed users
  const allowedUsers = ['Bekouch Ikram', 'Djaoud Sara', 'Rahali Hanane'];
  
  allowedUsers.forEach(user => {
    try {
      db.run('INSERT OR IGNORE INTO users (full_name) VALUES (?)', [user]);
    } catch (err) {
      console.log('User insertion info:', err.message);
    }
  });

  // Save database to file
  saveDatabase();

  console.log('✅ Database initialized successfully');
}

// Save database to file
function saveDatabase() {
  if (db) {
    const data = db.export();
    const buffer = Buffer.from(data);
    fs.writeFileSync(dbPath, buffer);
  }
}

// Allowed users list
const ALLOWED_USERS = ['Bekouch Ikram', 'Djaoud Sara', 'Rahali Hanane'];

// Validation helper
function sanitizeInput(input) {
  if (!input || typeof input !== 'string') return '';
  return input.trim().substring(0, 50000); // Max 50KB code
}

function validateFullName(name) {
  const sanitized = String(name).trim();
  return ALLOWED_USERS.includes(sanitized) ? sanitized : null;
}

// Routes

// Login endpoint
app.post('/api/login', (req, res) => {
  try {
    const { fullName } = req.body;

    if (!fullName || typeof fullName !== 'string') {
      return res.status(400).json({ 
        success: false, 
        message: 'Full name is required' 
      });
    }

    const validatedName = validateFullName(fullName);

    if (!validatedName) {
      return res.status(401).json({ 
        success: false, 
        message: 'Access denied. You are not registered for this workshop.' 
      });
    }

    // Set session token (in production, use JWT)
    res.json({
      success: true,
      message: 'Login successful',
      user: validatedName,
      token: Buffer.from(validatedName).toString('base64')
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ 
      success: false, 
      message: 'Server error during login' 
    });
  }
});

// Submit activity
app.post('/api/submit', (req, res) => {
  try {
    const { fullName, activityNumber, code } = req.body;

    // Validate inputs
    if (!fullName || !activityNumber || code === undefined) {
      return res.status(400).json({ 
        success: false, 
        message: 'Missing required fields' 
      });
    }

    const validatedName = validateFullName(fullName);
    if (!validatedName) {
      return res.status(401).json({ 
        success: false, 
        message: 'Unauthorized' 
      });
    }

    const actNum = parseInt(activityNumber);
    if (![1, 2, 3].includes(actNum)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid activity number' 
      });
    }

    const sanitizedCode = sanitizeInput(code);
    if (!sanitizedCode || sanitizedCode.length === 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'Code cannot be empty' 
      });
    }

    // Insert or update submission
    try {
      db.run(`
        INSERT INTO submissions (full_name, activity_number, code_text)
        VALUES (?, ?, ?)
        ON CONFLICT(full_name, activity_number) 
        DO UPDATE SET code_text = excluded.code_text, timestamp = CURRENT_TIMESTAMP
      `, [validatedName, actNum, sanitizedCode]);

      saveDatabase();

      res.json({
        success: true,
        message: 'Activity submitted successfully',
        id: Date.now()
      });
    } catch (err) {
      console.error('Database insert error:', err);
      res.status(500).json({ 
        success: false, 
        message: 'Error saving submission' 
      });
    }
  } catch (err) {
    console.error('Submit error:', err);
    res.status(500).json({ 
      success: false, 
      message: 'Server error during submission' 
    });
  }
});

// Get user submissions
app.get('/api/submissions/:fullName', (req, res) => {
  try {
    const { fullName } = req.params;

    const validatedName = validateFullName(fullName);
    if (!validatedName) {
      return res.status(401).json({ 
        success: false, 
        message: 'Unauthorized' 
      });
    }

    const result = db.exec(`
      SELECT id, full_name, activity_number, code_text, timestamp
      FROM submissions
      WHERE full_name = ?
      ORDER BY activity_number
    `, [validatedName]);

    let submissions = [];
    if (result.length > 0) {
      const columns = result[0].columns;
      const values = result[0].values;
      submissions = values.map(row => {
        const obj = {};
        columns.forEach((col, idx) => {
          obj[col] = row[idx];
        });
        return obj;
      });
    }

    res.json({
      success: true,
      submissions: submissions
    });
  } catch (err) {
    console.error('Fetch submissions error:', err);
    res.status(500).json({ 
      success: false, 
      message: 'Server error fetching submissions' 
    });
  }
});

// Admin: Get all submissions
app.get('/api/admin/submissions', (req, res) => {
  try {
    const adminToken = req.headers['x-admin-token'];
    
    // Simple admin token check (in production, use proper auth)
    if (adminToken !== 'admin_dart_workshop_2024') {
      return res.status(401).json({ 
        success: false, 
        message: 'Unauthorized' 
      });
    }

    const result = db.exec(`
      SELECT id, full_name, activity_number, code_text, timestamp
      FROM submissions
      ORDER BY full_name, activity_number, timestamp DESC
    `);

    let submissions = [];
    if (result.length > 0) {
      const columns = result[0].columns;
      const values = result[0].values;
      submissions = values.map(row => {
        const obj = {};
        columns.forEach((col, idx) => {
          obj[col] = row[idx];
        });
        return obj;
      });
    }

    res.json({
      success: true,
      submissions: submissions
    });
  } catch (err) {
    console.error('Admin fetch error:', err);
    res.status(500).json({ 
      success: false, 
      message: 'Server error fetching admin data' 
    });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Serve admin page
app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'admin.html'));
});

// Serve main index
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Not found' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ 
    success: false, 
    message: 'Internal server error' 
  });
});

// Start server
async function startServer() {
  try {
    await initializeDatabase();
    
    app.listen(PORT, () => {
      console.log(`🚀 Dart Workshop Platform running on http://localhost:${PORT}`);
      console.log(`📊 Admin panel: http://localhost:${PORT}/admin`);
      console.log(`💾 Database: ${dbPath}`);
    });

    // Graceful shutdown
    process.on('SIGINT', () => {
      console.log('\n📛 Shutting down gracefully...');
      saveDatabase();
      process.exit(0);
    });
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
}

startServer();