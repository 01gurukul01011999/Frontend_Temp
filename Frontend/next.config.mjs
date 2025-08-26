/** @type {import('next').NextConfig} */
const config = {
  // output: 'export', // Removed to allow development server
  images: {
    unoptimized: true, // disables optimization for static export
  },
};

export default config;
