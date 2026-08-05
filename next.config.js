/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['res.cloudinary.com', 's3.amazonaws.com'],
  },
  transpilePackages: ['react-pdf', 'pdfjs-dist'],
}

module.exports = nextConfig
