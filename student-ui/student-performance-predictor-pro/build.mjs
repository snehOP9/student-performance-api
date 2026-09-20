import { mkdir, writeFile } from "node:fs/promises";

const target = "https://student-performance-predictor-pro-w.vercel.app/";

await mkdir("dist", { recursive: true });
await writeFile(
  "dist/index.html",
  `<!doctype html><html><head><meta charset="utf-8"><meta http-equiv="refresh" content="0;url=${target}"><title>Student Performance Predictor</title></head><body><p>Redirecting to <a href="${target}">Student Performance Predictor</a>...</p><script>location.replace(${JSON.stringify(target)})</script></body></html>`
);
