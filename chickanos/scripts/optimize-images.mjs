// Creates .webp copies of every .jpg/.jpeg/.png in public/images (resized, compressed).
// Runs automatically before `npm run dev` and `npm run build`. Originals are never changed.
import sharp from "sharp";
import { readdir, stat } from "node:fs/promises";
import { join, extname } from "node:path";

const MAX = { hero: 2000, bg: 1600, logo: 900 }; // max width by file name; others 1200

async function walk(dir) {
  for (const e of await readdir(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    if (e.isDirectory()) { await walk(p); continue; }
    const ext = extname(p).toLowerCase();
    if (![".jpg", ".jpeg", ".png"].includes(ext)) continue;
    const out = p.slice(0, -ext.length) + ".webp";
    const src = await stat(p);
    const dst = await stat(out).catch(() => null);
    if (dst && dst.mtimeMs >= src.mtimeMs) continue;
    const name = e.name.slice(0, -ext.length);
    await sharp(p)
      .resize({ width: MAX[name] ?? 1200, withoutEnlargement: true })
      .webp({ quality: name === "logo" ? 90 : 80 })
      .toFile(out);
    console.log("optimised", out);
  }
}
await walk("public/images");
