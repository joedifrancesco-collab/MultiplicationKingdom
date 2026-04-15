# Learning Kingdom — Navigation Design Spec

**Purpose:** Plan desktop and mobile navigation before implementing Phase 5.  
**Date:** April 15, 2026  
**Status:** 🚧 DRAFT — Awaiting design feedback

---

## 📐 Design Objectives

1. **Discoverability:** Users can find games, subjects, and leaderboard quickly
2. **Simplicity:** Minimal cognitive load, intuitive hierarchy
3. **Scalability:** Easy to add new subjects (Math, Language Arts, Science, etc.)
4. **Responsive:** Graceful adaptation from mobile → tablet → desktop
5. **Accessibility:** Keyboard navigation, focus states, semantic HTML

---

## 🖥️ DESKTOP NAVIGATION (≥ 1024px)

### Option 1: Left Sidebar Nav 🎯 (RECOMMENDED)

```
┌────────────────────────────────────────────────────┐
│ 🧬 Learning Kingdom                   🔔 👤 ⚙️    │
├─────────────┬──────────────────────────────────────┤
│ 📚 Subjects │  Content Area                        │
├─────────────┤                                      │
│ 🔢 Math     │  Kingdom Selection / Game Selection  │
│   ├ 1×      │  ▼                                   │
│   ├ 2×      │  [Game Cards appear here]           │
│   ├ 3×      │                                      │
│   └ ...     │                                      │
│             │                                      │
│ 📖 Spelling │                                      │
│   ├ Group A │                                      │
│   ├ Group B │                                      │
│   └ ...     │                                      │
│             │                                      │
│ 🎓 Science  │                                      │
│   ├ Unit 1  │                                      │
│   └ ...     │                                      │
├─────────────┤                                      │
│ 🏆 Leader   │                                      │
│ ⚙️ Settings │                                      │
│ ❓ Help     │                                      │
└─────────────┴──────────────────────────────────────┘
```

**Pros:**
- Always visible (no clicks needed to see menu)
- Can show nested categories (Math → 1×, 2×, 3× times tables)
- Familiar pattern (Figma, VS Code, Slack)
- Easy to highlight current subject/game

**Cons:**
- Takes up 200-300px of horizontal space
- May feel cramped on smaller desktops (< 1440px)

---

### Option 2: Top Navbar with Dropdowns

```
┌──────────────────────────────────────────────────────────┐
│ 🧬 Learning Kingdom   [🔢 Math ▼] [📖 Spelling ▼]  🏆   │
├──────────────────────────────────────────────────────────┤
│                                                          │
│  Content Area (Kingdom Selection / Game Selection)      │
│  [Game Cards appear here]                              │
│                                                          │
│                                                          │
└──────────────────────────────────────────────────────────┘

On "Math ▼" click, dropdown shows:
┌─────────────────────┐
│ 1× Times Table      │
│ 2× Times Table      │
│ 3× Times Table      │
│ ...                 │
└─────────────────────┘
```

**Pros:**
- Saves horizontal space
- Clean, minimalist look
- All content focused in center

**Cons:**
- Requires clicks to see submenu
- Harder to show current location visually
- Dropdown can feel unstable (closes on misclick)

---

## 📱 MOBILE NAVIGATION (< 768px)

### Option 1: Hamburger Menu + Bottom Tab Bar (RECOMMENDED)

```
PORTRAIT:
┌──────────────────────┐
│ ☰  Learning Kingdom  │ ← Hamburger (tap to open sidebar)
├──────────────────────┤
│                      │
│  Content Area        │
│  (Game Selection or  │
│   During Gameplay)   │
│                      │
├──────────────────────┤
│ 🏠 📚 🏆 ⚙️          │ ← Bottom tab bar (always visible)
│ Home Subjects Board Settings
└──────────────────────┘

HAMBURGER OPEN (slides from left):
┌─────────────────────────┐
│ 🧬 Learning Kingdom  ✕  │
├─────────────────────────┤
│ 🏠 Home                 │
│ 📚 Subjects:            │
│   🔢 Math               │
│   📖 Spelling           │
│   🎓 Science (future)   │
│ 🏆 Leaderboard          │
│ ⚙️ Settings             │
│ ❓ Help                 │
├─────────────────────────┤
│ 👤 [username]           │
│ 🔓 Sign Out             │
└─────────────────────────┘
```

