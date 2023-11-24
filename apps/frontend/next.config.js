const { z } = require("zod");

const envValidationSchema = z.object({
  NEXT_PUBLIC_PROCESSOR_API_URL: z.string().min(1),
  DATABASE_URL: z.string().min(1),
});
envValidationSchema.parse(process.env); // validate ENV schema

/** @type {import('next').NextConfig} */
module.exports = {
  output: 'standalone',
  reactStrictMode: true,
  webpack: (config) => {
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
