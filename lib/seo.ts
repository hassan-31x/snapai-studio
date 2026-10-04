import type { Metadata } from "next";
import { brand } from "@/lib/brand";

export const siteTitle =
  "SnapAI Studio | AI Product Photography & Ad Creatives";
export const socialImage = {
  url: "/opengraph-image.jpg",
  width: 1200,
  height: 630,
  type: "image/jpeg",
  alt: "SnapAI Studio: AI product photography and campaign creatives",
};

export function publicPageMetadata(
  title: string,
  description: string,
  path: string,
): Metadata {
  const url = new URL(path, brand.url).href;
  const socialTitle = path === "/" ? title : `${title} | ${brand.name}`;
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title: socialTitle,
      description,
      url,
      siteName: brand.name,
      locale: "en_US",
      type: "website",
      images: [socialImage],
    },
    twitter: {
      card: "summary_large_image",
      title: socialTitle,
      description,
      images: [socialImage],
    },
  };
}

export const websiteSchema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": `${brand.url}/#website`,
      name: brand.name,
      url: `${brand.url}/`,
      description: brand.description,
      inLanguage: "en",
    },
    {
      "@type": "WebApplication",
      "@id": `${brand.url}/#application`,
      name: brand.name,
      url: `${brand.url}/`,
      description: brand.description,
      applicationCategory: "MultimediaApplication",
      operatingSystem: "Any",
      browserRequirements: "Requires a modern web browser and JavaScript",
      image: `${brand.url}${socialImage.url}`,
      featureList: [
        "AI product photography",
        "Campaign images in five formats",
        "Product image variations",
        "Canvas editing and PNG export",
      ],
      isPartOf: { "@id": `${brand.url}/#website` },
    },
  ],
};
