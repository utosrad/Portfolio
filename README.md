# Portfolio

My personal site, built as a Mac terminal you actually type into.

**Live: [darsot.ca](https://darsot.ca)**

<!-- SCREENSHOT: replace this comment with a screenshot of the terminal after
     running `help`, saved as docs/screenshot.png, then use:
     ![Terminal portfolio](docs/screenshot.png)
     A short GIF of the landing-page ASCII animation would work even better. -->

_Screenshot to be added._

## Quickstart

```bash
git clone https://github.com/utosrad/Portfolio.git && cd Portfolio
npm install
npm run dev
```

Open http://localhost:3000. Click through the landing animation, then type `help`.

## What you can type

`help`, `about`, `experience`, `education`, `skills`, `projects`, `contact`, `languages`, `hobbies`, `philosophy`, `resume`, `history`, `clear`, and `starwars`.

Real shell verbs work too: `ls`, `cd`, `pwd`, `whoami`, `cat README.md`, `open <url>`. Content lives in one typed object at the top of `app/page.tsx`, so the terminal and the resume never drift apart.

## Technically interesting bits

**The landing page.** `app/components/LandingPage.tsx` renders "UMAR DARSOT" as hand-built block ASCII art, then runs it through five staged animation phases: typewriter, shine, glow, pulse, wave. Each letter has its own keyframe entry. It also builds a Web Audio `AudioContext` to synthesize typing sounds rather than shipping audio files.

**The ASCII shader component.** `app/components/ASCIIText.tsx` is a Three.js pipeline that draws text to a canvas, uses it as a `sampler2D` texture on a plane with a vertex shader that applies sine and cosine wave displacement and a fragment shader that samples R, G, and B at slightly different offsets for chromatic aberration. Each frame it reads the WebGL output back through `getImageData`, converts every pixel to luminance with `0.3r + 0.6g + 0.1b`, maps that to an index in a 67-character density ramp running from space to `$`, and writes the result into a `<pre>` with `mix-blend-mode: difference`. Mouse position drives a `hue-rotate` filter.

Two honest caveats on that component: it is adapted from [a CodePen by Juan Fuentes](https://codepen.io/JuanFuentes/pen/eYEeoyE), credited at the top of the file, and it is not currently imported by any page. It ships in the repo but the live site does not render it.

**Stack.** Next.js 15 App Router, React 18, TypeScript, Tailwind, Three.js. No backend. Deployed on Vercel.

## Layout

```
app/
  page.tsx                 terminal state, command dispatch, resume data (939 lines)
  layout.tsx               metadata and an inline SVG favicon (a data: URI, no image file)
  globals.css
  components/
    LandingPage.tsx        block ASCII intro, staged animations, Web Audio typing sounds
    ASCIIText.tsx          Three.js text to ASCII filter (not currently mounted)
    StarWars.tsx           the `starwars` easter egg
```

## License

MIT. See [LICENSE](LICENSE).
