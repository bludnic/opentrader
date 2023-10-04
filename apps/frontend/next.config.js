const { z } = require("zod");

// Solves: Error: Your schema.prisma could not be found
// @docs https://www.prisma.io/docs/guides/other/troubleshooting-orm/help-articles/nextjs-prisma-client-monorepo
const { PrismaPlugin } = require("@prisma/nextjs-monorepo-workaround-plugin");

const envValidationSchema = z.object({
  NEXT_PUBLIC_BACKEND_API_URL: z.string().min(1),
  NEXT_PUBLIC_MARKETS_API_URL: z.string().min(1),
});
envValidationSchema.parse(process.env); // validate ENV schema

/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.plugins = [...config.plugins, new PrismaPlugin()];
    }

    return config;
  },
};
