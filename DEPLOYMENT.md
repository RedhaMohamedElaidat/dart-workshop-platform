# 🚀 Deployment Guide

Complete step-by-step guide to deploy the Dart Workshop platform to production.

## Option 1: Deploy to Render (Recommended ⭐)

Render is free, easy, and perfect for this application.

### Step 1: Prepare Your Repository

1. Make sure you have Git installed
2. Create a new repository on GitHub:
   - Go to https://github.com/new
   - Repository name: `dart-workshop`
   - Choose "Public" or "Private"
   - Click "Create repository"

3. Push your code:
```bash
cd dart-workshop
git init
git add .
git commit -m "Initial commit: Dart workshop platform"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/dart-workshop.git
git push -u origin main
```

### Step 2: Connect to Render

1. Go to https://render.com (create free account if needed)

2. Click **"New +"** in the top right → **"Web Service"**

3. Select **"Connect a repository"**
   - Search for `dart-workshop`
   - Click "Connect"

4. **Configure the service**:
   - **Name**: `dart-workshop`
   - **Environment**: `Node`
   - **Region**: Choose closest to your location (e.g., Frankfurt, Singapore)
   - **Branch**: `main`
   - **Build Command**: 
     ```
     npm install
     ```
   - **Start Command**: 
     ```
     npm start
     ```

5. **Environment Variables** (optional, but add if you want):
   - Click "Add Environment Variable"
   - Key: `NODE_ENV`
   - Value: `production`

6. **Plan**: Select "Free" (sufficient for this project)

7. Click **"Create Web Service"**

### Step 3: Wait for Deployment

- Render will automatically build and deploy your app
- This takes ~2-3 minutes
- You'll see live logs in the dashboard
- When complete, you'll get a URL like: `https://dart-workshop-xxxxx.onrender.com`

### Step 4: Test Your Deployment

- **Dashboard**: https://dart-workshop-xxxxx.onrender.com
- **Admin Panel**: https://dart-workshop-xxxxx.onrender.com/admin
- **Test Login**: Use "Bekouch Ikram"

### Step 5: Share with Students

Send them this link:
```
https://dart-workshop-xxxxx.onrender.com
```

---

## Option 2: Deploy to Railway

Railway is also free and very simple.

### Step 1: Prepare Repository (Same as Render)

Push code to GitHub (see Render Step 1 above)

### Step 2: Connect to Railway

1. Go to https://railway.app (create account)

2. Click **"New Project"** → **"Deploy from GitHub repo"**

3. Select your `dart-workshop` repository

4. Railway will auto-detect Node.js and create the project

5. **Configure**:
   - Go to "Variables" tab
   - PORT should be auto-set
   - No other configuration needed!

### Step 3: Deploy

- Click "Deploy now"
- Wait for deployment (~1-2 minutes)
- Once done, click "View Logs" to confirm it's running

### Step 4: Get Your URL

- Go to "Settings" tab
- Find your deployment URL (similar to Render)
- Click to open your app

### Step 5: Share with Students

```
https://your-railway-url.railway.app
```

---

## Option 3: Deploy to Heroku (Legacy)

Heroku ended free tier but still available for paid plans.

### Step 1: Install Heroku CLI

```bash
# macOS
brew tap heroku/brew && brew install heroku

# Windows (Download installer)
# https://devcenter.heroku.com/articles/heroku-cli

# Linux
curl https://cli.heroku.com/install.sh | sh
```

### Step 2: Login & Create App

```bash
heroku login
heroku create dart-workshop
```

### Step 3: Deploy

```bash
cd dart-workshop
git push heroku main
```

### Step 4: View Logs

```bash
heroku logs --tail
```

### Step 5: Open App

```bash
heroku open
```

---

## 📊 Comparison

| Feature | Render | Railway | Heroku |
|---------|--------|---------|--------|
| Free Tier | ✅ Yes | ✅ Yes | ❌ No (paid only) |
| Ease | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| Setup Time | 5 min | 5 min | 10 min |
| Auto Deploys | ✅ Yes | ✅ Yes | ✅ Yes |
| Recommended | 🏆 Best | 🏆 Best | OK |

---

## 🔄 Auto-Deploy Setup

Both Render and Railway support automatic deployment when you push to GitHub.

### How it works:
1. You push code to `main` branch on GitHub
2. Render/Railway detects the push
3. Automatically builds and deploys
4. Your app updates in ~2 minutes

### To trigger a new deployment:
```bash
git add .
git commit -m "Update activities"
git push origin main
# Wait 2-3 minutes, then refresh your app!
```

---

## 🔐 Security Checklist

Before sharing with students:

- [x] Verify login works with all three allowed users
- [x] Test activity submission
- [x] Check admin panel works
- [x] Verify CSV export works
- [x] Test on mobile device
- [x] Confirm database is persistent

---

## 📱 Testing Checklist

### Desktop
```
1. Login page loads ✅
2. Login with "Bekouch Ikram" ✅
3. Dashboard shows 3 activities ✅
4. Can write code in textarea ✅
5. Can submit code ✅
6. Can logout and login again ✅
7. Previous code is still there ✅
```

### Admin Panel
```
1. /admin page loads ✅
2. See all submissions in table ✅
3. Can filter by student ✅
4. Can filter by activity ✅
5. Can view full code ✅
6. Can export CSV ✅
```

### Mobile
```
1. Responsive layout ✅
2. Can type in textarea ✅
3. Submit button works ✅
4. No horizontal scroll ✅
```

---

## 📈 Performance Monitoring

### Render Dashboard
- Visit https://dashboard.render.com
- Click your service
- View "Metrics" tab for uptime and requests

### Railway Dashboard
- Visit https://railway.app/dashboard
- View deployment history and logs

### Health Check
Your app has a health endpoint:
```
GET https://your-app.com/api/health
```

Returns:
```json
{"status": "ok", "timestamp": "2024-01-15T10:30:00.000Z"}
```

---

## 🆘 Troubleshooting Deployment

### "Build failed"
- Check logs for error messages
- Ensure `package.json` exists
- Ensure `server.js` exists
- Run locally first: `npm install && npm start`

### "App won't start"
- Check `PORT` environment variable
- Render uses PORT from env (auto-set)
- Check for syntax errors in server.js

### "Database not working"
- SQLite creates `database.db` on first run
- It persists in the app filesystem
- After restart, database is still there
- Can't share database between multiple instances (use PostgreSQL for that)

### "Can't connect to deployed app"
- Wait 30 seconds for cold start
- Clear browser cache (Ctrl+Shift+Delete)
- Try in private/incognito window
- Check if app is running in dashboard

---

## 🎓 What to Share with Students

After deployment, send students this message:

```
🎯 Dart Workshop Platform is Live!

📍 Dashboard: https://your-app-url.com
👤 Login: Use your full name
   - Bekouch Ikram
   - Djaoud Sara
   - Rahali Hanane

📝 Activities:
   1. Student Average Calculator
   2. Student Class with Map
   3. Even Numbers Without Modulo

💾 Your code is automatically saved!

🆘 Issues? Refresh the page or contact instructor.
```

---

## 🔄 Updates & Maintenance

### To update the platform:

1. Make changes locally
2. Test with `npm start`
3. Push to GitHub:
   ```bash
   git add .
   git commit -m "Description of changes"
   git push origin main
   ```
4. Wait 2-3 minutes
5. Refresh your browser

### To add new students:

1. Edit `server.js` line with `ALLOWED_USERS`
2. Add new name to the array
3. Push to GitHub
4. Deploy automatically updates

---

**Happy Deploying! 🚀**
