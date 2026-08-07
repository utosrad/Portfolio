/** @type {import('next').NextConfig} */
const nextConfig = {
  // Type errors fail the build (the `typescript.ignoreBuildErrors` escape hatch
  // is deliberately absent). Lint is left off the deploy path — `npm run lint`
  // covers it locally.
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    unoptimized: true,
  },
}

export default nextConfig
