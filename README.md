# Moonlit Mess

A quiet emotional space where you can leave what you're carrying — or find something soft left by someone else.

Nothing is stored. Nothing is social. Nothing builds identity.

## How to publish on GitHub Pages

1. Create a new GitHub repository named `moonlit-mess`
2. Upload all files into the repo root
3. Go to **Settings → Pages**
4. Under **Source**, select `main` branch and `/ (root)` folder
5. Click **Save**
6. Your site will be live at `https://yourusername.github.io/moonlit-mess`

## File structure

```
moonlit-mess/
├── index.html   — structure and all screens
├── style.css    — all visual styling
├── app.js       — navigation, flow, Claude API calls
├── lantern.js   — the release ritual animation
├── sky.js       — night sky, stars, shooting stars
├── music.js     — lo-fi ambient sound engine
└── README.md
```

## Note on the Claude API

The reflect question is generated live via the Anthropic API.
The API key is handled by the claude.ai environment during preview.
For your own deployment, you'll need to add your own Anthropic API key
or route calls through a small serverless function to keep it private.
