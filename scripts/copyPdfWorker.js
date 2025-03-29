const path = require("path");
const fs = require("fs");

const pdfjsDistPath = path.dirname(require.resolve("pdfjs-dist/package.json"));

let pdfWorkerPath;
const possibleWorkerPaths = [
  path.join(pdfjsDistPath, "legacy", "build", "pdf.worker.min.mjs"),
  path.join(pdfjsDistPath, "build", "pdf.worker.min.mjs"),
  path.join(pdfjsDistPath, "legacy", "build", "pdf.worker.min.js"),
  path.join(pdfjsDistPath, "build", "pdf.worker.min.js"),
  path.join(pdfjsDistPath, "es5", "build", "pdf.worker.min.js"),
  path.join(pdfjsDistPath, "es5", "build", "pdf.worker.js"),
  path.join(pdfjsDistPath, "build", "pdf.worker.js"),
];

for (const workerPath of possibleWorkerPaths) {
  if (fs.existsSync(workerPath)) {
    pdfWorkerPath = workerPath;
    break;
  }
}

const cMapsDir = path.join(pdfjsDistPath, "cmaps");

const publicWorkerPath = path.join(__dirname, "../public/pdf.worker.min.js");
const publicCmapsDir = path.join(__dirname, "../public/cmaps");

if (!fs.existsSync(publicCmapsDir)) {
  fs.mkdirSync(publicCmapsDir, { recursive: true });
}

if (pdfWorkerPath) {
  try {
    fs.copyFileSync(pdfWorkerPath, publicWorkerPath);
    console.log(
      `✓ Successfully copied ${path.basename(
        pdfWorkerPath
      )} to public folder as pdf.worker.min.js`
    );
  } catch (error) {
    console.error(`Error copying pdf worker: ${error.message}`);
  }
} else {
  console.error(
    "Could not find pdf.worker.min.js/mjs in pdfjs-dist. Please check your installation."
  );
}

try {
  const cmapFiles = fs.readdirSync(cMapsDir);
  let copiedCount = 0;

  cmapFiles.forEach((file) => {
    const srcFile = path.join(cMapsDir, file);
    const destFile = path.join(publicCmapsDir, file);
    fs.copyFileSync(srcFile, destFile);
    copiedCount++;
  });

  console.log(
    `✓ Successfully copied ${copiedCount} cmap files to public/cmaps folder`
  );
} catch (error) {
  console.error(`Error copying cmap files: ${error.message}`);
}
