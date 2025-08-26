const url = require("url");

const SPRING_HOST = process.env.SPRING_URI
  ? new url.URL(process.env.SPRING_URI).hostname
  : null;

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  images: {
    domains: [
      "lh3.googleusercontent.com",
      "kaja2002.com",
      SPRING_HOST,
    ].filter(Boolean),
  },
  output: "standalone",
};

module.exports = nextConfig;
