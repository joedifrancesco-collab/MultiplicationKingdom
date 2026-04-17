# Learning Kingdom — Navigation Design Spec

**Purpose:** Plan desktop and mobile navigation before implementing Phase 5.  
**Date:** April 15, 2026  
**Status:** ✅ APPROVED — Design decisions locked in. Ready for implementation.

---

## 📋 DESIGN DECISIONS (APPROVED)

| Question | Decision | Notes |
|----------|----------|-------|
| 1. Desktop Nav | **Top Navbar** (dropdowns) | See detailed wireframe below |
| 2. Mobile Nav | **Full-screen Hamburger** | Slides from left, covers entire screen |
| 3. Gaming Mode | **Keep nav visible** | Nav visible during gameplay for context switching |
| 4. Subject Nesting | **As cards when entering subject** | Math Kingdom → shows 12 cards (1×-12×), not sub-items |
| 5. Quick Access | **No**, not needed for MVP | Can add "Recent Games" in future |
| 6. Styling | **No sidebar**, uncertain on progress stars | Skip progress indicators for now |

---

## 📊 NAVIGATION HIERARCHY

```
HOME (main landing page)
├── Text/intro content
└── 4 Subject Groups:
    ├── 🔢 Math
    │   ├── ❌ Addition Kingdom (disabled)
    │   ├── ❌ Subtraction Kingdom (disabled)
    │   ├── ✅ Multiplication Kingdom
    │   │   ├── 1× through 12× (12 cards)
    │   │   ├── Training Table
    │   │   ├── Conquest Game
    │   │   ├── Flashcard Challenge
    │   │   ├── Kingdom Maps
    │   │   └── Kingdom Siege
    │   └── ❌ Division Kingdom (disabled)
    │
    ├── 📖 Language Arts
    │   ├── ✅ Spelling
    │   │   ├── Vowels & Consonants
    │   │   ├── Common Words
    │   │   ├── Sight Words
    │   │   └── Advanced Words
    │   ├── ❌ Vocabulary (disabled)
    │   └── ❌ Grammar (disabled)
    │
    ├── 🧪 Lab (Experiments)
    │   └── ✅ Number Cruncher
    │       ├── Game Board
    │       ├── Results
    │       └── Training Table
    │
    └── 🎓 Science (Future placeholder)
        └── ❌ (all disabled)

CONSTANT SECTIONS:
├── 🏆 Achievements / Leaderboard
├── ⚙️ Settings
└── 👤 Profile / Account
```

---

## 🖥️ DESKTOP: TOP NAVBAR WITH DROPDOWNS (≥ 768px)

### NAVBAR STRUCTURE

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ 🏠 Learning Kingdom    Math ▼  Language Arts ▼  Lab ▼   ⭐ Achievements  👤  │
└─────────────────────────────────────────────────────────────────────────────┘

NAVBAR SECTIONS:
├─ Left (logo):      🏠 Learning Kingdom (clickable → HOME)
├─ Center (subjects): [Subject dropdowns - only shows ENABLED subjects]
│                    • Math ▼
│                    • Language Arts ▼
│                    • Lab ▼
├─ Right (quick):    ⭐ Achievements, ⚙️ Settings, 👤 Profile
└─ Context (below navbar): Breadcrumb trail
```

### BREADCRUMB TRAIL (New Feature)

```
Below navbar, left-aligned:
Home > Math > Multiplication Kingdom > Training Table

