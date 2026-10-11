/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    serverActions: {
      // 馬情報の CSV 取り込み（最大500行）が既定の 1MB を超える場合に備える。
      // 画像はブラウザから Supabase Storage へ直接送るため、ここは通らない。
      bodySizeLimit: "4mb",
    },
  },
  images: {
    // Vercel の画像最適化（/_next/image）は月間の利用枠を使い切ると 402 を返し、
    // ヒーロー背景や馬の写真が表示されなくなる。最適化には頼らず、
    // 軽量化済みのファイル（public/*.webp・Supabase Storage）をそのまま配信する。
    unoptimized: true,
  },
};

export default nextConfig;
