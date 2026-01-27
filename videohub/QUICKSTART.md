# 🚀 DesiHub - Quick Start Guide

## What's New? 

DesiHub is now a **fully dynamic, real-time video streaming platform** with:
- ✅ User authentication (Login/Signup)
- ✅ Guest visitor mode
- ✅ Real-time watch history tracking
- ✅ User data persistence
- ✅ Smart recommendation system
- ✅ Share tracking for registered users

## Getting Started

### 1. Start the Application
```bash
cd /workspaces/d-hub/videohub
npm start
```

The app will open at: `http://localhost:3001`

### 2. First Time Setup

**Step 1: Age Verification**
- Click "Yes, I'm 18+" to proceed

**Step 2: Choose Your Path**

#### Option A: Sign Up (Create Account)
1. Click "Sign Up"
2. Enter your details:
   - **Full Name**: Your name
   - **Email**: your@email.com
   - **Password**: At least 6 characters
3. Click "Sign Up" button
4. ✅ You're logged in!

#### Option B: Login (Existing Account)
1. Click "Login"
2. Enter your registered email and password
3. Click "Login" button
4. ✅ Your watch history loads automatically!

#### Option C: Guest Mode
1. Click "Continue as Guest"
2. Browse all videos without registration
3. ⚠️ No data persists between sessions

### 3. Using the Platform

#### Watching Videos
1. Click any video card
2. Watch the video
3. ✅ Automatically added to your watch history
4. Share with friends using the Share button

#### Your Watch History
- Registered users: All videos you watch are saved
- Next time you log in: Your history is still there!
- Smart recommendations: Unwatched videos show first

#### Share Videos
1. Click the "Share" button
2. Link copies to clipboard
3. Share with friends
4. Your share count updates in real-time

#### View Your Profile
- Look at the header to see your name
- Guest users show "(Guest)" label
- Logout anytime to switch accounts

### 4. Managing Your Account

#### Logout
1. Click the red "Logout" button in header
2. Returns to login page
3. Data is saved - log back in anytime

#### Switch Accounts
1. Click "Logout"
2. Click "Login" 
3. Use different email/password
4. ✅ New account data loads

#### Guest to Account
1. If in Guest mode, logout
2. Click "Sign Up"
3. Create your account
4. ✅ Future sessions will be tracked

## 🎯 Key Features

### Real-Time Updates
- Watch history updates **instantly**
- Share count increments **immediately**
- No page refresh needed
- All changes saved automatically

### Smart Recommendations
| Status | Position |
|--------|----------|
| **Unwatched videos** | Top (encouraged to watch) |
| **Watched videos** | Bottom (but available) |
| **Current video** | Hidden (not recommended) |

### Data Tracking
- 📺 **Watch History**: Every video you watch
- 🔗 **Share Count**: How many times you shared
- 👤 **Profile Info**: Your name and email
- ⏰ **Account Created**: When you signed up

## 💾 Where's My Data?

All data stored in browser's **localStorage**:

To view your data:
1. Open browser (Chrome, Firefox, Safari, Edge)
2. Press `F12` or Right-click → Inspect
3. Go to **Application** tab
4. Click **LocalStorage**
5. Find `http://localhost:3001`
6. View your data:
   - `desiHubUsers` - All registered users
   - `desiHub_[your-id]_viewed` - Your watch history
   - `desiHub_[your-id]_shares` - Your share count
   - `ageVerified` - Age verification status

## 🧪 Test Accounts

After signing up, you can create multiple accounts:

**Account 1:**
- Email: john@example.com
- Password: password123
- Name: John Doe

**Account 2:**
- Email: jane@example.com
- Password: password456
- Name: Jane Smith

Each account has its own:
- Watch history
- Share tracking
- Profile info

## 🎮 Try These Actions

1. **Sign Up** → Create a new account
2. **Watch Videos** → See them added to history
3. **Share Videos** → Watch share count increase
4. **Logout** → Log back in
5. **Verify Data** → Open DevTools and check localStorage
6. **Switch Accounts** → Logout and use different email
7. **Guest Mode** → Browse without account
8. **Refresh Page** → Watch data persist

## ⚡ Quick Tips

✨ **Tip 1**: Your watch history never disappears
- Once watched, always visible in recommendations
- Can rewatch unlimited times

✨ **Tip 2**: Guest mode is temporary
- Perfect for quick browsing
- No account needed
- Data doesn't persist

✨ **Tip 3**: Password protection
- Minimum 6 characters
- No special chars required (but good practice)
- Stored in localStorage (dev only)

✨ **Tip 4**: Same email = Same account
- Passwords must match to login
- Prevents duplicate accounts
- Secure your password!

## 🔍 Check Your Data

**In Browser DevTools:**
```
LocalStorage Keys:
├── ageVerified → true/false
├── desiHubUser → Your current user
├── desiHubUsers → All registered users
├── desiHub_[userId]_viewed → Your watch history
└── desiHub_[userId]_shares → Your share count
```

## ❌ Troubleshooting

**Problem: "Invalid email or password"**
- Solution: Check if account exists, verify spelling

**Problem: "Email already registered"**
- Solution: Use different email or click Login

**Problem: "Password must be at least 6 characters"**
- Solution: Use longer password (6+ chars)

**Problem: Data not saving**
- Solution: Check localStorage is enabled in browser

**Problem: Can't see shared videos**
- Solution: Share count only shows for registered users

## 📱 Platform Support

✅ Works on:
- Chrome/Chromium
- Firefox
- Safari
- Edge
- Mobile browsers

## 🎓 Learning Opportunities

Explore these concepts in the code:
- React Hooks (useState, useEffect)
- Context API (AuthContext)
- localStorage API
- Form validation
- Conditional rendering
- Component communication
- State management
- Real-time updates

## 🚀 Next Steps

1. **Test Registration**: Create an account
2. **Watch Videos**: Build your history
3. **Check localStorage**: Verify data storage
4. **Try Guest Mode**: Browse without account
5. **Switch Accounts**: See different data
6. **Share Videos**: Track sharing

## 📊 What Gets Tracked?

### For Registered Users:
```
✓ Videos watched
✓ How many times shared
✓ Account creation date
✓ Login history (per session)
```

### For Guest Users:
```
✗ Nothing persists
✗ No watch history
✗ No tracking data
✗ Fresh start each session
```

## 🎯 Performance

- ⚡ Instant video loading
- ⚡ Real-time data updates
- ⚡ Smooth animations
- ⚡ Fast recommendations
- ⚡ No server required (offline capable)

---

**Enjoy exploring DesiHub! 🎥**

For detailed feature documentation, see [FEATURES.md](FEATURES.md)
