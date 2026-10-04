# SEO launch checklist

Completed: generated OG card; Open Graph and Twitter metadata; descriptive titles and page-specific descriptions; canonical URLs; WebSite and WebApplication JSON-LD; public sitemap; private-route indexing restrictions; icons and manifest; local HTTP verification.

1. Set `NEXT_PUBLIC_APP_URL`, `BASE_URL`, and `AUTH_URL` to your one final HTTPS origin, then rebuild. Redirect alternate www/non-www domains to that origin through your host.
2. Connect Google Search Console and Bing Webmaster Tools. Add the optional `GOOGLE_SITE_VERIFICATION` and `BING_SITE_VERIFICATION` values when using HTML-token verification, then rebuild.
3. Submit `/sitemap.xml`. Inspect the home, privacy, and terms pages for the intended canonical and indexability. Ensure any hosting “prevent indexing” switch is off for production.
4. Test the deployed card URL `/opengraph-image.jpg` and a real link preview. Refresh the social platform's cache when replacing the image later.
5. Validate JSON-LD with Schema.org's validator. Software rich results require additional qualifying information; do not invent reviews or ratings to satisfy them.
6. Measure mobile PageSpeed and field Core Web Vitals after deployment. Review Search Console indexing, impressions, queries, and crawler errors as real traffic arrives.

These are deployment and monitoring steps; they do not require changing the current UI or inventing additional marketing pages.
