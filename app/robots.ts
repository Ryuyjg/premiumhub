import type { MetadataRoute } from "next";

const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: ["/", "/products", "/login"],
      disallow: ["/admin", "/dashboard", "/api"]
    },
    sitemap: `${appUrl}/sitemap.xml`
  };
}
