---
description: "Regenerate README.md with all sections from project structure and codebase"
argument-hint: "Focus area (all, features, setup, architecture, or specific section)"
agent: "agent"
---

# README.md Regeneration

Analyze the project structure and current codebase to regenerate a comprehensive README.md that includes all sections:

## Required Sections

1. **Project Title & Tagline** — Hook the reader with what the app does
2. **Features** — All game modes and features with icons/emojis
3. **Tech Stack** — Dependencies and frameworks
4. **Prerequisites** — Environment requirements for development
5. **Getting Started** — Installation, dev server, build commands
6. **Architecture** — Folder structure, routing, key conventions
7. **Configuration** — Firebase setup, environment variables, important files
8. **Deployment** — Build & deploy steps for web and Android
9. **Contributing** — Guidelines for contributions (if applicable)
10. **Troubleshooting** — Common issues and solutions (if known)
11. **License** — Link to LICENSE file

## Guidelines

- Use **Markdown emojis** to enhance visual hierarchy (✅, 🎮, 🛠, 📋, 🚀, etc.)
- Keep feature descriptions **clear and benefits-focused**
- Code blocks should be **properly formatted** with language identifiers
- Preserve **project-specific terminology** (e.g., kingdom, conquest, siege)
- Include **links to key files** when referencing internal structure
- Make **setup instructions OS-agnostic** where possible
- Add **warnings or notes** for critical steps (e.g., Firebase config)

## Output Format

Return the complete, ready-to-use README.md content. Ensure it's comprehensive yet scannable with proper heading hierarchy and whitespace.
