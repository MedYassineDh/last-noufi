# ⚡ Quick Start Guide - Noufi Game

## 🏃 Get Running in 3 Minutes!

### Step 1: Install Dependencies
Open terminal in the `noufi-game` folder:

```bash
npm install
```

Wait for installation to complete (~30 seconds).

---

### Step 2: Start Server

```bash
npm start
```

You should see:
```
🎮 Noufi Game Server running on port 3000
   Visit: http://localhost:3000
```

---

### Step 3: Test Game

**Option A: Same Computer (Easiest)**
1. Open `http://localhost:3000` in Chrome
2. Open `http://localhost:3000` in Firefox (or incognito tab)
3. **Both select same bet amount** (e.g., $50)
4. Click "Find Match" on both
5. Automatic match in 1-2 seconds!
6. Game auto-starts!

**Option B: Two Devices on Same WiFi**
1. Find your IP address:
   - Windows: Open CMD, type `ipconfig`
   - Mac/Linux: Open Terminal, type `ifconfig`
   - Look for something like `192.168.1.X`

2. On your computer: Open `http://localhost:3000`
3. On other device: Open `http://YOUR_IP:3000`
   - Example: `http://192.168.1.100:3000`
4. **Both choose same bet amount**
5. Click "Find Match"
6. Instant pairing!

---

## 🌍 Put It Online (Free!)

### Easiest: Render.com

1. **Push to GitHub:**
   ```bash
   git init
   git add .
   git commit -m "Noufi game"
   git remote add origin YOUR_GITHUB_REPO_URL
   git push -u origin main
   ```

2. **Deploy on Render:**
   - Go to [render.com](https://render.com)
   - Sign up (free)
   - "New" → "Web Service"
   - Connect GitHub repo
   - Name: `noufi-game`
   - Build: `npm install`
   - Start: `npm start`
   - Click "Create Web Service"

3. **Play Online:**
   - Wait 2-3 minutes for deployment
   - Get URL: `https://noufi-game.onrender.com`
   - Share with friends!

---

## 🎮 How to Play

1. **Select bet amount** ($10 - $500)
2. Click "Find Match"
3. Wait for automatic pairing (usually 1-5 seconds)
4. Cards auto-deal!
5. Winner takes pot
6. Click "Play Again" to find new opponent

---

## 🆘 Common Issues

**"npm: command not found"**
→ Install Node.js from [nodejs.org](https://nodejs.org)

**"Port 3000 already in use"**
→ Change port in `server.js` to 3001 or kill the process

**"Cannot connect to game"**
→ Make sure server is running (see terminal output)

**Cards not showing**
→ Clear browser cache and refresh (Ctrl+F5)

---

## 🎨 Next Steps

Want to customize? Check:
- `server.js` - Game logic and rules
- `public/index.html` - UI design
- `public/game.js` - Visual effects

Read full `README.md` for detailed customization!

---

**You're all set! 🎴 Have fun!**
