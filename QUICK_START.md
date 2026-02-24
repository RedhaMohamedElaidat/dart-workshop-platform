# ⚡ Quick Start Guide

Get the Dart Workshop platform running in 5 minutes!

## 🖥️ Local Setup (5 minutes)

### 1. Install Node.js
Download from https://nodejs.org/ (LTS version)

### 2. Navigate to project
```bash
cd dart-workshop
```

### 3. Install dependencies
```bash
npm install
```

### 4. Start server
```bash
npm start
```

You should see:
```
🚀 Dart Workshop Platform running on http://localhost:3000
📊 Admin panel: http://localhost:3000/admin
💾 Database: ./database.db
```

### 5. Open in browser
- **Dashboard**: http://localhost:3000
- **Admin**: http://localhost:3000/admin

---

## 🧪 Test It

1. Go to http://localhost:3000
2. Login with: **Bekouch Ikram**
3. Write some Dart code in Activity 1
4. Click **"Submit Activity 1"**
5. See success message ✓

### Admin Panel
1. Go to http://localhost:3000/admin
2. See your submission in the table
3. Click **"View"** to see code
4. Click **"📥 Export to CSV"** to download

---

## 🌐 Deploy to Production (5 minutes)

### Using Render (Easiest)

1. **Push to GitHub**
```bash
git init
git add .
git commit -m "First commit"
git remote add origin YOUR_GITHUB_URL
git push -u origin main
```

2. **Go to https://render.com**
   - Click "New +" → "Web Service"
   - Connect GitHub repository
   - Fill in:
     - **Name**: dart-workshop
     - **Build Command**: npm install
     - **Start Command**: npm start

3. **Click "Create Web Service"** and wait 2-3 minutes

4. **Get your URL** (e.g., https://dart-workshop-xxxxx.onrender.com)

5. **Share with students!**

---

## 📝 Add More Students

Edit `server.js` line 86:

```javascript
const ALLOWED_USERS = [
  'Bekouch Ikram',
  'Djaoud Sara', 
  'Rahali Hanane',
  'NEW NAME HERE'  // ← Add more names
];
```

Then deploy again!

---

## 🎯 File Structure

```
dart-workshop/
├── server.js             ← Backend (Express, SQLite)
├── package.json          ← Dependencies
├── database.db          ← Auto-created database
└── public/
    ├── index.html       ← Login & Dashboard
    ├── admin.html       ← Admin Panel
    ├── app.js           ← Dashboard Logic
    ├── admin.js         ← Admin Logic
    └── styles.css       ← Styling (dark theme)
```

---

## 🔑 Allowed Users

The only people who can login are:
- ✅ Bekouch Ikram
- ✅ Djaoud Sara
- ✅ Rahali Hanane

Edit `server.js` to add more!

---

## 🗄️ Database

SQLite stores all submissions in `database.db`:
- **submissions**: code, student name, activity number, timestamp
- **users**: allowed participants list

On Render/Railway, this file persists even after restarts!

---

## 🐛 Common Issues

### "npm: command not found"
→ Install Node.js from nodejs.org

### "Port 3000 already in use"
→ Change port: `PORT=3001 npm start`

### "Can't login"
→ Name must match exactly (check spelling)

### "No submissions in admin panel"
→ Go to /admin endpoint (not just root)

---

## 📞 Need Help?

1. Check **README.md** for detailed guide
2. Check **DEPLOYMENT.md** for deployment options
3. Read error messages in console (npm start output)
4. Check browser console (F12 → Console tab)

---

**That's it! You're ready to go! 🚀**
