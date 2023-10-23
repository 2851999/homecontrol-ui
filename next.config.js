/** @type {import('next').NextConfig} */
const nextConfig = {
  // WARNING: Breaks token refresh as does two requests simultaneously with
  // same token, so the 1st invalidates the 2nd
  reactStrictMode: false,
}

module.exports = nextConfig
