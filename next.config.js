/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true
  },
  // Skip API routes during static export
  skipTrailingSlashRedirect: true,
}

module.exports = nextConfig