Shows:
- Current location path
- Each level clickable to navigate back
- Updates dynamically based on route
- Mobile: Collapses to "← Back" or abbreviated breadcrumb
```

### HOME PAGE WIREFRAME

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ 🏠 Learning Kingdom    Math ▼  Language Arts ▼  Lab ▼   ⭐ Achievements  👤  │
├─────────────────────────────────────────────────────────────────────────────┤
│ Home                                                                         │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│                                                                              │
│  Welcome to Learning Kingdom!                                              │
│  Choose a subject to get started.                                          │
│                                                                              │
│  ┌──────────────────────┐  ┌──────────────────────┐  ┌──────────────────────┐
│  │ 🔢 Math              │  │ 📖 Language Arts     │  │ 🧪 Lab               │
│  │                      │  │                      │  │                      │
│  │ ✅ Enabled           │  │ ✅ Enabled           │  │ ✅ Enabled           │
│  │                      │  │                      │  │                      │
│  │ • Multiplication     │  │ • Spelling           │  │ • Number Cruncher    │
│  │ • (3 more disabled)  │  │ • (2 more disabled)  │  │                      │
│  │                      │  │                      │  │                      │
│  │ [Explore →]          │  │ [Explore →]          │  │ [Explore →]          │
│  └──────────────────────┘  └──────────────────────┘  └──────────────────────┘
│
│  ┌──────────────────────┐
│  │ 🎓 Science (future)  │
│  │                      │
│  │ ⏳ Coming Soon       │
│  │                      │
│  │ Check back later!    │
│  │                      │
│  │ [Learn More →]       │
│  └──────────────────────┘
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### SUBJECT HOME PAGE WIREFRAME (e.g., Math Home)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ 🏠 Learning Kingdom    Math ▼  Language Arts ▼  Lab ▼   ⭐ Achievements  👤  │
├─────────────────────────────────────────────────────────────────────────────┤
│ Home > Math                                                  [← Back breadcrumb]
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│                                                                              │
│  🔢 Mathematics Kingdom                                                     │
│  Master the fundamentals of multiplication!                               │
│                                                                              │
│  ┌──────────────────────┐  ┌──────────────────────┐  ┌──────────────────────┐
│  │ ✅ Multiplication    │  │ ❌ Addition          │  │ ❌ Subtraction       │
│  │    Kingdom           │  │    Kingdom           │  │    Kingdom           │
│  │                      │  │                      │  │                      │
│  │ Enabled              │  │ (Disabled)           │  │ (Disabled)           │
│  │                      │  │ Coming Soon          │  │ Coming Soon          │
│  │ 12 times tables      │  │                      │  │                      │
│  │ + games              │  │ Unlock by mastering  │  │ Unlock by mastering  │
│  │                      │  │ Multiplication!      │  │ Multiplication!      │
│  │ [Enter →]            │  │ [?]                  │  │ [?]                  │
│  └──────────────────────┘  └──────────────────────┘  └──────────────────────┘
│
│  ┌──────────────────────┐
│  │ ❌ Division Kingdom  │
│  │                      │
│  │ (Disabled)           │
│  │ Coming Soon          │
│  │                      │
│  │ Unlock by mastering  │
│  │ Multiplication!      │
│  │                      │
│  │ [?]                  │
│  └──────────────────────┘
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### MATH DROPDOWN MENU

```
Click "Math ▼" in navbar:

┌────────────────────────────────────────┐
│ ✅ Multiplication Kingdom              │ ← Links to /subjects/math
│    [Shows current progress/stars]      │
│                                        │
│ ❌ Addition Kingdom (disabled)         │ ← Greyed out
│                                        │
│ ❌ Subtraction Kingdom (disabled)      │ ← Greyed out
│                                        │
│ ❌ Division Kingdom (disabled)         │ ← Greyed out
│                                        │
├────────────────────────────────────────┤
│ [Manage Math Settings ⚙️]              │ ← Optional quick link
└────────────────────────────────────────┘
```

### MATH KINGDOM HOME DROPDOWN (Nested Submenu - Optional)

```
Hover over "Multiplication Kingdom" in above dropdown:

┌─────────────────────────────┐
│ ✅ Multiplication Kingdom   │ ──► ┌──────────────────────────────┐
│    [Shows current progress] │    │ 1× Times Table               │
│                              │    │ 2× Times Table               │
└─────────────────────────────┘    │ 3× Times Table               │
                                   │ ...                          │
                                   │ 12× Times Table              │
                                   │                              │
                                   │ [View Training Table]        │
                                   │ [View Game List]             │
                                   └──────────────────────────────┘
