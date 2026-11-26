import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    /**
     * AVIF first, WebP behind it. Next's default list is WebP alone, which on a
     * throttled phone cost the cover frame 153 KB — and the cover's wordmark is the
     * page's LCP element, so that download was being paid for by a piece of text
     * that had nothing to fetch. The optimizer encodes AVIF once per size and
     * caches it; the first request after a deploy is the only slow one.
     */
    formats: ["image/avif", "image/webp"],
  },
  compiler: {
    // No console output in production bundles; keep errors so real failures surface.
    removeConsole:
      process.env.NODE_ENV === "production" ? { exclude: ["error"] } : false,
  },
  /**
   * The site lives at thetorahouse.in. Links already shared with the old Vercel
   * address are sent on with their path intact, so /demo lands on /demo. The match
   * is on that one host, so preview deployments are never redirected.
   *
   * /api is left alone: a tab opened on the old address before the move still
   * submits its form to the address it loaded from, and a redirect on a POST to
   * another origin would fail it.
   */
  async redirects() {
    return [
      {
        source: "/:path((?!api/).*)",
        has: [{ type: "host", value: "tora-house-flame.vercel.app" }],
        destination: "https://thetorahouse.in/:path",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
