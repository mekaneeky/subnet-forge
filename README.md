# Subnet Forge Landing Page

Static landing page for Subnet Forge, hosted at Network School.

## Files

- `public/index.html`: page structure and copy
- `public/styles.css`: visual style and responsive layout
- `public/script.js`: FAQ accordion + form validation
- `worker.js`: Cloudflare Worker entrypoint for static asset serving
- `wrangler.toml`: Wrangler config (`subnet-forge` + `public/` assets)

## Local preview

Use any static server from `public/`. Example:

```powershell
python -m http.server 8080 --directory public
```

Then open `http://localhost:8080`.

## Cloudflare deploy

```powershell
cmd /c npx wrangler deploy
```

If PowerShell blocks `npx` scripts on your machine, use `cmd /c` as shown above.

## Important edits

- Form destination email: `public/index.html` `form` `action` attribute
- FAQ content: `public/index.html` under `#faq`
- Schedule content: `public/index.html` under `#schedule`
- Brand and partner names: `public/index.html`