```

---

## 📱 MOBILE: FULL-SCREEN HAMBURGER (< 768px)

### MOBILE HOME SCREEN

```
┌──────────────────────────────┐
│ ☰  Learning Kingdom       👤 │
├──────────────────────────────┤
│ Home                         │
├──────────────────────────────┤
│                              │
│  Welcome to Learning!        │
│  Choose a subject.           │
│                              │
│  ┌────────────────────────┐  │
│  │ 🔢 Math                │  │
│  │ [Explore →]            │  │
│  └────────────────────────┘  │
│                              │
│  ┌────────────────────────┐  │
│  │ 📖 Language Arts       │  │
│  │ [Explore →]            │  │
│  └────────────────────────┘  │
│                              │
│  ┌────────────────────────┐  │
│  │ 🧪 Lab                 │  │
│  │ [Explore →]            │  │
│  └────────────────────────┘  │
│                              │
│  ┌────────────────────────┐  │
│  │ 🎓 Science (Coming)    │  │
│  │ [Learn More →]         │  │
│  └────────────────────────┘  │
│                              │
└──────────────────────────────┘
```

### MOBILE HAMBURGER MENU (OPEN)

```
┌──────────────────────────────┐
│ 🧬 Learning Kingdom       ✕   │
├──────────────────────────────┤
│ 🏠 Home                      │
│                              │
│ 📚 Subjects                  │
│    🔢 Math ▼                 │  ← Expandable
│    📖 Language Arts ▼        │
│    🧪 Lab ▼                  │
│    🎓 Science ▼              │
│                              │
│ ⭐ Achievements              │
│ ⚙️ Settings                  │
│ ❓ Help                      │
├──────────────────────────────┤
│ 👤 [Username]                │
│ 🔓 Sign Out                  │
└──────────────────────────────┘
```

### MOBILE HAMBURGER - EXPANDED MATH

```
┌──────────────────────────────┐
│ 🧬 Learning Kingdom       ✕   │
├──────────────────────────────┤
│ 🏠 Home                      │
│                              │
│ 📚 Subjects                  │
│    🔢 Math ▼ (expanded)      │  ← Now shows sub-items
│       ✅ Multiplication      │
│       ❌ Addition            │     Indented, greyed if disabled
│       ❌ Subtraction         │
│       ❌ Division            │
│    📖 Language Arts ▼        │
│    🧪 Lab ▼                  │
│    🎓 Science ▼              │
│                              │
│ ⭐ Achievements              │
│ ⚙️ Settings                  │
│ ❓ Help                      │
├──────────────────────────────┤
│ 👤 [Username]                │
│ 🔓 Sign Out                  │
└──────────────────────────────┘
```

### MOBILE SUBJECT HOME (Math)

```
┌──────────────────────────────┐
│ ☰  Learning Kingdom       👤 │
├──────────────────────────────┤
│ Home > Math                  │  ← Breadcrumb (or "← Back")
├──────────────────────────────┤
│                              │
│  🔢 Math Kingdom             │
│  Master multiplication!      │
│                              │
│  ┌────────────────────────┐  │
│  │ ✅ Multiplication      │  │
│  │    Kingdom             │  │
│  │ [Enter →]              │  │
│  └────────────────────────┘  │
│                              │
│  ┌────────────────────────┐  │
│  │ ❌ Addition Kingdom    │  │
│  │ (Disabled)             │  │
│  │ [?]                    │  │
│  └────────────────────────┘  │
│                              │
│  ┌────────────────────────┐  │
│  │ ❌ Subtraction Kingdom │  │
│  │ (Disabled)             │  │
│  │ [?]                    │  │
│  └────────────────────────┘  │
│                              │
│  ┌────────────────────────┐  │
│  │ ❌ Division Kingdom    │  │
│  │ (Disabled)             │  │
│  │ [?]                    │  │
│  └────────────────────────┘  │
│                              │
└──────────────────────────────┘
```

---

## 🎮 GAMING MODE: PERSISTENT NAV

**Desktop (navbar visible at top):**
```
┌─────────────────────────────────────────────────────────────────────────────┐
│ 🏠 Learning Kingdom    Math ▼  Language Arts ▼  Lab ▼   ⭐ Achievements  👤  │
├─────────────────────────────────────────────────────────────────────────────┤
│ Home > Math > Multiplication Kingdom > 1× > Speed Challenge                 │
├─────────────────────────────────────────────────────────────────────────────┤
│                          ← Back to 1× Kingdom                               │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│                     SPEED CHALLENGE GAME                                    │
│                     (Full width available)                                 │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

**Mobile (navbar at top, game below):**
```
┌──────────────────────────────┐
│ ☰  Learning Kingdom       👤 │
├──────────────────────────────┤
│ Home > Math > Mult ×1 ...    │
├──────────────────────────────┤
│ ← Back to 1× Kingdom         │
├──────────────────────────────┤
│                              │
│    GAME (full width)         │
│                              │
└──────────────────────────────┘
```

---

## 🛠️ IMPLEMENTATION ROADMAP

### Phase 5 Sprint 5.3: Implement Responsive Navigation

**Files to create:**
1. `src/shared/components/ResponsiveNav.jsx` — Main navbar component
2. `src/shared/components/ResponsiveNav.css` — Navbar styles
3. `src/shared/components/Breadcrumb.jsx` — Breadcrumb navigation
4. `src/shared/components/Breadcrumb.css` — Breadcrumb styles
5. `src/shared/components/HamburgerMenu.jsx` — Mobile menu
6. `src/shared/components/HamburgerMenu.css` — Mobile menu styles
7. `src/shared/components/NavDropdown.jsx` — Dropdown menu (reusable)
8. `src/pages/Home.jsx` — New home page with subject cards
9. `src/pages/Home.css` — Home page styles
10. `src/pages/SubjectHome.jsx` — Subject-specific home (Math, Spelling, Lab)
11. `src/pages/SubjectHome.css` — Subject home styles

