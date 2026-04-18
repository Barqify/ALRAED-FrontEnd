import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const htmlPath = path.join(root, "Almasa Crops_Website_Code.html");
const html = fs.readFileSync(htmlPath, "utf8");

/** Extract JS object/array literal starting at start index (must be `{` or `[`). */
function extractBalancedLiteral(source, start) {
  const pairs = { "{": "}", "[": "]", "(": ")" };
  const closers = new Set(["}", "]", ")"]);
  const openCh = source[start];
  if (!pairs[openCh]) {
    throw new Error(`Expected opener at ${start}, got ${openCh}`);
  }
  const stack = [pairs[openCh]];
  let i = start + 1;
  let inString = false;
  let quote = null;
  let escaped = false;

  while (i < source.length) {
    const c = source[i];

    if (inString) {
      if (escaped) {
        escaped = false;
        i++;
        continue;
      }
      if (c === "\\") {
        escaped = true;
        i++;
        continue;
      }
      if (c === quote) {
        inString = false;
        quote = null;
      }
      i++;
      continue;
    }

    if (c === '"' || c === "'" || c === "`") {
      inString = true;
      quote = c;
      i++;
      continue;
    }

    if (c === "/" && source[i + 1] === "/") {
      i += 2;
      while (i < source.length && source[i] !== "\n") i++;
      continue;
    }
    if (c === "/" && source[i + 1] === "*") {
      i += 2;
      while (i < source.length && !(source[i] === "*" && source[i + 1] === "/")) i++;
      i += 2;
      continue;
    }

    if (pairs[c]) {
      stack.push(pairs[c]);
      i++;
      continue;
    }

    if (closers.has(c)) {
      const expected = stack.pop();
      if (c !== expected) {
        throw new Error(`Mismatch at ${i}: expected ${expected}, got ${c}`);
      }
      i++;
      if (stack.length === 0) {
        return source.slice(start, i);
      }
      continue;
    }

    i++;
  }

  throw new Error("Unbalanced brackets");
}

function extractVarLiteral(name) {
  const pat = `var ${name} = `;
  const idx = html.indexOf(pat);
  if (idx === -1) throw new Error(`var ${name} not found`);
  let pos = idx + pat.length;
  while (/\s/.test(html[pos])) pos++;
  const lit = extractBalancedLiteral(html, pos);
  return lit;
}

function evalLiteral(name) {
  const lit = extractVarLiteral(name);
  return Function(`"use strict"; return (${lit})`)();
}

const LOGO = evalLiteral("LOGO_CONFIG");
const T = evalLiteral("T");
const CATS = evalLiteral("CATS");
const PRODS = evalLiteral("PRODS");
const NEWS = evalLiteral("NEWS");
const VIDEOS = evalLiteral("VIDEOS");
const COMPANY_IMGS = evalLiteral("COMPANY_IMGS");
const TEAM = evalLiteral("TEAM");
const CERTS = evalLiteral("CERTS");

const dataDir = path.join(root, "src", "data");
fs.mkdirSync(path.join(dataDir, "translations"), { recursive: true });

fs.writeFileSync(path.join(dataDir, "logo.json"), JSON.stringify(LOGO, null, 2));
fs.writeFileSync(
  path.join(dataDir, "translations", "ar.json"),
  JSON.stringify(T.ar, null, 2)
);
fs.writeFileSync(
  path.join(dataDir, "translations", "en.json"),
  JSON.stringify(T.en, null, 2)
);
fs.writeFileSync(
  path.join(dataDir, "translations", "fr.json"),
  JSON.stringify(T.fr, null, 2)
);
fs.writeFileSync(path.join(dataDir, "categories.json"), JSON.stringify(CATS, null, 2));
fs.writeFileSync(path.join(dataDir, "products.json"), JSON.stringify(PRODS, null, 2));
fs.writeFileSync(path.join(dataDir, "news.json"), JSON.stringify(NEWS, null, 2));
fs.writeFileSync(path.join(dataDir, "videos.json"), JSON.stringify(VIDEOS, null, 2));
fs.writeFileSync(path.join(dataDir, "gallery.json"), JSON.stringify(COMPANY_IMGS, null, 2));
fs.writeFileSync(path.join(dataDir, "team.json"), JSON.stringify(TEAM, null, 2));
fs.writeFileSync(path.join(dataDir, "certs.json"), JSON.stringify(CERTS, null, 2));

console.log("Extracted JSON files to src/data/");
