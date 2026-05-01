# Hospitalist Dx Planner

Evidence-based diagnosis and treatment planning tool for Hospitalist physicians.

## Features
- 9 built-in diagnoses with evidence-based evaluation and treatment plans
- Clinical criteria / supporting data entry per diagnosis
- Fully editable bullet points, sections, and section titles
- Create custom diagnoses from scratch
- Auto-saves to browser localStorage
- Copy-to-EMR output in dash-formatted plain text

## Local Development

```bash
npm install
npm start
```

Opens at http://localhost:3000

## Deploy to Netlify (via GitHub)

1. Push this repo to GitHub
2. Go to netlify.com → "Add new site" → "Import from Git"
3. Connect your GitHub repo
4. Build settings are auto-detected from netlify.toml:
   - Build command: `npm run build`
   - Publish directory: `build`
5. Click Deploy

Any future `git push` to main will auto-redeploy.

## Editing the App

All diagnosis data and UI logic lives in `src/App.jsx`.

To add a new built-in diagnosis, add an entry to the `DEFAULT_DIAGNOSES` array at the top of `src/App.jsx` following the existing pattern.
