import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Next 16 refuses the dev HMR WebSocket (and any request carrying an Origin
  // header) from hosts not listed here, and the Turbopack client will not mount
  // the app without that socket. Next's matcher compares hostname segments from
  // the right, so an IPv4 address needs a four-segment pattern.
  allowedDevOrigins: [
    "*.*.*.*", // any IPv4 (phone on the LAN)
    "*.local",
    "*.trycloudflare.com",
    "*.ngrok-free.app",
    "*.ngrok.app",
  ],
};

export default nextConfig;
