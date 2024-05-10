const { z } = require("zod");

const envValidationSchema = z.object({
  NEXT_PUBLIC_PROCESSOR_URL: z.string().optional(),
  NEXT_PUBLIC_PROCESSOR_ENABLE_TRPC: z.enum(["true", ""]).optional(),
  NEXT_PUBLIC_STATIC: z.enum(["true", ""]).optional(),
  DATABASE_URL: z.string().min(1),
  ADMIN_PASSWORD: z.string().min(1),
});
envValidationSchema.parse(process.env); // validate ENV schema

/** @type {import('next').NextConfig} */
module.exports = {
  output: process.env.NEXT_PUBLIC_STATIC === "true" ? "export" : "standalone",
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
    missingSuspenseWithCSRBailout: false, // error when building app: https://nextjs.org/docs/messages/missing-suspense-with-csr-bailout
  },
};
