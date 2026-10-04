export const brand = {
  name: "SnapAI Studio",
  description:
    "Create AI product photography and ad creatives from your own photos. Generate studio shots, campaign images, and variations with SnapAI Studio.",
  url: new URL(
    process.env.NEXT_PUBLIC_APP_URL ||
      process.env.BASE_URL ||
      "http://localhost:3000",
  ).origin,
};
export const FREE_CREDITS = 10;
