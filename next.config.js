/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true
  },
  // Optional: if you need environment variables
  env: {
    // Add any env vars here if needed
  }
}

export default nextConfig
