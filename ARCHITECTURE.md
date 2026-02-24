# 🏗️ Architecture & Flow Diagrams

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      BROWSER (Client)                       │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────────┐        ┌──────────────┐                  │
│  │  index.html  │        │  admin.html  │                  │
│  │  (UI)        │        │  (Admin UI)  │                  │
│  └──────┬───────┘        └──────┬───────┘                  │
│         │                       │                           │
│  ┌──────▼──────────────────────▼──────┐                    │
│  │     app.js & admin.js              │                    │
│  │  (Vanilla JavaScript Logic)        │                    │
│  └──────┬───────────────────────────┬─┘                    │
│         │                           │                      │
│  ┌──────▼──────────────────────────▼──────┐                │
│  │        styles.css (Dark Theme)         │                │
│  │  (Responsive, 536 lines of CSS)       │                │
│  └────────────────────────────────────────┘                │
│                     │                                      │
│         HTTP/JSON ◄─┼─► HTTP/JSON                         │
│                     │                                      │
└─────────────────────┼──────────────────────────────────────┘
                      │
              ┌───────▼────────┐
              │                │
              │   INTERNET     │
              │                │
              └───────┬────────┘
                      │
        ┌─────────────▼──────────────┐
        │   Node.js Express Server   │
        │     (server.js, 264 lines) │
        └─────────────┬──────────────┘
                      │
        ┌─────────────┼────────────────────────┐
        │             │                        │
   ┌────▼────┐  ┌────▼─────┐  ┌──────────┐   │
   │ /api/*  │  │ /admin   │  │ Static   │   │
   │ Routes  │  │  Routes  │  │ Assets   │   │
   └────┬────┘  └────┬─────┘  └──────────┘   │
        │            │                        │
        └────────┬───┘                        │
                 │                            │
        ┌────────▼──────────────┐            │
        │   SQLite Database     │            │
        │   (database.db)       │            │
        │                       │            │
        │  ┌─────────────────┐  │            │
        │  │  submissions    │  │            │
        │  │  - id           │  │            │
        │  │  - full_name    │  │            │
        │  │  - activity_num │  │            │
        │  │  - code_text    │  │            │
        │  │  - timestamp    │  │            │
        │  └─────────────────┘  │            │
        │                       │            │
        │  ┌─────────────────┐  │            │
        │  │  users          │  │            │
        │  │  - id           │  │            │
        │  │  - full_name    │  │            │
        │  │  - created_at   │  │            │
        │  └─────────────────┘  │            │
        │                       │            │
        └───────────────────────┘            │
                                             │
                                    (Persistent
                                     storage)
```

---

## User Flow Diagram

```
┌─────────────┐
│   STUDENT   │
└──────┬──────┘
       │
       │ 1. Open https://app.com
       │
       ▼
   ┌──────────────┐
   │ Login Page   │
   │              │
   │ Enter name:  │
   │ "Bekouch.." │
   └──────┬───────┘
          │
          │ 2. Click Login
          │
          ▼
   ┌─────────────────────┐
   │ Validate Name       │
   │ (Check whitelist)   │
   └──────┬──────────────┘
          │
     ┌────┴────┐
     │          │
  ✓ Valid    ✗ Invalid
     │          │
     │          ▼
     │       ┌──────────────┐
     │       │ Error Message│
     │       │ "Not allowed"│
     │       └──────────────┘
     │
     ▼
┌─────────────────────────┐
│ Dashboard              │
│ (3 Activities)         │
└──────┬──────────────────┘
       │
       │ 3. Select Activity
       │
       ▼
┌─────────────────────────┐
│ Activity Card           │
│ - Title                 │
│ - Description           │
│ - Code Textarea         │
│ - Submit Button         │
└──────┬──────────────────┘
       │
       │ 4. Write Code
       │
       ▼
┌─────────────────────────┐
│ Code in textarea        │
│ (max 50KB)              │
└──────┬──────────────────┘
       │
       │ 5. Click Submit
       │
       ▼
┌─────────────────────────┐
│ Validate Input:         │
│ - Not empty?            │
│ - Not too large?        │
└──────┬──────────────────┘
       │
     ┌─┴───────┐
     │          │
  ✓ Valid    ✗ Invalid
     │          │
     │          ▼
     │      ┌──────────────────┐
     │      │ Error Feedback   │
     │      │ (Show for 3s)    │
     │      └──────────────────┘
     │
     ▼
┌──────────────────────────────┐
│ POST /api/submit             │
│ - fullName                   │
│ - activityNumber             │
│ - code                       │
└──────┬───────────────────────┘
       │
       ▼
┌──────────────────────────────┐
│ Database (SQLite)            │
│ INSERT OR UPDATE submission  │
│ UNIQUE(name, activity)       │
└──────┬───────────────────────┘
       │
       ▼
┌──────────────────────────────┐
│ Success Response             │
│ ✓ "Submitted successfully"   │
│   (Auto-hide after 3s)       │
└──────────────────────────────┘
       │
       │ 6. Can logout or continue
       │
       ▼
   ┌──────────────┐
   │ Logout       │
   │ (Clear data) │
   └──────┬───────┘
          │
          ▼
     ┌────────────┐
     │ Login Page │
     └────────────┘
```

---

## Admin Flow Diagram

```
┌─────────────┐
│ INSTRUCTOR  │
└──────┬──────┘
       │
       │ 1. Open https://app.com/admin
       │
       ▼
┌──────────────────────────────┐
│ GET /admin                   │
│ Load admin.html              │
└──────┬───────────────────────┘
       │
       ▼
┌──────────────────────────────┐
│ Admin Panel Loads            │
│ - Submissions Table (empty)  │
│ - Filter dropdowns           │
│ - Export button              │
└──────┬───────────────────────┘
       │
       │ 2. JavaScript loads data
       │
       ▼
┌──────────────────────────────┐
│ GET /api/admin/submissions   │
│ Headers:                     │
│ x-admin-token: [token]       │
└──────┬───────────────────────┘
       │
       ▼
┌──────────────────────────────┐
│ Server validates token       │
└──────┬───────────────────────┘
       │
     ┌─┴────────────┐
     │               │
  ✓ Valid        ✗ Invalid
     │               │
     │               ▼
     │          ┌─────────────┐
     │          │ 401 Error   │
     │          └─────────────┘
     │
     ▼
┌──────────────────────────────┐
│ Database Query:              │
│ SELECT * FROM submissions    │
│ ORDER BY full_name           │
└──────┬───────────────────────┘
       │
       ▼
┌──────────────────────────────┐
│ Return JSON:                 │
│ [                            │
│   {                          │
│     id: 1,                   │
│     full_name: "Bekouch..",│
│     activity_number: 1,      │
│     code_text: "...",        │
│     timestamp: "2024-01-15"  │
│   },                         │
│   ...                        │
│ ]                            │
└──────┬───────────────────────┘
       │
       ▼
┌──────────────────────────────┐
│ Display in Table:            │
│ ┌─────────────────────────┐  │
│ │ Name │ Act │ Date │ Ver│  │
│ ├─────────────────────────┤  │
│ │Bekou│ #1 │ 1/15 │ •  │  │
│ │Djaou│ #2 │ 1/15 │ •  │  │
│ │Rahal│ #3 │ 1/15 │ •  │  │
│ └─────────────────────────┘  │
└──────┬───────────────────────┘
       │
   ┌───┴──────────┬─────────────┐
   │              │             │
   │ 3. Filter    │ 4. View     │ 5. Export
   │              │             │
   ▼              ▼             ▼
 ┌──────────┐  ┌─────────┐  ┌────────────┐
 │Filter by │  │Modal:   │  │Generate CSV│
 │Student   │  │Show     │  │Download    │
 │or Activity│  │Code     │  │File        │
 │           │  │         │  │            │
 │Re-filter  │  │Close X  │  │            │
 │table      │  │         │  │            │
 └──────────┘  └─────────┘  └────────────┘
```

---

## Database Schema & Relationships

```
┌─────────────────────────────────────────┐
│           USERS TABLE                   │
├──────────────┬────────────────────────┤
│ id (PK)      │ INTEGER PRIMARY KEY    │
│ full_name    │ TEXT UNIQUE NOT NULL   │
│ created_at   │ DATETIME               │
└──────────────┴────────────────────────┘
         │
         │ (Referenced by)
         │
┌─────────────────────────────────────────┐
│        SUBMISSIONS TABLE                │
├──────────────┬────────────────────────┤
│ id (PK)      │ INTEGER PRIMARY KEY    │
│ full_name    │ TEXT NOT NULL          │
│ activity_num │ INTEGER (1-3)          │
│ code_text    │ TEXT (max 50KB)        │
│ timestamp    │ DATETIME DEFAULT NOW   │
├──────────────┼────────────────────────┤
│ UNIQUE       │ (full_name,            │
│ CONSTRAINT   │  activity_number)      │
│              │ Prevents duplicates!   │
└──────────────┴────────────────────────┘

Example Data:
┌────┬──────────────────┬─────────────┬──────────┬─────────────────┐
│ id │ full_name        │ activity_num│ code_txt │ timestamp       │
├────┼──────────────────┼─────────────┼──────────┼─────────────────┤
│ 1  │ Bekouch Ikram    │ 1           │ void ma..│ 2024-01-15 10:30│
│ 2  │ Bekouch Ikram    │ 2           │ class St..│ 2024-01-15 11:45│
│ 3  │ Djaoud Sara      │ 1           │ void ma..│ 2024-01-15 11:00│
│ 4  │ Rahali Hanane    │ 3           │ for (int..│ 2024-01-15 11:15│
└────┴──────────────────┴─────────────┴──────────┴─────────────────┘
```

---

## API Request/Response Flow

### Login Flow
```
REQUEST:
┌──────────────────────────────────────┐
│ POST /api/login                      │
│ Content-Type: application/json       │
├──────────────────────────────────────┤
│ {                                    │
│   "fullName": "Bekouch Ikram"        │
│ }                                    │
└──────────────────────────────────────┘

SERVER PROCESSING:
1. Validate input (not empty)
2. Trim whitespace
3. Check against ALLOWED_USERS
4. Generate base64 token

RESPONSE (if valid):
┌──────────────────────────────────────┐
│ 200 OK                               │
├──────────────────────────────────────┤
│ {                                    │
│   "success": true,                   │
│   "message": "Login successful",     │
│   "user": "Bekouch Ikram",          │
│   "token": "QmVrb3VjaC4uLg=="      │
│ }                                    │
└──────────────────────────────────────┘

RESPONSE (if invalid):
┌──────────────────────────────────────┐
│ 401 Unauthorized                     │
├──────────────────────────────────────┤
│ {                                    │
│   "success": false,                  │
│   "message": "Access denied. You..." │
│ }                                    │
└──────────────────────────────────────┘
```

### Submit Activity Flow
```
REQUEST:
┌──────────────────────────────────────┐
│ POST /api/submit                     │
│ Content-Type: application/json       │
├──────────────────────────────────────┤
│ {                                    │
│   "fullName": "Bekouch Ikram",      │
│   "activityNumber": 1,               │
│   "code": "void main() { ... }"      │
│ }                                    │
└──────────────────────────────────────┘

SERVER PROCESSING:
1. Validate all fields present
2. Validate user is in whitelist
3. Validate activity number (1-3)
4. Validate code not empty
5. Sanitize code text
6. INSERT OR UPDATE database
   (UNIQUE constraint handles duplicates)
7. Return success

RESPONSE:
┌──────────────────────────────────────┐
│ 200 OK                               │
├──────────────────────────────────────┤
│ {                                    │
│   "success": true,                   │
│   "message": "Submitted success",   │
│   "id": 42                           │
│ }                                    │
└──────────────────────────────────────┘
```

---

## Component Relationships

```
app.js (224 lines)
├─ handleLogin(e)
│  └─ POST /api/login
│     └─ server.js: app.post('/api/login')
│
├─ handleLogout()
│  └─ Clears sessionStorage
│
├─ showDashboard()
│  └─ Shows #dashboardScreen
│
├─ submitActivity(n)
│  └─ POST /api/submit
│     └─ server.js: app.post('/api/submit')
│
├─ loadUserSubmissions()
│  └─ GET /api/submissions/:name
│     └─ server.js: app.get('/api/submissions/:name')
│
└─ Helper functions
   ├─ showError()
   ├─ showFeedback()
   └─ Event listeners


admin.js (209 lines)
├─ loadAllSubmissions()
│  └─ GET /api/admin/submissions
│     └─ server.js: app.get('/api/admin/submissions')
│
├─ displaySubmissions()
│  └─ Renders table from data
│
├─ filterSubmissions()
│  └─ Client-side filter
│
├─ viewCode(index)
│  └─ Shows modal with full code
│
├─ exportToCSV()
│  └─ Creates and downloads CSV file
│
└─ Helper functions
   ├─ populateStudentFilter()
   ├─ closeCodeModal()
   └─ escapeHtml()
```

---

## Deployment Architecture

```
Local Development:
┌────────────────────────────────┐
│ Your Computer                  │
│ ┌──────────────────────────┐   │
│ │ npm install              │   │
│ │ npm start                │   │
│ │ http://localhost:3000    │   │
│ │ database.db (local file) │   │
│ └──────────────────────────┘   │
└────────────────────────────────┘


Render Deployment:
┌────────────────────────────────────────┐
│ GitHub Repository                      │
│ (Push code here)                       │
└───────────────┬────────────────────────┘
                │ (Webhook)
                ▼
┌────────────────────────────────────────┐
│ Render.com Cloud                       │
│ ┌──────────────────────────────────┐   │
│ │ Node.js Runtime                  │   │
│ │ ┌────────────────────────────┐   │   │
│ │ │ server.js                  │   │   │
│ │ │ Express App                │   │   │
│ │ └────────────────────────────┘   │   │
│ │ ┌────────────────────────────┐   │   │
│ │ │ database.db (persistent)   │   │   │
│ │ │ (/data mount point)        │   │   │
│ │ └────────────────────────────┘   │   │
│ │ ┌────────────────────────────┐   │   │
│ │ │ public/                    │   │   │
│ │ │ (HTML, CSS, JS)            │   │   │
│ │ └────────────────────────────┘   │   │
│ └──────────────────────────────────┘   │
│ URL: https://dart-workshop-xxx.onrender.com
└────────────────────────────────────────┘
```

---

## Technology Stack Visual

```
┌────────────────────────────────────────────────────────────┐
│                      FRONTEND                              │
├────────────────────────────────────────────────────────────┤
│                                                            │
│  HTML5                CSS3                Vanilla JS       │
│  ├─ Semantic          ├─ Grid              ├─ Events      │
│  ├─ Forms             ├─ Flexbox           ├─ Fetch API   │
│  ├─ Accessibility     ├─ Animations        ├─ DOM Manip   │
│  └─ Structure         ├─ Responsive        └─ Storage     │
│                       ├─ Dark Theme                        │
│                       └─ Variables                         │
│                                                            │
│  (No React, Vue, Angular - Pure vanilla code)            │
└────────────────────────────────────────────────────────────┘
                           │
                  HTTP/JSON (REST API)
                           │
┌────────────────────────────────────────────────────────────┐
│                      BACKEND                               │
├────────────────────────────────────────────────────────────┤
│                                                            │
│  Node.js                   Express.js                      │
│  ├─ Event loop             ├─ Routing                     │
│  ├─ HTTP server            ├─ Middleware                  │
│  ├─ Module system          ├─ Request handlers            │
│  └─ Runtime                └─ Response formatting         │
│                                                            │
│  better-sqlite3            body-parser / CORS            │
│  ├─ SQLite bindings        ├─ JSON parsing                │
│  ├─ Prepared statements    ├─ Cross-origin support       │
│  └─ Synchronous API        └─ Request logging            │
│                                                            │
└────────────────────────────────────────────────────────────┘
                           │
                       File System
                           │
┌────────────────────────────────────────────────────────────┐
│                      DATABASE                              │
├────────────────────────────────────────────────────────────┤
│                                                            │
│  SQLite3 (database.db)                                    │
│  ├─ submissions table                                     │
│  │  ├─ Rows: ~1KB per submission                         │
│  │  ├─ Query time: < 50ms                                │
│  │  └─ Max size: Limited by disk                         │
│  │                                                        │
│  ├─ users table                                          │
│  │  ├─ Rows: 3 authorized users                          │
│  │  └─ Simple whitelist                                  │
│  │                                                        │
│  └─ Indexing: UNIQUE(full_name, activity_number)         │
│                                                            │
│  Persistent:                                             │
│  ├─ On Render: Auto-saved, survives restarts             │
│  ├─ On Railway: Same                                      │
│  └─ On Heroku: Ephemeral (use add-on for persistence)    │
│                                                            │
└────────────────────────────────────────────────────────────┘
```

---

This architecture is:
✅ Simple (no complex patterns)
✅ Scalable (handles 100+ users easily)
✅ Maintainable (readable code)
✅ Secure (input validation, parameterized queries)
✅ Deployable (one-click on Render)
