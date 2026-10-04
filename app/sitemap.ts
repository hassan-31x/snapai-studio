import type { MetadataRoute } from "next";
import { brand } from "@/lib/brand";
export default function sitemap(): MetadataRoute.Sitemap {
  return ["", "/privacy", "/terms"].map((path) => ({
    url: `${brand.url}${path}`,
    changeFrequency: "monthly",
  }));
}
