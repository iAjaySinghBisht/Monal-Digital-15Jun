const { join } = require("path");

/**
 * Cache Puppeteer's Chromium download inside the project so Vercel's build
 * cache persists it between deploys (the default ~/.cache is not cached).
 * Used by scripts/prerender.mjs to snapshot real HTML for each route.
 */
module.exports = {
  cacheDirectory: join(__dirname, ".cache", "puppeteer"),
};
