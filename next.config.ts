import type { NextConfig } from 'next';

/**
 * Static export: `next build` emits a fully static `out/` directory, so the site
 * deploys to Vercel, GitHub Pages, S3, or any file server with no runtime.
 *
 * For GitHub Pages under a project path, set NEXT_PUBLIC_BASE_PATH=/repo-name
 * before building (see README).
 */
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? '';

const nextConfig: NextConfig = {
  output: 'export',
  basePath: basePath || undefined,
  trailingSlash: true,
  images: { unoptimized: true },
};

export default nextConfig;
