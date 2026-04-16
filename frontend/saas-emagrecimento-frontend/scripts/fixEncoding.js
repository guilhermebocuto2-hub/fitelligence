// Fix mojibake (double/triple UTF-8 encoding) in Portuguese JSX/JS source files.
// Run from the frontend root: node scripts/fixEncoding.js
const fs = require("fs");
const path = require("path");

// ── Target source files (build artifacts excluded) ──────────────────────────
const ROOT = path.join(__dirname, "..");
const SOURCE_DIRS = ["app", "src"];

function walk(dir) {
  let files = [];
  for (const f of fs.readdirSync(dir, { withFileTypes: true })) {
    if (["node_modules", ".next", ".git", "out", "android", "ios"].includes(f.name)) continue;
    const full = path.join(dir, f.name);
    if (f.isDirectory()) files = files.concat(walk(full));
    else if (f.name.endsWith(".jsx") || f.name.endsWith(".js")) files.push(full);
  }
  return files;
}

// ── Replacement map ──────────────────────────────────────────────────────────
// Order matters: deeper encoding must come before shallower.
// Quintuple prefix (17 chars): \u00c3\u0192\u00c6\u2019\u00c3\u2020\u00e2\u20ac\u2122\u00c3\u0192\u00e2\u20ac\u0161\u00c3\u201a\u00c2
// Quadruple prefix  (7 chars): \u00c3\u0192\u00c6\u2019\u00c3\u201a\u00c2
// Triple prefix     (3 chars): \u00c3\u0192\u00c2
// Double prefix     (1 char):  \u00c3
const Q5 = "\u00c3\u0192\u00c6\u2019\u00c3\u2020\u00e2\u20ac\u2122\u00c3\u0192\u00e2\u20ac\u0161\u00c3\u201a\u00c2";
const Q4 = "\u00c3\u0192\u00c6\u2019\u00c3\u201a\u00c2";

