/**
 * BasePath utility for 9Router client-side code.
 * 
 * NEXT_PUBLIC_* env vars are inlined at build time, so this value
 * is baked into the client JS bundle. Used to prefix API fetch URLs
 * when running behind a reverse proxy (e.g., /9router prefix).
 */
export const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || "";

/**
 * Prepend the basePath to a URL if it starts with / (relative path).
 */
export function withBasePath(path) {
  if (!path || !path.startsWith("/")) return path;
  return BASE_PATH + path;
}
