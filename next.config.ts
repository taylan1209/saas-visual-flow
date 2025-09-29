import type { NextConfig } from "next";

// For GitHub Pages deployments, we need to support a basePath like "/<repo>"
// and ensure all asset URLs are prefixed accordingly. We control this via env:
//   BASE_PATH=/repo-name
// When BASE_PATH is set, we also set assetPrefix the same, so CSS/JS work.
const basePath = process.env.BASE_PATH || "";

const nextConfig: NextConfig = {
  // Export to static HTML for GitHub Pages
  output: "export",
  // Prefix paths when deploying under a subpath (GitHub Pages project sites)
  ...(basePath
    ? {
        basePath,
        assetPrefix: basePath + "/",
      }
    : {}),
};

export default nextConfig;
