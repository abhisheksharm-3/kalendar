/** @type {import('next').NextConfig} */
// import withPWAInit from "@ducanh2912/next-pwa";

// const withPWA = withPWAInit({
//   dest: "public",
// });
const nextConfig = {
  reactStrictMode: true,
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        http: false,
        https: false,
      };
    }
    return config;
  },
  serverRuntimeConfig: {
    // This will be available on both server and client sides
    functionMaxDuration: 60 // in seconds
  },
};

// Vercel-specific configuration
if (process.env.VERCEL) {
  nextConfig.functions = {
    'api/ai/schedule': {
      maxDuration: 60
    }
  };
}

export default nextConfig;