const FIXES = [
  // ── Quintuple-encoded (18 chars → 1 char) ────────────────────────────────
  [Q5 + "\u00a0", "\u00e0"], // à
  [Q5 + "\u00a1", "\u00e1"], // á
  [Q5 + "\u00a2", "\u00e2"], // â
  [Q5 + "\u00a3", "\u00e3"], // ã
  [Q5 + "\u00a7", "\u00e7"], // ç
  [Q5 + "\u00a9", "\u00e9"], // é
  [Q5 + "\u00aa", "\u00ea"], // ê
  [Q5 + "\u00ad", "\u00ed"], // í
  [Q5 + "\u00b3", "\u00f3"], // ó
  [Q5 + "\u00b4", "\u00f4"], // ô
  [Q5 + "\u00b5", "\u00f5"], // õ
  [Q5 + "\u00ba", "\u00fa"], // ú
  // Uppercase quintuple-encoded
  [Q5 + "\u0081", "\u00c1"], // Á
  [Q5 + "\u0083", "\u00c3"], // Ã
  [Q5 + "\u0087", "\u00c7"], // Ç
  [Q5 + "\u0089", "\u00c9"], // É
  [Q5 + "\u008d", "\u00cd"], // Í
  [Q5 + "\u0093", "\u00d3"], // Ó
  [Q5 + "\u009a", "\u00da"], // Ú

  // ── Quadruple-encoded (8 chars → 1 char) ──────────────────────────────────
  [Q4 + "\u00a0", "\u00e0"], // à
  [Q4 + "\u00a1", "\u00e1"], // á
  [Q4 + "\u00a2", "\u00e2"], // â
  [Q4 + "\u00a3", "\u00e3"], // ã
  [Q4 + "\u00a7", "\u00e7"], // ç
  [Q4 + "\u00a9", "\u00e9"], // é
  [Q4 + "\u00aa", "\u00ea"], // ê
  [Q4 + "\u00ad", "\u00ed"], // í
  [Q4 + "\u00b3", "\u00f3"], // ó
  [Q4 + "\u00b4", "\u00f4"], // ô
  [Q4 + "\u00b5", "\u00f5"], // õ
  [Q4 + "\u00ba", "\u00fa"], // ú
  // Uppercase quadruple-encoded
  [Q4 + "\u0081", "\u00c1"], // Á
  [Q4 + "\u0083", "\u00c3"], // Ã
  [Q4 + "\u0087", "\u00c7"], // Ç
  [Q4 + "\u0089", "\u00c9"], // É
  [Q4 + "\u008d", "\u00cd"], // Í
  [Q4 + "\u0093", "\u00d3"], // Ó
  [Q4 + "\u009a", "\u00da"], // Ú

  // ── Triple-encoded (ÃƒÂX → char) ─────────────────────────────────────────
  ["\u00c3\u0192\u00c2\u00a0", "\u00e0"], // à
  ["\u00c3\u0192\u00c2\u00a1", "\u00e1"], // á
  ["\u00c3\u0192\u00c2\u00a2", "\u00e2"], // â
  ["\u00c3\u0192\u00c2\u00a3", "\u00e3"], // ã
  ["\u00c3\u0192\u00c2\u00a7", "\u00e7"], // ç
  ["\u00c3\u0192\u00c2\u00a9", "\u00e9"], // é
  ["\u00c3\u0192\u00c2\u00aa", "\u00ea"], // ê
  ["\u00c3\u0192\u00c2\u00ad", "\u00ed"], // í
  ["\u00c3\u0192\u00c2\u00b3", "\u00f3"], // ó
  ["\u00c3\u0192\u00c2\u00b4", "\u00f4"], // ô
  ["\u00c3\u0192\u00c2\u00b5", "\u00f5"], // õ
  ["\u00c3\u0192\u00c2\u00ba", "\u00fa"], // ú
  ["\u00c3\u0192\u00c2\u00a8", "\u00e8"], // è
  ["\u00c3\u0192\u00c2\u00af", "\u00ef"], // ï
  // Uppercase triple-encoded
  ["\u00c3\u0192\u00c2\u0081", "\u00c1"], // Á
  ["\u00c3\u0192\u00c2\u0083", "\u00c3"], // Ã
  ["\u00c3\u0192\u00c2\u0087", "\u00c7"], // Ç
  ["\u00c3\u0192\u00c2\u0089", "\u00c9"], // É
  ["\u00c3\u0192\u00c2\u008d", "\u00cd"], // Í
  ["\u00c3\u0192\u00c2\u0093", "\u00d3"], // Ó
  ["\u00c3\u0192\u00c2\u009a", "\u00da"], // Ú

  // ── Double-encoded (Ã? → char) ────────────────────────────────────────────
  ["\u00c3\u00a0", "\u00e0"], // à
  ["\u00c3\u00a1", "\u00e1"], // á
  ["\u00c3\u00a2", "\u00e2"], // â
  ["\u00c3\u00a3", "\u00e3"], // ã
  ["\u00c3\u00a7", "\u00e7"], // ç
  ["\u00c3\u00a9", "\u00e9"], // é
  ["\u00c3\u00aa", "\u00ea"], // ê
  ["\u00c3\u00ad", "\u00ed"], // í
  ["\u00c3\u00b3", "\u00f3"], // ó
  ["\u00c3\u00b4", "\u00f4"], // ô
  ["\u00c3\u00b5", "\u00f5"], // õ
  ["\u00c3\u00ba", "\u00fa"], // ú
  ["\u00c3\u00a8", "\u00e8"], // è
  ["\u00c3\u00af", "\u00ef"], // ï
  ["\u00c3\u00b9", "\u00f9"], // ù
  // Uppercase double-encoded
  ["\u00c3\u0081", "\u00c1"], // Á
  ["\u00c3\u0082", "\u00c2"], // Â
  ["\u00c3\u0083", "\u00c3"], // Ã
  ["\u00c3\u0087", "\u00c7"], // Ç
  ["\u00c3\u0089", "\u00c9"], // É
  ["\u00c3\u008a", "\u00ca"], // Ê
  ["\u00c3\u008d", "\u00cd"], // Í
  ["\u00c3\u0093", "\u00d3"], // Ó
  ["\u00c3\u0094", "\u00d4"], // Ô
  ["\u00c3\u009a", "\u00da"], // Ú

  // ── Bullet point • (triple-encoded via Windows-1252 path) ─────────────────
  // â€¢ read as UTF-8 bytes C3A2 E282AC C2A2 → •
  ["\u00e2\u20ac\u00a2", "\u2022"],       // â€¢  → •
  ["\u00c3\u00a2\u20ac\u00a2", "\u2022"], // Ã¢€¢ → •

  // ── Em-dash ── (â€") ──────────────────────────────────────────────────────
  ["\u00e2\u20ac\u201c", "\u2013"],       // â€" → –
  ["\u00e2\u20ac\u201d", "\u2014"],       // â€" → —

  // ── Left/right double quotes ──────────────────────────────────────────────
  ["\u00e2\u20ac\u009c", "\u201c"],       // â€œ → "
  ["\u00e2\u20ac\u009d", "\u201d"],       // â€  → "
];

// ── Apply fixes ──────────────────────────────────────────────────────────────
const files = SOURCE_DIRS.flatMap((d) => walk(path.join(ROOT, d)));
const changed = [];

for (const file of files) {
  let original;
  try {
    original = fs.readFileSync(file, "utf8");
  } catch {
    continue;
  }

  let content = original;
  for (const [broken, correct] of FIXES) {
    if (content.includes(broken)) {
      content = content.split(broken).join(correct);
    }
  }

  if (content !== original) {
    fs.writeFileSync(file, content, "utf8");
    const rel = path.relative(ROOT, file).replace(/\\/g, "/");
    changed.push(rel);
    console.log("FIXED:", rel);
  }
}

if (changed.length === 0) {
  console.log("Nenhum encoding quebrado encontrado.");
} else {
  console.log(`\n${changed.length} arquivo(s) corrigido(s).`);
}
