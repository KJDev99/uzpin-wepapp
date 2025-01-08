/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "api.amaliymoliya.uz",
        port: "",
        pathname: "/media/uploads/**",
      },
      {
        protocol: "https",
        hostname: "api.uzpin.games",
        port: "",
        pathname: "/media/uploads/**",
      },
    ],
  },
};

export default nextConfig;
