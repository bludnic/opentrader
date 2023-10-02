const { z } = require("zod");

const envValidationSchema = z.object({
  NEXT_PUBLIC_BACKEND_API_URL: z.string().min(1),
  NEXT_PUBLIC_MARKETS_API_URL: z.string().min(1),
});
envValidationSchema.parse(process.env); // validate ENV schema

/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
};
