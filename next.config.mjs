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
        hostname: "uzpin.uz",
        port: "",
        pathname: "/uploads/game/**",
      },
    ],
  },
};

export default nextConfig;
