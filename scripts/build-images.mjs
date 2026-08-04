/* ------------------------------------------------------------------ *
 *  Rebuild the portfolio's web assets from the source artwork.
 *
 *      npm run images          rebuild only what is out of date
 *      npm run images -- --force   rebuild everything
 *
 *  WHY THIS EXISTS. The site never loads the files in Portfolio/. Those
 *  are 2-11MB masters; the pages read the derived WebPs in showcase/,
 *  which are ~95% smaller. That means replacing a master changes nothing
 *  on the page until these are rebuilt — and the failure is silent, since
 *  the old picture keeps rendering perfectly. That caught us three times
 *  in an afternoon before this script existed.
 *
 *  THE MAP IS EXPLICIT ON PURPOSE. Deriving a slug from a filename would
 *  silently skip a file the day someone renames one — which already
 *  happened once (Monty_Poster_1.1.jpg -> Gigglebellies.jpg). An unknown
 *  or missing file is reported loudly instead.
 *
 *  `sharp` comes from Next's own dependency tree rather than being
 *  installed for this; if a Next upgrade ever drops it, add it as a
 *  devDependency.
 * ------------------------------------------------------------------ */

import sharp from "sharp";
import { readdir, stat, mkdir } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const SRC = path.join(ROOT, "public/assets/projects/Portfolio");
const CARD_SRC = path.join(SRC, "Dashboard");
const LOGO_SRC = path.join(SRC, "Logos");
const OUT = path.join(ROOT, "public/assets/projects/showcase");

/* TWO SETS OF THE SAME SEVEN SHOWS, and they are not interchangeable.
   Portfolio/ holds wide establishing shots — room around the cast, which
   is what a full-bleed band on /work wants. Dashboard/ holds tighter
   framings, which is what survives being drawn 300px wide in the
   homepage grid. Same slug, different crop, different destination:
   `<slug>-*.webp` for /work and `<slug>-card-*.webp` for the homepage. */

/* source filename -> slug used by data/constants.ts */
const ART = {
  "Monal-Kids.png": "monal-kids",
  "Wands-And-Wings.jpg": "wands-and-wings",
  "Zappy-Toons.png": "zappy-toons",
  "Zappy-Zoo.png": "zappy-zoo",
  "Wand-And-Wings-Jr.png": "wands-and-wings-jr",
  "Groovy-Martian.png": "groovy-the-martian",
  "Gigglebellies.jpg": "gigglebellies",
};

const LOGOS = {
  "Monal-Kids-Logo.png": "monal-kids",
  "Zappy-Zoo-Logo.png": "zappy-zoo",
  "GiggleBellies-Logo.png": "gigglebellies",
  "Wand-And-Wings-Logo.png": "wands-and-wings",
  "Wands-And-Wings-Jr-Logo.png": "wands-and-wings-jr",
  "Zappy-Toons-Logo.png": "zappy-toons",
  "Groovy-Martian-Logo.png": "groovy-the-martian",
};

/* Key art ships at two widths behind a srcset, so a quarter-width card in
   the four-across row does not download the file the feature uses. */
const WIDTHS = [1600, 800];
/* Logos are fitted into a box rather than given a width: the set spans
   1.2:1 to 3.2:1, and sizing by width alone would make the wide wordmark
   several times the visual weight of the square one. */
const LOGO_BOX = { width: 520, height: 320 };

const force = process.argv.includes("--force");
const mtime = async (p) => (existsSync(p) ? (await stat(p)).mtimeMs : 0);
const kb = (n) => `${(n / 1024).toFixed(0)}kB`;

let built = 0;
let skipped = 0;
const problems = [];

