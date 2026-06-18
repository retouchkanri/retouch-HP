"use client";

import { useEffect } from "react";

// サービスワーカーを登録して PWA を有効化する。
// 本番（HTTPS / localhost）でのみ動作する。
export default function ServiceWorkerRegister() {
  useEffect(() => {
    if (typeof window === "undefined" || !("serviceWorker" in navigator)) {
      return;
    }
    const onLoad = () => {
      navigator.serviceWorker.register("/sw.js").catch(() => {
        /* 登録失敗は無視（PWA非対応環境など） */
      });
    };
    window.addEventListener("load", onLoad);
    return () => window.removeEventListener("load", onLoad);
  }, []);

  return null;
}
