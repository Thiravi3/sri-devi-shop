/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  allowedDevOrigins: ['10.165.32.174', '192.168.1.97', '10.73.40.174'],
  serverActions: {
    allowedOrigins: ['10.73.40.174:3000', '192.168.1.97:3000', 'localhost:3000']
  }
};

export default nextConfig;
