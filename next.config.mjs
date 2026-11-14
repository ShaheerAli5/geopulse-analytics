/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  rewrites: async () => {
    // In Vercel cloud environment, Vercel routes /api to Python serverless functions.
    // Locally (dev or production start), proxy API requests to the Python server on port 8000.
    if (process.env.VERCEL) {
      return [];
    }
    return [
      {
        source: "/api/:path*",
        destination: "http://127.0.0.1:8000/api/:path*",
      },
    ];
  },
};

export default nextConfig;
