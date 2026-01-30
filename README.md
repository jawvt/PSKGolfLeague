# PSK Golf League - Website

A modern, responsive golf league management website built with vanilla HTML, CSS, and JavaScript.

## Features

✅ **User Authentication**
- Login with existing account
- Create new account
- Password visibility toggle

✅ **Dashboard**
- Week status overview
- Quick action buttons
- Player status tracking

✅ **Round Declaration**
- Declare round once per week
- Time tracking for declarations
- Rules enforcement (can only declare after admin starts week)

✅ **Score Entry**
- Input scores for holes 1-9
- Auto-calculate total score
- Confirmation before submission
- Locked scoring (cannot change after submission)

✅ **Leaderboard**
- Ranked player list (sorted by lowest score)
- Status display (Completed/Pending)
- Real-time updates

✅ **Admin Features**
- Start/End week functionality
- Week management
- Player reset for new week

✅ **Responsive Design**
- Desktop, tablet, and mobile friendly
- Modern minimal interface
- Red and white color scheme

## Tech Stack

- **HTML5** - Structure
- **CSS3** - Styling & Responsive Layout
- **JavaScript (Vanilla)** - State Management & Logic

## File Structure

```
PSKGolfLeague/
├── index.html      # Main HTML structure
├── styles.css      # Styling and responsive design
├── script.js       # Application logic and state
└── README.md       # This file
```

## How to Use

### 1. **Open the Website**
Simply open `index.html` in any modern web browser.

### 2. **Test Accounts**

Use these pre-configured accounts:

**Regular Players:**
- Username: `john` | Password: `password123`
- Username: `jane` | Password: `golf456`
- Username: `bob` | Password: `birdie789`

**Admin Account:**
- Username: `admin` | Password: `admin123`

**Create New Account:**
- Click "Sign up" on the login page
- Choose a username (min 3 characters)
- Set a password (min 6 characters)

### 3. **Admin Workflow**

1. Login as admin
2. Click "Start Week" to begin the week
3. Players can now declare rounds
4. After week is complete, click "End Week" to:
   - Reset declarations for next week
   - Increment to Week 2
   - Keep scores in leaderboard

### 4. **Player Workflow**

1. Login with your account
2. View current week status
3. Click "Declare Round" (only available if week is started by admin)
4. After declaring, click "Enter Score"
5. Enter scores for all 9 holes
6. Review total and confirm submission
7. Score is locked and cannot be changed
8. View leaderboard to see your ranking

## Rules Enforced

✅ **Round Declaration Rules:**
- Cannot declare a round unless admin has started the week
- Can only declare once per week
- Declaration time is tracked

✅ **Score Entry Rules:**
- Cannot enter a score without declaring a round first
- Must fill all 9 holes before submitting
- Must confirm score before final submission
- Score is locked after submission

✅ **Leaderboard Rules:**
- Players ranked by lowest score (golf scoring)
- Pending scores shown as "—"
- Players without scores appear at bottom

## Color Scheme

- **Primary Red:** `#d1232a` (accent color, buttons, headers)
- **White:** `#ffffff` (backgrounds, text)
- **Light Gray:** `#f9f9f9` (page backgrounds)
- **Dark Text:** `#333333` (primary text)

## Responsive Breakpoints

- **Desktop:** Full layout with all features
- **Tablet (≤768px):** Adjusted grid and button sizes
- **Mobile (≤480px):** Single-column layout, optimized touch targets

## Features Demonstrated

### UI/UX
- Clean, modern dashboard-style interface
- Smooth transitions and animations
- Modal dialogs for confirmations
- Real-time form validation
- Hover states on interactive elements

### Functionality
- State management without a framework
- Form handling and validation
- Time tracking (declared time, submit time)
- Real-time total calculation
- Player ranking system

### Best Practices
- Well-commented code
- Semantic HTML
- CSS Grid and Flexbox layouts
- Mobile-first responsive design
- Accessible form inputs
- Clear visual hierarchy

## Tips

🎯 **Try This:**
1. Login as `admin`, start the week
2. Logout and login as `jane` (already has a score)
3. View the leaderboard to see how scoring works
4. Create a new account and go through the full workflow
5. Login as `admin` again and end the week to see reset

📱 **Mobile Testing:**
- Resize browser to test responsive layout
- Test on actual mobile device for best experience

🔒 **Security Note:**
This is a demo application. In production:
- Use secure backend authentication
- Hash passwords
- Use HTTPS
- Implement proper session management
- Validate all data server-side

## Browser Compatibility

Works on all modern browsers:
- Chrome/Chromium
- Firefox
- Safari
- Edge

Requires JavaScript enabled.

---

Built with ❤️ for PSK Golf League
