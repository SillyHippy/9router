"use client";

import { useEffect } from "react";

/**
 * Client component that patches window.fetch to prepend basePath.
 * The patcher auto-prepends NEXT_PUBLIC_BASE_PATH to all relative
 * fetch URLs (/api/..., /_next/... etc.) so components don't need
 * to manually prefix each call.
 *
 * Must be a client component because it accesses window.fetch.
 * Place inside _app or root layout within a ThemeProvider-like
 * client boundary.
 */
export default function FetchPatcher() {
  useEffect(() => {
    const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || "";
    if (!BASE_PATH) return;

    const originalFetch = window.fetch;

    window.fetch = function patchedFetch(input, init) {
      // Only prepend basePath to relative URL strings (starting with /)
      if (typeof input === "string" && input.startsWith("/")) {
        // Skip already-prefixed URLs
        if (!input.startsWith(BASE_PATH + "/")) {
          input = BASE_PATH + input;
        }
      } else if (
        input &&
        typeof input === "object" &&
        "url" in input &&
        typeof input.url === "string" &&
        input.url.startsWith("/")
      ) {
        // Handle Request objects with relative URL
        if (!input.url.startsWith(BASE_PATH + "/")) {
          const newUrl = BASE_PATH + input.url;
          const patchedReq = new Request(newUrl, input);
          return originalFetch.call(window, patchedReq, init);
        }
      }

      return originalFetch.call(window, input, init);
    };

    console.log("[FetchPatcher] Patched window.fetch with basePath:", BASE_PATH);

    return () => {
      window.fetch = originalFetch;
    };
  }, []);

  return null; // This component renders nothing
}
