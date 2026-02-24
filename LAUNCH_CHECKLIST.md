# ✅ Setup & Launch Checklist

Use this checklist to ensure everything is ready to go!

---

## 📦 Phase 1: Local Setup (5 minutes)

- [ ] Download and extract the `dart-workshop` folder
- [ ] Open terminal/command prompt
- [ ] Navigate to folder: `cd dart-workshop`
- [ ] Install Node.js from nodejs.org (if not installed)
- [ ] Run: `npm install` (installs dependencies)
- [ ] Run: `npm start` (starts server)
- [ ] Open browser: http://localhost:3000
- [ ] See login page with Dart Workshop title
- [ ] See dark theme with indigo accent color

---

## 🧪 Phase 2: Test Locally (10 minutes)

### Test Login
- [ ] Type "Bekouch Ikram" and click Login
- [ ] See dashboard with 3 activity cards
- [ ] See user greeting "Welcome, Bekouch Ikram!"
- [ ] Test invalid login "Unknown Person" → See error message
- [ ] Test valid login "Djaoud Sara"
- [ ] Test valid login "Rahali Hanane"

### Test Activity Submission
- [ ] Click in Activity 1 textarea
- [ ] Type some Dart code:
  ```dart
  void main() {
    print('Hello Dart');
  }
  ```
- [ ] Click "Submit Activity 1"
- [ ] See success message: "✓ Submitted successfully!"
- [ ] Reload page (F5) and verify code is still there
- [ ] Try submitting empty code → See error
- [ ] Resubmit same activity → Should update, not duplicate

### Test All 3 Activities
- [ ] Submit code for Activity 2
- [ ] Submit code for Activity 3
- [ ] All show success messages
- [ ] All persist after reload

