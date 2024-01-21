export function getBaseUrl(): string {
  const isProduction = process.env.NODE_ENV === "production";
  if (isProduction) {
    if (typeof window !== "undefined") {
      const customURL = localStorage.getItem("APP_URL");

      // browser should use relative path
      return customURL ? customURL : "";
    }
  }

  if (process.env.NEXT_PUBLIC_PROCESSOR_ENABLE_TRPC) {
    return `${process.env.NEXT_PUBLIC_PROCESSOR_URL}`;
  }

  if (typeof window !== "undefined")
    // browser should use relative path
    return "";
  if (process.env.VERCEL_URL)
    // reference for vercel.com
    return `https://${process.env.VERCEL_URL}`;
  if (process.env.RENDER_INTERNAL_HOSTNAME)
    // reference for render.com
    return `http://${process.env.RENDER_INTERNAL_HOSTNAME}:${process.env.PORT}`;

  // assume localhost
  return `http://localhost:${process.env.PORT ?? 3000}`;
}
