# darsot.ca

My portfolio, built as an interactive terminal. Type `help`.

Live at **[darsot.ca](https://darsot.ca)**.

## Running it

```bash
npm install
npm run dev
```

## Layout

```
app/
  data/profile.ts       every piece of content on the site
  lib/terminal.ts       the command layer — parsing, output, tab-completion
  components/
    Landing.tsx         ASCII name reveal, the entry screen
    Terminal.tsx        the terminal UI and rendering
  layout.tsx            metadata, JSON-LD, server-rendered content for crawlers
  page.tsx              landing ↔ terminal, theme persistence
  opengraph-image.tsx   link-preview card, generated at build time
scripts/
  sync.mjs              regenerates profile.ts from my resume + GitHub
```

## Notes

**Content lives in exactly one file.** `app/data/profile.ts` is the single source
of truth — the terminal, the page metadata, the structured data and the
crawler-visible block all read from it. Nothing is hardcoded in a component.

**Output is typed, not guessed.** An earlier version inferred styling from string
contents (does the line contain `=`, does it start with an emoji), which made
colours unpredictable. Commands now return `Line` values that declare what they
are — `head`, `bullet`, `kv`, `link`, `tags` — and the renderer maps each to a
style.

**Themes are CSS variables.** `phosphor`, `amber`, `ice` and `paper` (light) each
define the same set of custom properties, so `theme <name>` reskins everything at
once. The choice persists in `localStorage` and is stamped onto `<html>` by an
inline script before first paint, so there's no flash of the wrong theme.

**The terminal renders client-side**, so `layout.tsx` also emits a visually-hidden
copy of the same content. Without it a crawler saw about a dozen words, since the
name on the landing page is box-drawing glyphs rather than letters.

**`npm run sync`** reads my resume PDF and the GitHub API, asks Claude to merge
them with what's already on the site, and rewrites `profile.ts` — but only the
region between the `SYNC:START` and `SYNC:END` markers. Anything below `SYNC:END`
is hand-written and never touched. It writes to a temp file and renames, so an
interrupted run can't leave the file truncated.

```bash
npm run sync         # dry run — writes profile.synced.ts to diff
npm run sync:write   # apply
```

## Stack

Next.js 15, TypeScript, Tailwind. No UI library — the terminal is hand-rolled.
