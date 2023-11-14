const { z } = require("zod");

// Solves: Error: Your schema.prisma could not be found
// @docs https://www.prisma.io/docs/guides/other/troubleshooting-orm/help-articles/nextjs-prisma-client-monorepo
const { PrismaPlugin } = require("@prisma/nextjs-monorepo-workaround-plugin");

const envValidationSchema = z.object({
  NEXT_PUBLIC_PROCESSOR_API_URL: z.string().min(1),
  POSTGRES_URL: z.string().min(1),
  POSTGRES_URL_NON_POOLING: z.string().min(1),
});
envValidationSchema.parse(process.env); // validate ENV schema

/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.plugins = [...config.plugins, new PrismaPlugin()];
    }

    // Solves: Module not found: `bufferutil` and `utf-8-validate`
    // when importing `ccxt` in a Server Component (#57)
    config.externals.push({
      "utf-8-validate": "commonjs utf-8-validate",
      bufferutil: "commonjs bufferutil",
    });

    return config;
  },
  experimental: {
    optimizePackageImports: ["@mui/base", "@mui/joy"],
  },
};
