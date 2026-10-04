import type { MetadataRoute } from "next";
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "SnapAI Studio",
    short_name: "SnapAI Studio",
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
