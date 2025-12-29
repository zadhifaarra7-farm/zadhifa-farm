/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    images: {
        domains: ['images.unsplash.com', 'via.placeholder.com'],
    },
    // Essential for Turso/LibSQL on Vercel
    serverExternalPackages: ['@libsql/client', '@prisma/adapter-libsql'],
}

module.exports = nextConfig
