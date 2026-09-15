/**
 * Next.js configuration.
 *
 * We keep this deliberately small. Anything that belongs in the browser bundle
 * should be explicit, because from Sprint 4 onward we start handling API keys
 * that must never leave the server.
 *
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  // Surfaces React problems (double-invoked effects, legacy lifecycle usage)
  // during `npm run dev`. It does NOT affect the production build.
  reactStrictMode: true,
};

export default nextConfig;