### Test Logout & Session
- [ ] Click Logout button
- [ ] See login page again
- [ ] Login again as different user
- [ ] New user sees empty textareas (not previous user's code)

### Test Admin Panel
- [ ] Go to http://localhost:3000/admin
- [ ] See table with your submissions
- [ ] See columns: Student Name, Activity #, Date, Code Preview
- [ ] Click "View" button → See modal with full code
- [ ] Close modal (click X or outside)
- [ ] Filter by student dropdown
- [ ] Filter by activity dropdown
- [ ] Click "📥 Export to CSV" → File downloads
- [ ] Open CSV file in spreadsheet → See your data

---

## 📁 Phase 3: File Structure Verification

Verify all files are in place:

```
dart-workshop/
├── ✅ server.js           (backend - 264 lines)
├── ✅ package.json        (dependencies)
├── ✅ README.md          (documentation)
├── ✅ DEPLOYMENT.md      (deployment guides)
├── ✅ .gitignore         (git config)
├── ✅ node_modules/      (created by npm install)
├── ✅ database.db        (created on first run)
└── ✅ public/
    ├── ✅ index.html     (dashboard - 179 lines)
    ├── ✅ admin.html     (admin panel - 75 lines)
    ├── ✅ app.js         (dashboard logic - 224 lines)
    ├── ✅ admin.js       (admin logic - 209 lines)
    └── ✅ styles.css     (styling - 536 lines)
```

Count of files: **9 files total** ✓

---

## 🌐 Phase 4: GitHub Setup (5 minutes)

**If you want to deploy to Render/Railway:**

- [ ] Create GitHub account (free at github.com)
- [ ] Create new repository called `dart-workshop`
- [ ] Copy the git commands shown
- [ ] In terminal, run these commands from project folder:

```bash
git init
git add .
git commit -m "Initial commit: Dart workshop platform"
git branch -M main
git remote add origin YOUR_GITHUB_URL_HERE
git push -u origin main
```

- [ ] Go to GitHub.com and verify all files are uploaded
- [ ] Files visible in browser: ✓

---

## 🚀 Phase 5: Deploy to Render (5 minutes)

**Option A: Deploy to Render (Recommended)**

- [ ] Go to https://render.com
- [ ] Sign up (free account)
- [ ] Click "New +" → "Web Service"
- [ ] Click "Connect a repository"
- [ ] Search and select `dart-workshop`
- [ ] Fill in settings:
  - [ ] Name: `dart-workshop`
  - [ ] Environment: `Node`
  - [ ] Region: Your closest region
  - [ ] Build Command: `npm install`
  - [ ] Start Command: `npm start`
- [ ] Click "Create Web Service"
- [ ] Wait 2-3 minutes for deployment
- [ ] See "Live" status in dashboard
- [ ] Copy the URL (something like: `https://dart-workshop-xxxxx.onrender.com`)
- [ ] Paste URL in browser
- [ ] See login page with dark theme ✓
- [ ] Test login works ✓
- [ ] Test submission works ✓
- [ ] Test admin panel works ✓

**Option B: Deploy to Railway (Also easy)**

- [ ] Go to https://railway.app
- [ ] Sign up (free account)
- [ ] Click "New Project" → "Deploy from GitHub"
- [ ] Select your `dart-workshop` repo
- [ ] Railway auto-configures everything
- [ ] Click "Deploy"
- [ ] Wait for deployment
- [ ] Get your URL from dashboard
- [ ] Test as above ✓

---

## 📱 Phase 6: Mobile & Responsive Testing

Test on different screen sizes:

### Desktop (1920px)
- [ ] 3 activity cards in grid
- [ ] All text readable
- [ ] Buttons large enough
- [ ] Hover effects work

### Tablet (768px)
- [ ] 2 activity cards per row
- [ ] No horizontal scroll
- [ ] Layout adapts properly

### Mobile (375px)
- [ ] 1 activity card per row
- [ ] Full width cards
- [ ] Textarea can be expanded
- [ ] Buttons touch-friendly (44px minimum)
- [ ] No horizontal scroll
- [ ] Admin table scrolls horizontally (expected)

---

## 🔐 Phase 7: Security Verification

- [ ] Try to login with SQL injection: `' OR '1'='1` → See error
- [ ] Try empty password (no password field) → N/A
- [ ] Try submitting 10MB of code → See size limit error
- [ ] Try submitting XSS payload: `<script>alert('xss')</script>`
  - [ ] Code saves without executing
  - [ ] Shows in admin panel as text
- [ ] Admin panel requires token → Try without token header
- [ ] Database not accessible directly (only via API)

---

## 📊 Phase 8: Data Verification

After completing Phase 2:

- [ ] Database file exists: `database.db` in root
- [ ] Can open admin panel and see submissions
- [ ] Each submission has:
  - [ ] Student name
  - [ ] Activity number (1, 2, or 3)
  - [ ] Code text
  - [ ] Timestamp
- [ ] CSV export contains same data
- [ ] Reopening browser shows previous submissions

---

## 🎓 Phase 9: Student Information

Before sharing with students:

- [ ] Email template ready:
  ```
  🎯 Dart Workshop Activities Platform

  Dashboard: https://your-app-url.onrender.com
  
  Login with your full name:
  - Bekouch Ikram
  - Djaoud Sara
  - Rahali Hanane

  Submit your code for 3 activities. Good luck!
  ```

- [ ] Access link tested ✓
- [ ] Login works ✓
- [ ] Activities visible ✓
- [ ] Submission works ✓

---

## 🔄 Phase 10: Update & Maintenance

### Adding New Students

To add a new student:

1. Edit `server.js`
2. Find line 86 with `ALLOWED_USERS`
3. Add new name to array:
   ```javascript
   const ALLOWED_USERS = [
     'Bekouch Ikram',
     'Djaoud Sara', 
     'Rahali Hanane',
     'New Student Name'  // ← Add here
   ];
   ```
4. Save file
5. Run: `git add . && git commit -m "Add new student" && git push`
6. Wait 2-3 minutes
7. New student can login!

- [ ] Test process with a test name

### Updating Activity Descriptions

To modify activity text:

1. Edit `public/index.html`
2. Find activity card you want to change
3. Edit the HTML description
4. Save and push to GitHub
5. Changes appear in 2-3 minutes

- [ ] Update one activity as test

### Viewing Submissions

To check student submissions:

1. Go to https://your-app.onrender.com/admin
2. View all submissions in table
3. Click "View" to see full code
4. Click "Export" to get CSV file

- [ ] Review exported CSV format

---

## ✨ Phase 11: Launch Preparation

One week before students start:

- [ ] [ ] Test everything locally one more time
- [ ] [ ] Test on production (deployed link)
- [ ] [ ] Test on multiple devices
- [ ] [ ] Test on different browsers (Chrome, Firefox, Safari, Edge)
- [ ] [ ] Prepare student welcome email
- [ ] [ ] Prepare FAQ document (optional)
- [ ] [ ] Test login with all 3 student names
- [ ] [ ] Test on mobile one final time
- [ ] [ ] Verify admin panel is private (token gated)
- [ ] [ ] Check logs for errors (if available)

---

## 🎯 Phase 12: Launch Day

Before releasing to students:

- [ ] [ ] Do final test run
- [ ] [ ] Verify all 3 students can login
- [ ] [ ] Send welcome email
- [ ] [ ] Monitor first hour of submissions
- [ ] [ ] Check admin panel for incoming submissions
- [ ] [ ] Respond to any issues
- [ ] [ ] Celebrate! 🎉

---

## 📞 Support & Troubleshooting

### Common Issues

**"npm: command not found"**
→ Install Node.js from nodejs.org

**"Port 3000 already in use"**
→ Change port: `PORT=3001 npm start`

**"Can't find database.db"**
→ Run app once, it auto-creates the file

**"Students can't login"**
→ Check name spelling matches exactly
→ Case-sensitive! "bekouch ikram" ≠ "Bekouch Ikram"

**"Admin panel shows no data"**
→ Ensure you're accessing `/admin` endpoint
→ Check console for errors (F12)

**"Code doesn't save"**
→ Check browser console for errors
→ Try clearing browser cache
→ Try in private/incognito window

---

## 📈 Success Criteria

Your setup is complete when:

✅ Login works with all 3 approved names
✅ Activity submission works
✅ Code persists after reload
✅ Admin panel shows submissions
✅ CSV export works
✅ Mobile layout is responsive
✅ Deployed link is live and working
✅ All 3 students can access it
✅ No errors in browser console
✅ No errors in server logs

---

## 🎓 Next Steps After Launch

1. Monitor submissions daily
2. Check admin panel to see student progress
3. Export CSV weekly for backup
4. Add new students as they enroll
5. Update activity descriptions if needed
6. Collect feedback from students

---

## 📚 Reference Materials

All documentation is in the `dart-workshop` folder:

| File | Purpose |
|------|---------|
| **README.md** | Complete guide (features, API, setup) |
| **DEPLOYMENT.md** | How to deploy (3 options) |
| **QUICK_START.md** | Get running in 5 minutes |
| **ARCHITECTURE.md** | System design & diagrams |
| **PROJECT_SUMMARY.md** | What was built |

---

## ✅ Final Checklist

- [ ] All files downloaded and extracted
- [ ] Node.js installed
- [ ] `npm install` completed
- [ ] `npm start` works locally
- [ ] Login page loads
- [ ] Dashboard works
- [ ] Submissions work
- [ ] Admin panel works
- [ ] Code pushed to GitHub
- [ ] Deployed to Render/Railway
- [ ] Test link works in browser
- [ ] Mobile responsive tested
- [ ] Student email ready
- [ ] Ready to launch! 🚀

---

**Congratulations! Your Dart Workshop platform is ready!** 🎯

For any questions, refer to the documentation files or check the code comments.

Good luck with your workshop! 🌟
