const fs = require("fs");

const files = [
  "app/(auth)/cadastro/page.jsx",
  "app/(public)/login/page.jsx",
  "app/checkout/page.jsx",
  "app/premium/page.jsx",
  "src/components/dashboard/ResumoAlimentarCard.jsx",
  "src/data/onboardingConfig.js",
];

for (const f of files) {
  const content = fs.readFileSync(f, "utf8");
  const lines = content.split("\n");
  const hits = [];
  lines.forEach((line, i) => {
    if (/\u00c3[\u0080-\u00bf]/.test(line)) {
      hits.push({ line: i + 1, text: line.trim().slice(0, 90) });
    }
  });
  if (hits.length) {
    console.log("\n=== " + f + " ===");
    hits.forEach((h) => console.log("  L" + h.line + ":", h.text));
  } else {
    console.log(f + ": OK");
  }
}