**Integration points:**
1. Wrap App.jsx content with ResponsiveNav
2. Pass `breadcrumbs` to ResponsiveNav via context or props
3. Hook nav dropdowns into React Router navigation
4. Create routes:
   - `/` → Home
   - `/subjects/math` → SubjectHome (Math)
   - `/subjects/spelling` → SubjectHome (Spelling)
   - `/subjects/lab` → SubjectHome (Lab)
   - `/subjects/math/multiplication-kingdom` → MulKingdomHome
   - `/subjects/math/multiplication-kingdom/1` → KingdomScreen (1×)
   - etc. (existing game routes)

**Styling roadmap:**
- Navbar: 56px height, white background, shadow
- Breadcrumb: 32px height, centered, smaller font
- Dropdown: smooth animation, z-index 1000
- Mobile menu: full screen, z-index 999
- Responsive: All components tested at 375px, 768px, 1024px, 1920px

---

## 📁 ROUTE HIERARCHY

```
/ → HOME
  ├── /subjects/math → SubjectHome (Math)
  │   ├── /subjects/math/multiplication-kingdom → MulKingdomHome (placeholder)
  │   │   ├── /subjects/math/multiplication-kingdom/1 → KingdomScreen (1×)
  │   │   │   ├── /kingdom/:id/flashcard
  │   │   │   ├── /kingdom/:id/speed
  │   │   │   ├── /kingdom/:id/match
  │   │   │   └── /kingdom/:id/siege
  │   │   ├── /subjects/math/multiplication-kingdom/2 → KingdomScreen (2×)
  │   │   └── ... (3-12)
  │   │
  │   ├── /subjects/math/multiplication-kingdom/training → TrainingTable
  │   └── /subjects/math/multiplication-kingdom/conquest → NumberCruncher
  │
  ├── /subjects/spelling → SubjectHome (Spelling)
  │   ├── /subjects/spelling/vowels → SpellingScreen
  │   ├── /subjects/spelling/common-words → SpellingScreen
  │   ├── /subjects/spelling/sight-words → SpellingScreen
  │   └── /subjects/spelling/advanced-words → SpellingScreen
  │
  ├── /subjects/lab → SubjectHome (Lab)
  │   ├── /subjects/lab/number-cruncher → NumberCruncher
  │   └── /subjects/lab/number-cruncher/training → TrainingTable
  │
  ├── /achievements → UnifiedLeaderboard
  ├── /settings → SettingsPage
  ├── /profile → ProfilePage
  └── ...existing game routes
```

---

## 🎨 COMPONENT COMPOSITION

### ResponsiveNav.jsx
```jsx
<ResponsiveNav>
  ├── Navbar (desktop)
  │   ├── Logo (Home link)
  │   ├── NavDropdown (Math ▼)
  │   ├── NavDropdown (Language Arts ▼)
  │   ├── NavDropdown (Lab ▼)
  │   └── Quick links (Achievements, Settings, Profile)
  │
  ├── HamburgerButton (mobile)
  │   └── HamburgerMenu
  │       ├── Menu items
  │       └── Expandable subjects
  │
  └── Breadcrumb
      └── Breadcrumb trail (Home > Math > Multiplication Kingdom)
```

### Home.jsx
```jsx
<Home>
  ├── Welcome text
  └── SubjectCard[] (Math, Language Arts, Lab, Science)
      └── Shows enabled/disabled status
          Shows icons + quick stats
          [Explore button]
```

### SubjectHome.jsx
```jsx
<SubjectHome subject="math">
  ├── Subject title (🔢 Math Kingdom)
  └── KingdomCard[] (Multiplication, Addition, Subtraction, Division)
      └── Shows enabled/disabled status
          [Enter] or [?] button
```

---

## ✨ KEY FEATURES

1. **Persistent Navbar:** Always visible on desktop, hamburger on mobile
2. **Breadcrumb Navigation:** Shows path → clickable to go back
3. **Hierarchical Structure:** Home → Subject → Kingdom → Game
4. **Disabled States:** Greyed-out kingdoms with lock icons + "Coming Soon"
5. **Progress Indicators:** (Optional) Stars or progress bars in nav
6. **Gaming Mode:** Nav stays visible to encourage context switching
7. **Responsive:** All components tested on mobile, tablet, desktop

---

**Ready to begin implementation! 🚀**


