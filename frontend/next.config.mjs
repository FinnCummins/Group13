/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',  // This sets up static exports
  images: {
    unoptimized: true
  }
};

export default nextConfig;
