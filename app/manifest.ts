import type { MetadataRoute } from "next";
import { SITE } from "@/lib/site";

// Web App Manifest（/manifest.webmanifest として配信）。
// PWA としてホーム画面に追加・アプリ起動できるようにする。
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${SITE.name}（${SITE.nameJa}）`,
    short_name: SITE.name,
    description: SITE.description,
    start_url: "/",
    scope: "/",
    display: "standalone",
    orientation: "portrait",
    lang: "ja",
    dir: "ltr",
    background_color: "#ffffff",
    theme_color: "#1b3522",
    icons: [
      {
        src: "/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icon-maskable-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
