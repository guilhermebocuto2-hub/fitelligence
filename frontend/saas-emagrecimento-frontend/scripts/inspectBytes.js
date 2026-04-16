const fs = require("fs");

const file = "app/onboarding/page.jsx";
const content = fs.readFileSync(file, "utf8");
const lines = content.split("\n");

// Print codepoints for lines 4-10
[3, 4, 5, 6, 7, 8, 9].forEach((i) => {
  const line = lines[i] || "";
  let hex = "";
  for (const c of line) {
    const cp = c.codePointAt(0);
    if (cp > 127) hex += `[U+${cp.toString(16).toUpperCase().padStart(4, "0")}=${c}]`;
  }
  console.log(`L${i + 1}: ${line.trim().slice(0, 60)}`);
  if (hex) console.log(`     non-ASCII: ${hex}`);
});
