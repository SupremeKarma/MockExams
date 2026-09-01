"use client";

import { useEffect } from "react";

/**
 * Registers the service worker so the app opens on a poor connection.
 *
 * Only in production: in development the worker would serve stale bundles and
 * make every change look like it did not apply.
 */
export function ServiceWorkerRegistrar() {
  useEffect(() => {
    if (process.env.NODE_ENV !== "production") return;
    if (typeof navigator === "undefined" || !("serviceWorker" in navigator)) return;

    const register = () => {
      navigator.serviceWorker
        .register("/sw.js")
        .catch((err) => console.error("Service worker registration failed:", err));
    };

    // Wait for load so registration never competes with the first paint.
    if (document.readyState === "complete") register();
    else window.addEventListener("load", register, { once: true });
  }, []);

  return null;
}

export default ServiceWorkerRegistrar;
