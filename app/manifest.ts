import type { MetadataRoute } from "next";
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Stillframe",
    short_name: "Stillframe",
    description: "Your independent creative studio",
    start_url: "/dashboard",
    display: "standalone",
    background_color: "#fafbfc",
    theme_color: "#1d222b",
    icons: [
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml" },
      { src: "/apple-icon", sizes: "180x180", type: "image/png" },
    ],
  };
}