**Pros:**
- Bottom tab bar: always visible, thumb-friendly (mobile UX best practice)
- Hamburger: reveals full nav without taking screen space
- Familiar pattern (Gmail, Twitter, Instagram, Discord)
- 4 main destinations in tabs + more in menu

**Cons:**
- Bottom bar takes ~60px of vertical space
- Hamburger adds extra tap to see subjects

---

### Option 2: Full-Screen Hamburger Menu (Simpler)

```
CLOSED:
┌──────────────────────┐
│ ☰                    │
├──────────────────────┤
│  Content Area        │
│                      │
└──────────────────────┘

OPEN (full screen overlay):
┌──────────────────────┐
│ Learning Kingdom  ✕  │
├──────────────────────┤
│ 🏠 Home              │
│ 📚 Subjects:         │
│   🔢 Math            │
│   📖 Spelling        │
│   🎓 Science         │
│ 🏆 Leaderboard       │
│ ⚙️ Settings          │
│ ❓ Help              │
│                      │
│ 👤 [username]        │
│ 🔓 Sign Out          │
└──────────────────────┘
```

**Pros:**
- Simple, no bottom bar clutter
- Similar to Facebook, YouTube mobile

**Cons:**
- No "quick access" to common destinations (leaderboard)
- Always requires hamburger click
- Less thumb-friendly

---

## 🎮 GAMING CONTEXT

**During gameplay (in a game):**

Option A: Minimal nav (focused on game)
```
┌──────────────────────────┐
│ ← Back to Kingdom  [⏸]   │
├──────────────────────────┤
│                          │
│  GAME (fullscreen focus) │
│                          │
└──────────────────────────┘
```

Option B: Nav still visible (sidebar on desktop, hamburger on mobile)
```
Desktop: Sidebar still visible on left
Mobile: Hamburger icon visible at top (smaller)
```

Which approach?

---

## 📋 PROPOSED DECISIONS

### Desktop: **Option 1 (Sidebar Navigation)**
- Permanently visible 200-250px sidebar
- Collapsible on small desktops (< 1200px)
- Shows subjects + quick links
- Current subject/game highlighted

### Mobile: **Option 1 (Hamburger + Bottom Tab Bar)**
- 4 main tabs: Home, Subjects, Leaderboard, Settings
- Hamburger reveals full menu + subject nesting
- Gaming mode: minimal nav (back button only)

### Responsive Breakpoint: 768px (existing)
- Desktop mode ≥ 768px: Sidebar visible
- Mobile mode < 768px: Hamburger + tabs

---

## 🔑 Key Design Questions

**Please provide feedback on the following:**

1. **Desktop Sidebar:**
   - ✅ Prefer sidebar, OR
   - ❌ Prefer top navbar dropdowns, OR
   - ❓ Hybrid (sidebar collapses to icon bar on smaller desktop)?

2. **Mobile Navigation:**
   - ✅ Prefer hamburger + bottom tabs, OR
   - ❌ Prefer full-screen hamburger only, OR
   - ❓ Different approach?

3. **Gaming Mode:**
   - ✅ Minimal nav (back button + pause) — focus on game, OR
   - ❌ Keep nav visible — let user switch contexts easily?

4. **Subject Nesting:**
   - Should "Multiplication Kingdom" show all 12 times tables as sub-items, OR just as a card/tile when clicked?
   - Should "Spelling" show all word groups as sub-items, OR as cards when in Spelling screen?

5. **Quick Access:**
   - Any shortcuts we should add? (Recent games, favorite games, recent leaderboard results?)

6. **Color/Styling:**
   - Sidebar background: light (#f8f9fa), vs. dark (#2d3748), vs. accent color?
   - Should nav items show game progress indicators (stars ⭐)?

---

## 📐 Next Steps (Once Approved)

1. Create responsive nav component: `ResponsiveNav.jsx`
2. Implement desktop sidebar
3. Implement mobile hamburger + tab bar
4. Update App.jsx routes to use ResponsiveNav wrapper
5. Test across viewports
6. Commit Phase 5 Sprint 5.1, 5.2, 5.3

---

## 🎨 Design References

- **Desktop sidebar:** VS Code, Figma, Slack
- **Mobile bottom nav:** Gmail, Instagram, Twitter, Discord
- **Responsive patterns:** Material Design, Ant Design

---

**Questions? Thoughts? Ready to proceed once we align on these design decisions! 🚀**