async function buildArt(file, slug, { dir = SRC, suffix = "" } = {}) {
  const src = path.join(dir, file);
  const outs = WIDTHS.map((w) => path.join(OUT, `${slug}${suffix}-${w}.webp`));
  const srcTime = await mtime(src);
  const oldest = Math.min(...(await Promise.all(outs.map(mtime))));

  if (!force && oldest > srcTime) {
    skipped++;
    return;
  }

  const meta = await sharp(src).metadata();
  const ratio = meta.width / meta.height;
  /* Every card and band on the site is 16:9. A source that is not tells
     us before it silently gets letterboxed or cropped on the page. */
  if (Math.abs(ratio - 16 / 9) > 0.02) {
    problems.push(`${file} is ${meta.width}x${meta.height} (${ratio.toFixed(2)}:1), not 16:9`);
  }

  for (const [i, w] of WIDTHS.entries()) {
    await sharp(src)
      .resize(w, Math.round((w * 9) / 16), { fit: "cover" })
      .webp({ quality: 82, effort: 6 })
      .toFile(outs[i]);
  }
  const sizes = await Promise.all(outs.map(async (o) => (await stat(o)).size));
  const label = suffix ? "card" : "art";
  console.log(`  ${label.padEnd(5)} ${slug.padEnd(20)} ${meta.width}x${meta.height} -> ${sizes.map(kb).join(" + ")}`);
  built++;
}

async function buildLogo(file, slug) {
  const src = path.join(LOGO_SRC, file);
  const out = path.join(OUT, `${slug}-logo.webp`);
  if (!force && (await mtime(out)) > (await mtime(src))) {
    skipped++;
    return;
  }

  /* Trim on a THRESHOLD, not on pure transparency. Zappy Zoo's master
     carries near-invisible stray pixels at the canvas corners, so an
     exact trim left it padded to the full 16:9 frame and it rendered a
     third the size of the others. */
  const buf = await sharp(src).trim({ threshold: 12 }).toBuffer();
  await sharp(buf)
    .resize({ ...LOGO_BOX, fit: "inside", withoutEnlargement: true })
    .webp({ quality: 88, effort: 6 })
    .toFile(out);

  const m = await sharp(out).metadata();
  console.log(`  logo  ${slug.padEnd(20)} -> ${m.width}x${m.height}  ${kb((await stat(out)).size)}`);
  built++;
}

async function run() {
  await mkdir(OUT, { recursive: true });

  console.log(`\nRebuilding portfolio images${force ? " (forced)" : ""}\n`);

  for (const [file, slug] of Object.entries(ART)) {
    if (!existsSync(path.join(SRC, file))) {
      problems.push(`missing source: Portfolio/${file} (expected for "${slug}")`);
      continue;
    }
    await buildArt(file, slug);
  }

  /* The homepage set. Same slugs, same filenames, different folder — so
     one map serves both and a show can never end up with a card from one
     series and a band from another. */
  for (const [file, slug] of Object.entries(ART)) {
    if (!existsSync(path.join(CARD_SRC, file))) {
      problems.push(`missing card art: Portfolio/Dashboard/${file} (expected for "${slug}")`);
      continue;
    }
    await buildArt(file, slug, { dir: CARD_SRC, suffix: "-card" });
  }

  for (const [file, slug] of Object.entries(LOGOS)) {
    if (!existsSync(path.join(LOGO_SRC, file))) {
      problems.push(`missing logo: Portfolio/Logos/${file} (expected for "${slug}")`);
      continue;
    }
    await buildLogo(file, slug);
  }

  /* Anything in the folder this script does not know about. A renamed
     master would otherwise just stop being rebuilt, silently. */
  const known = new Set(Object.keys(ART));
  for (const f of await readdir(SRC)) {
    if (f === "Logos" || f === "Dashboard" || f.startsWith(".") || known.has(f)) continue;
    /* `*2.png` is the convention for the superseded master kept beside
       its replacement, so those are expected and not worth reporting. */
    if (/\d\.(png|jpe?g|webp)$/i.test(f)) continue;
    problems.push(`unmapped file: Portfolio/${f} — add it to ART in this script`);
  }

  console.log(`\n${built} rebuilt, ${skipped} already current`);
  if (problems.length) {
    console.log("\nAttention:");
    for (const p of problems) console.log(`  - ${p}`);
  }
  console.log();
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
