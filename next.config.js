/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // Permanent redirects from the old ?tool= query-param URLs (used before
  // each tool became its own real page) to the new dedicated routes. This
  // preserves any link equity/indexing search engines had already given
  // the old URLs instead of silently 404-ing or duplicating content under
  // two different addresses.
  async redirects() {
    return [
      { source: "/", has: [{ type: "query", key: "tool", value: "fancy-text" }], destination: "/fancy-font-generator", permanent: true },
      { source: "/", has: [{ type: "query", key: "tool", value: "logo-generator" }], destination: "/gaming-logo-maker", permanent: true },
      { source: "/", has: [{ type: "query", key: "tool", value: "case-converter" }], destination: "/case-converter", permanent: true },
      { source: "/", has: [{ type: "query", key: "tool", value: "analytics" }], destination: "/word-counter", permanent: true },
      { source: "/", has: [{ type: "query", key: "tool", value: "cleaner" }], destination: "/text-cleaner", permanent: true },
    ];
  },
};

module.exports = nextConfig;
