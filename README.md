# 🎴 Noufi - Multiplayer Card Game

A real-time multiplayer card game where players compete to get closest to 9!

## 📋 Game Rules

- Each player gets **3 cards** dealt one by one
- Card values: 1-10 (Face cards = 10)
- **Scoring**: Total of all cards, but if you hit 10 or more, only keep the ones digit
  - Example: 13 → Score is **3**
  - Example: 10 → Score is **0** (called "9ar3a")
  - Example: 7 + 2 = 9 → Score is **9** (best hand!)
- Closest to **9 wins** the pot
- Ties = no money exchanged

---

## 🚀 Quick Start (Local Testing)

### Prerequisites
- Node.js installed (v14 or higher)
- A web browser

### Installation

1. **Install dependencies:**
```bash
cd noufi-game
npm install
```

2. **Start the server:**
```bash
npm start
```

3. **Open in browser:**
   - Go to `http://localhost:3000`
   - Open in **2 different browser tabs** (or devices on same network)

4. **Play:**
   - Both players enter the **same room code** (e.g., "room1")
   - Set bet amount
   - Click "Join Game"
   - Game starts automatically when 2 players join!

---

## 🌐 Deployment (Free Hosting)

### Option 1: Render.com (Recommended)

1. **Create account** at [render.com](https://render.com)

2. **New Web Service:**
   - Connect your GitHub repo (push this code to GitHub first)
   - Or use "Deploy from GitHub"

3. **Settings:**
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Instance Type:** Free

4. **Deploy!**
   - Your game will be live at: `https://your-app-name.onrender.com`
   - Share this URL with players!

**Note:** Free tier sleeps after 15 min of inactivity. First load takes ~30 seconds.

---

### Option 2: Railway.app

1. **Create account** at [railway.app](https://railway.app)

2. **New Project:**
   - "Deploy from GitHub"
   - Select your repo

3. **Environment:**
   - Railway auto-detects Node.js
   - No extra config needed!

4. **Deploy:**
   - Get your public URL
   - $5 free credit monthly

---

### Option 3: Glitch.com

1. Go to [glitch.com](https://glitch.com)

2. **New Project** → Import from GitHub

3. **Automatic deployment**
   - Edit `.env` if needed
   - Always free!

4. **Get URL:**
   - Format: `https://your-project.glitch.me`

---

## 📁 Project Structure

```
noufi-game/
├── server.js           # Game server (Node.js + Socket.IO)
├── package.json        # Dependencies
├── public/
│   ├── index.html      # Game UI
│   └── game.js         # Phaser game + Socket.IO client
└── README.md          # This file
```

---

## 🎮 How to Play

### For Players:

1. **Select Bet Amount:**
   - Choose from $10 to $500
   - You'll be matched with players betting the same amount

2. **Find Match:**
   - Click "Find Match"
   - Automatic matchmaking finds your opponent
   - Wait in queue (usually seconds!)

3. **Game Flow:**
   - Match found notification
   - Cards auto-deal (3 each)
   - Scores calculated automatically
   - Winner takes the pot!

4. **Play Again:**
   - Click "Play Again" button
   - Search for new opponent

### Matchmaking System:

- **Automatic pairing** - No room codes needed!
- **Bet-based matching** - Only play with same bet amount
- **Fast queue** - Matched in seconds when players available
- **Fair play** - Everyone bets the same stake

---

## 🔧 Customization

### Change Starting Money:
In `server.js` line 19:
```javascript
money: 1000  // Change to any amount
```

### Change Card Deck:
In `server.js` line 8:
```javascript
const CARD_VALUES = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 10, 10, 10];
// Modify as needed
```

### Change Colors:
In `public/index.html` CSS section:
```css
background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
/* Change gradient colors */
```

In `public/game.js` line 221:
```javascript
backgroundColor: '#0a5f38'  // Game table color
```

---

## 🐛 Troubleshooting

### "Cannot find module" error:
```bash
npm install
```

### Port already in use:
Change port in `server.js`:
```javascript
const PORT = process.env.PORT || 3001; // Use 3001 instead
```

### Cards not showing:
- Check browser console (F12)
- Make sure both players joined same room
- Refresh page and try again

### Socket.IO connection failed:
- Check if server is running
- Verify URL is correct
- Check firewall settings

---

## 🎯 Features

✅ **Automatic matchmaking queue**  
✅ Real-time multiplayer  
✅ Bet-based player pairing  
✅ Fast match finding  
✅ Betting system with money tracking  
✅ Automatic scoring  
✅ Visual card display  
✅ Play again functionality  
✅ Mobile responsive  
✅ No database needed (sessions only)  

---

## 🔜 Future Enhancements

Ideas for v2.0:
- [ ] Multiple players per room (3-4 players)
- [ ] Leaderboards (requires database)
- [ ] Chat system
- [ ] Card animations
- [ ] Sound effects
- [ ] Player avatars
- [ ] Tournament mode
- [ ] Spectator mode

---

## 📝 License

Free to use and modify! Built for learning and fun.

---

## 💡 Tips for Development

### Testing Locally:
1. Open `http://localhost:3000` in Chrome
2. Open same URL in Firefox (or private window)
3. Both join same room = instant multiplayer test!

### Debug Mode:
Check browser console (F12) for:
- Socket.IO connection status
- Game state updates
- Error messages

### Add Features:
- Server logic: Edit `server.js`
- Visual design: Edit `public/game.js` (Phaser)
- UI/Styling: Edit `public/index.html`

---

## 🤝 Support

Need help? Check:
1. This README
2. Browser console for errors
3. Server logs in terminal

---

**Enjoy playing Noufi! 🎴✨**
