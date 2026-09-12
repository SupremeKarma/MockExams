import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // @examai/content is a workspace package shipped as TypeScript source. It is
  // the single parser/renderer used by the Reader, the publish pipeline and the
  // admin preview — keeping it as source (rather than a build step) is what
  // stops a stale compiled copy drifting from what publish actually stored.
  transpilePackages: ["@examai/content"],

  // The dev-only overlay sits in the top-left, exactly where the Reader puts
  // its menu button — it covers the control during local testing and in any
  // screenshot taken from the dev server.
  devIndicators: false,
};

export default nextConfig;
