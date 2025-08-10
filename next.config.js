/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  experimental: {
    // Enable the new app directory (app router)
    appDir: true
  }
}

module.exports = nextConfig