# DMU Hackers Website

Static website for DMU Hackers and Pwn2Play.

Most recurring content is maintained in `data/site-content.js`. Update that file first, then rebuild the generated event artifacts and run the checks before deployment.

## Annual Renewal Checklist

Use this when a new committee takes over or a new Pwn2Play event is announced.

### 1. Update Committee Details

Edit `data/site-content.js`.

Update:

- `committee.currentYear`
- `committee.currentTag`
- `committee.currentMembers`
- `committee.timeline`

Current committee cards on `index.html` and the full committee history on `committee.html` are rendered from this data.

For each current member, keep this shape:

```js
{
  name: "First name",
  fullName: "Full Name",
  role: "Role Title",
  icon: "fas fa-user-secret",
  linkedin: "https://www.linkedin.com/in/example/"
}
```

`linkedin` is optional. If it is missing, the site renders the member without a LinkedIn link.

### 2. Update Pwn2Play Event Details

Edit the `p2p` object in `data/site-content.js`.

Update:

- `p2p.event.name`
- `p2p.event.start`
- `p2p.event.end`
- `p2p.lastUpdated`
- `p2p.categories`
- `p2p.difficultyBreakdown`
- `p2p.pulse`
- `p2p.prizes`
- `p2p.rules`
- `p2p.schedule`
- `p2p.venues`
- `p2p.scoreboardTracks`
- `p2p.sponsorCta`
- `p2p.links`

Dates should use ISO timestamps with the UK offset, for example:

```js
start: "2026-05-30T09:00:00+01:00",
end: "2026-05-30T18:00:00+01:00"
```

The Pwn2Play page, registration guide, map page, calendar links, structured data, rules, prizes, scoreboards, and sponsor callout all read from this data.

### 3. Add The New Luma Embed

Create the new event in Luma, then copy the embed URL for the event page. It should look similar to:

```txt
https://luma.com/embed/event/evt-example/simple
```

Update:

```js
p2p: {
  links: {
    luma: "https://luma.com/embed/event/evt-example/simple"
  }
}
```

The site will update the Pwn2Play iframe and calendar links from this value at runtime.

Luma iframe internals cannot be styled from this site because the embed is hosted by Luma. To match the site better, set the event theme and colour inside Luma itself. The site only styles the surrounding frame.

### 4. Update Sponsors And Resources

Sponsors are managed in `data/site-content.js` under `sponsors`.

Resources are managed in `data/site-content.js` under `resources`.

Sponsor logos should be placed under `img/branding/...` and referenced with a relative path, for example:

```js
logo: "img/branding/SponsorName/logo.png"
```

Always include meaningful `alt` text for sponsor logos.

### 5. Rebuild Generated Event Artifacts

After changing event details, run:

```powershell
node scripts/build-static-content.js
```

This updates:

- `data/p2p-core-incursion.ics`
- the Pwn2Play JSON-LD event schema in `P2P.html`

No npm install is required for the current maintenance scripts.

### 6. Run Pre-Deployment Checks

Run:

```powershell
node --check data/site-content.js
node --check js/main.js
Get-ChildItem -Path scripts -Filter *.js | ForEach-Object { node --check $_.FullName }
node scripts/build-static-content.js
node scripts/check-site.js
node scripts/check-render.js
git diff --check
```

`scripts/check-render.js` launches Chrome through Playwright and checks desktop/mobile rendering, overflow, light-mode surfaces, and the mobile scroll fade regression.

### 7. Manual Pre-Deploy Pass

Before publishing, manually check:

- `index.html`
- `P2P.html`
- `register.html`
- `sponsors.html`
- `resources.html`

Check both dark and light mode. On mobile, scroll through the whole page and confirm content does not fade out while still on screen.

## Content Ownership

Prefer editing `data/site-content.js` for recurring content. Only edit HTML directly for structural changes, new sections, or fallback copy that must exist before JavaScript runs.

## Deployment Notes

This is a static site. Deploy the repository contents as-is after the checks pass.

Known maintenance item: optimise large images before major public launches when possible.
