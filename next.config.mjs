/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["cloud.appwrite.io", "image1.com", "image2.com"],
  },
  experimental: {
    missingSuspenseWithCSRBailout: false,
  },
  // async redirects() {
  //     return [
  //     {
  //         source: "/countries",
  //         destination: "/admin/countries",
  //         permanent: true,
  //     },
  //     {
  //         source: "/cities",
  //         destination: "/admin/cities",
  //         permanent: true,
  //     },
  //     {
  //         source: "/packages",
  //         destination: "/admin/packages",
  //         permanent: true,
  //     },
  //     ];
  // },
};

export default nextConfig;
