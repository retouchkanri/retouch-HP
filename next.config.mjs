/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    serverActions: {
      // Admin image uploads (news, horses, media) exceed the default 1 MB limit.
      bodySizeLimit: "10mb",
    },
  },
  images: {
    // Allow images served from Supabase Storage public buckets (e.g. horse photos
    // rendered via next/image on the horse detail page).
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
};

export default nextConfig;
