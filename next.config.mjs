/** @type {import('next').NextConfig} */
import withPWAInit from "@ducanh2912/next-pwa";

const withPWA = withPWAInit({
  dest: "public",
});
const nextConfig = withPWA({
  staticPageGenerationTimeout: 1000,
});

export default nextConfig;
