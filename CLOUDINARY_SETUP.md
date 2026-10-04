# Cloudinary storage

Set `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, and `CLOUDINARY_API_SECRET` in the server environment. The application uploads through the server SDK; no unsigned upload preset or browser-visible secret is needed.

Originals, product shots, campaigns, and variations are stored under `stillframe/`. Outputs are uploaded before URLs are saved to MongoDB. Campaign exports are cropped to their documented pixel dimensions. Product shot resolutions follow the configured image model; their UI exposes aspect ratios rather than promising fixed output pixels.

Project and download routes enforce account ownership. Cloudinary delivery URLs themselves are shareable public links, and should not be treated as private file storage. Generated images and prompts should not contain sensitive personal documents.

Failed provider batches attempt to clean up their uploads. Account deletion removes database records transactionally and attempts to remove referenced Cloudinary assets. Monitor server logs for cleanup failures. A provider or database outage after an upload can leave an orphaned image; audit old storage assets periodically.
