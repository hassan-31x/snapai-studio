"use client";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useSession } from "next-auth/react";
import {
  CameraIcon,
  StackIcon,
  UploadSimpleIcon,
  ArrowDownIcon,
  PencilSimpleIcon,
  CopyIcon,
} from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { generateProductShotsAction } from "@/actions/generate-product-shots";
import { submitProductAction } from "@/actions/submit-product";
import { enhancePrompt } from "@/actions/prompt-assistance";
import { generateImageVariations } from "@/actions/image-variations";
import { getGenerationAction } from "@/actions/get-generation";
import { toast } from "sonner";
import type { getGeneration } from "@/utils/generations";
import { imageTypes } from "@/lib/image-types";
type Project = NonNullable<Awaited<ReturnType<typeof getGeneration>>>;
type Shot = {
  id?: string;
  imageUrl: string;
  prompt: string;
  aspectRatio: string;
  scene: string;
  title?: string;
  type?: string;
};
export default function Studio({
  initialProject,
}: {
  initialProject?: Project;
}) {
  const router = useRouter();
  const { data: session, update } = useSession();
  const [kind, setKind] = useState(
    initialProject?.type === "AD_CREATIVE" ? "campaign" : "shot",
  );
  const [prompt, setPrompt] = useState(initialProject?.prompt || "");
  const [scene, setScene] = useState(initialProject?.scene || "studio");
  const [ratio, setRatio] = useState(
    initialProject?.aspectRatio || "1024x1024",
  );
  const [count, setCount] = useState(1);
  const [productName, setProductName] = useState(
    initialProject?.productName || "",
  );
  const [category, setCategory] = useState(
    initialProject?.productCategory || "Beauty",
  );
  const [tagline, setTagline] = useState(initialProject?.productTagline || "");
  const [description, setDescription] = useState(
    initialProject?.productDescription || "",
  );
  const [brand, setBrand] = useState(initialProject?.brandName || "");
  const [tone, setTone] = useState(
    initialProject?.brandTone || "Clean and considered",
  );
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(
    initialProject?.originalImageUrl || null,
  );
  const [pending, setPending] = useState(false);
  const [enhancing, setEnhancing] = useState(false);
  const [error, setError] = useState("");
  const [projectId, setProjectId] = useState(initialProject?.id);
  const [busyImage, setBusyImage] = useState<string | null>(null);
  const [recovering, setRecovering] = useState(false);
  const [images, setImages] = useState<Shot[]>(() =>
    initialProject?.type === "PRODUCT_SHOT"
      ? initialProject.productImages
      : initialProject?.submissions.flatMap((sub) =>
          imageTypes
            .map((type) => ({
              imageUrl: sub[type.key as keyof typeof sub] as string,
              prompt: initialProject.productName || "",
              aspectRatio: "1024x1024",
              scene: "",
              title: type.label,
              type: type.type,
            }))
            .filter((img) => img.imageUrl),
        ) || [],
  );
  const objectUrl = useRef<string | null>(null);
  const requestInFlight = useRef(false);
  useEffect(
    () => () => {
      if (objectUrl.current) URL.revokeObjectURL(objectUrl.current);
    },
    [],
  );
  const cost = kind === "campaign" ? 5 : count;
  function pickFile(selected: File | undefined) {
    if (!selected) return;
    if (
      selected.size > 3 * 1024 * 1024 ||
      !["image/jpeg", "image/png", "image/webp"].includes(selected.type)
    ) {
      setError("Choose a JPG, PNG, or WebP image smaller than 3 MB");
      return;
    }
    if (objectUrl.current) URL.revokeObjectURL(objectUrl.current);
    objectUrl.current = URL.createObjectURL(selected);
    setFile(selected);
    setPreview(objectUrl.current);
    setError("");
  }
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (requestInFlight.current) return;
    setError("");
    if (!file) {
      setError("Upload a product photo to start a new generation");
      return;
    }
    requestInFlight.current = true;
    setPending(true);
    try {
      const data = new FormData();
      data.set("productImage", file);
      if (projectId) data.set("generationId", projectId);
      if (kind === "shot") {
        data.set("prompt", prompt);
        data.set("scene", scene);
        data.set("aspectRatio", ratio);
        data.set("numberOfImages", String(count));
        const result = await generateProductShotsAction(data);
        if (!result.success)
          throw new Error(result.error || "Generation failed");
        if (result.images)
          setImages((previous) => [...result.images!, ...previous]);
        if (result.generationId) {
          setProjectId(result.generationId);
          router.replace(`/generate?id=${result.generationId}`, {
            scroll: false,
          });
        }
      } else {
        Object.entries({
          productName,
          productCategory: category,
          productTagline: tagline,
          productDescription: description,
          brandName: brand || productName,
          brandTone: tone,
        }).forEach(([key, value]) => data.set(key, value));
        const result = await submitProductAction(data);
        if (!result.success)
          throw new Error(result.error || "Generation failed");
        if (result.creatives)
          setImages((previous) => [
            ...result.creatives.map((img) => ({
              ...img,
              prompt: productName,
              aspectRatio: "1024x1024",
              scene: "",
            })),
            ...previous,
          ]);
        if (result.generationId) {
          setProjectId(result.generationId);
          router.replace(`/generate?id=${result.generationId}`, {
            scroll: false,
          });
        }
      }
      await update();
      router.refresh();
      toast.success("Your images are ready");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Generation failed. Please try again.",
      );
    } finally {
      requestInFlight.current = false;
      setPending(false);
    }
  }
  async function improve() {
    setEnhancing(true);
    try {
      const result = await enhancePrompt(prompt);
      if (result.success && result.enhancedPrompt)
        setPrompt(result.enhancedPrompt);
      else setError(result.error || "Could not improve your prompt");
    } catch {
      setError("Could not improve your prompt");
    } finally {
      setEnhancing(false);
    }
  }
  async function variation(image: Shot) {
    if (!image.id || busyImage) return;
    setBusyImage(image.id);
    try {
      const result = await generateImageVariations({
        originalImageId: image.id,
        numberOfVariations: 1,
      });
      if (!result.success) throw new Error(result.error);
      if (result.variations)
        setImages((prev) => [...result.variations!, ...prev]);
      await update();
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Variation failed");
    } finally {
      setBusyImage(null);
    }
  }
  async function download(image: Shot) {
    try {
      const response = await fetch(
        `/api/download?url=${encodeURIComponent(image.imageUrl)}`,
      );
      if (!response.ok) throw new Error();
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `stillframe-${image.id || image.type || Date.now()}.png`;
      a.click();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch {
      toast.error("Could not download this image. Please try again.");
    }
  }
  async function refreshProject() {
    if (!projectId) return;
    setRecovering(true);
    try {
      const result = await getGenerationAction(projectId);
      if (result.success && result.generation) {
        if (result.generation.type === "PRODUCT_SHOT")
          setImages(result.generation.productImages);
        else
          setImages(
            result.generation.submissions.flatMap((sub) =>
              imageTypes
                .map((type) => ({
                  imageUrl: sub[type.key as keyof typeof sub] as string,
                  prompt: productName,
                  aspectRatio: "1024x1024",
                  scene: "",
                  title: type.label,
                  type: type.type,
                }))
                .filter((img) => img.imageUrl),
            ),
          );
        router.refresh();
        await update();
      } else setError(result.error || "Could not load this project");
    } finally {
      setRecovering(false);
    }
  }
  return (
    <div className="studio-page">
      <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="mb-3 text-sm text-muted-foreground">
            {projectId
              ? "Your saved creative direction"
              : "A new perspective starts here"}
          </p>
          <h1 className="text-3xl font-medium">
            {projectId ? "Your project" : "Create something worth keeping."}
          </h1>
        </div>
        <div className="rounded-full border px-3 py-2 text-xs text-muted-foreground">
          {session?.user?.tokens ?? "—"} credits remaining
        </div>
      </div>
      {initialProject?.status === "IN_PROGRESS" && (
        <div className="mb-6 flex flex-wrap items-center gap-4 rounded-lg border bg-secondary p-4">
          <p className="text-sm">
            This project is processing. Refresh its results in a moment.
          </p>
          <Button
            variant="outline"
            onClick={refreshProject}
            disabled={recovering}
          >
            {recovering ? "Checking…" : "Check results"}
          </Button>
        </div>
      )}
      <div className="grid items-start gap-8 xl:grid-cols-[360px_minmax(0,1fr)]">
        <form
          onSubmit={submit}
          className="min-w-0 space-y-6 rounded-xl border p-4 sm:p-6"
        >
          <fieldset disabled={pending || !!projectId}>
            <legend className="mb-3 text-sm font-medium">
              What are we making?
            </legend>
            <div className="grid grid-cols-2 gap-2">
              {[
                ["shot", "Product shot", CameraIcon],
                ["campaign", "Campaign", StackIcon],
              ].map(([value, label, Icon]) => {
                const Symbol = Icon as typeof CameraIcon;
                return (
                  <button
                    type="button"
                    key={String(value)}
                    onClick={() => setKind(String(value))}
                    aria-pressed={kind === value}
                    className={`flex items-center justify-center gap-2 rounded-lg border px-3 py-3 text-sm ${kind === value ? "border-foreground bg-secondary" : "text-muted-foreground"}`}
                  >
                    <Symbol size={18} />
                    {String(label)}
                  </button>
                );
              })}
            </div>
          </fieldset>
          <div>
            <label
              htmlFor="product-photo"
              className="mb-3 block text-sm font-medium"
            >
              Your product photo
            </label>
            <label
              htmlFor="product-photo"
              className="relative flex aspect-[4/3] cursor-pointer flex-col items-center justify-center overflow-hidden rounded-lg border border-dashed bg-secondary/50 hover:bg-secondary"
            >
              {preview ? (
                <img
                  src={preview}
                  alt="Your product reference"
                  className="h-full w-full object-contain"
                />
              ) : (
                <>
                  <UploadSimpleIcon
                    size={24}
                    className="mb-3 text-muted-foreground"
                  />
                  <span className="text-sm">Choose a product photo</span>
                  <span className="mt-2 text-xs text-muted-foreground">
                    JPG, PNG or WebP · up to 3 MB
                  </span>
                </>
              )}
              <input
                id="product-photo"
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="sr-only"
                onChange={(e) => pickFile(e.target.files?.[0])}
                disabled={pending}
              />
            </label>
            {preview && (
              <p className="mt-2 text-xs text-muted-foreground">
                Click the photo to upload a new reference.
              </p>
            )}
          </div>
          {kind === "shot" ? (
            <>
              <label className="field">
                Describe your shot
                <textarea
                  required
                  minLength={10}
                  maxLength={2000}
                  rows={4}
                  placeholder="A ceramic bottle on warm stone, soft morning light, generous negative space…"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  disabled={pending}
                />
              </label>
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={improve}
                disabled={pending || enhancing || prompt.trim().length < 10}
              >
                {enhancing ? "Refining your direction…" : "Refine with AI"}
              </Button>
              <div className="grid grid-cols-2 gap-4">
                <label className="field">
                  Setting
                  <select
                    value={scene}
                    onChange={(e) => setScene(e.target.value)}
                    disabled={pending}
                  >
                    {[
                      "studio",
                      "minimal",
                      "lifestyle",
                      "luxury",
                      "outdoor",
                      "nature",
                      "artistic",
                      "industrial",
                    ].map((s) => (
                      <option key={s} value={s}>
                        {s[0].toUpperCase() + s.slice(1)}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="field">
                  Format
                  <select
                    value={ratio}
                    onChange={(e) => setRatio(e.target.value)}
                    disabled={pending}
                  >
                    <option value="1024x1024">Square · 1:1</option>
                    <option value="1536x1024">Landscape · 3:2</option>
                    <option value="1024x1536">Portrait · 2:3</option>
                  </select>
                </label>
              </div>
              <label className="field">
                Number of images
                <select
                  value={count}
                  onChange={(e) => setCount(Number(e.target.value))}
                  disabled={pending}
                >
                  {[1, 2, 3, 4].map((n) => (
                    <option key={n} value={n}>
                      {n} image{n > 1 ? "s" : ""}
                    </option>
                  ))}
                </select>
              </label>
            </>
          ) : (
            <>
              <label className="field">
                Product name
                <input
                  required
                  maxLength={100}
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                  disabled={pending}
                  placeholder="Daily face serum"
                />
              </label>
              <label className="field">
                Category
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  disabled={pending}
                >
                  {[
                    "Beauty",
                    "Fashion",
                    "Technology",
                    "Home",
                    "Food",
                    "Health",
                    "Fitness",
                    "Other",
                  ].map((s) => (
                    <option key={s}>{s}</option>
                  ))}
                </select>
              </label>
              <label className="field">
                Tagline
                <input
                  maxLength={160}
                  value={tagline}
                  onChange={(e) => setTagline(e.target.value)}
                  disabled={pending}
                  placeholder="Your exact campaign headline"
                />
              </label>
              <label className="field">
                Product description
                <textarea
                  maxLength={2000}
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  disabled={pending}
                  placeholder="What makes your product different?"
                />
              </label>
              <details>
                <summary className="cursor-pointer text-sm font-medium">
                  Brand direction
                </summary>
                <div className="mt-4 space-y-4">
                  <label className="field">
                    Brand name
                    <input
                      maxLength={100}
                      value={brand}
                      onChange={(e) => setBrand(e.target.value)}
                      disabled={pending}
                    />
                  </label>
                  <label className="field">
                    Brand tone
                    <input
                      maxLength={300}
                      value={tone}
                      onChange={(e) => setTone(e.target.value)}
                      disabled={pending}
                    />
                  </label>
                </div>
              </details>
            </>
          )}
          {error && (
            <p
              role="alert"
              className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700"
            >
              {error}
            </p>
          )}
          <Button
            type="submit"
            className="w-full"
            disabled={
              pending ||
              busyImage !== null ||
              initialProject?.status === "IN_PROGRESS" ||
              (typeof session?.user?.tokens === "number" &&
                session.user.tokens < cost)
            }
          >
            {pending
              ? "Creating your images…"
              : `Generate ${kind === "campaign" ? "campaign" : "shots"} · ${cost} credit${cost > 1 ? "s" : ""}`}
          </Button>
          <p className="text-xs leading-5 text-muted-foreground">
            Failed requests refund your credits. Generation can take a few
            minutes. Your results are saved automatically.
          </p>
          {projectId && (
            <Link
              href="/generate"
              className="block text-center text-sm underline"
            >
              Start a different project
            </Link>
          )}
        </form>
        <section
          aria-label="Generated images"
          aria-live="polite"
          className="min-w-0"
        >
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-lg font-medium">
              {images.length
                ? `Your images (${images.length})`
                : "Your next creative direction"}
            </h2>
            {images.length > 0 && (
              <Link
                href="/submissions"
                className="text-xs text-muted-foreground"
              >
                Saved to your projects ↗
              </Link>
            )}
          </div>
          {pending && (
            <div className="mb-6 grid gap-4 sm:grid-cols-2">
              {Array.from({ length: cost }).map((_, i) => (
                <div
                  key={i}
                  className="aspect-square animate-pulse rounded-xl bg-secondary"
                >
                  <div className="p-6 text-sm text-muted-foreground">
                    Composing image {i + 1}…
                  </div>
                </div>
              ))}
            </div>
          )}
          {images.length ? (
            <div className="grid gap-6 sm:grid-cols-2">
              {images.map((image, i) => (
                <article
                  key={image.id || `${image.imageUrl}-${i}`}
                  className="overflow-hidden rounded-xl border"
                >
                  <div className="aspect-square bg-secondary">
                    <img
                      src={image.imageUrl}
                      alt={
                        image.title ||
                        image.prompt ||
                        "Generated product photograph"
                      }
                      className="h-full w-full object-contain"
                    />
                  </div>
                  <div className="p-4">
                    <p className="mb-3 truncate text-sm font-medium">
                      {image.title || "Product shot"}
                      {image.id && busyImage === image.id
                        ? " · Creating variation…"
                        : ""}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => download(image)}
                      >
                        <ArrowDownIcon size={16} className="mr-2" />
                        Download
                      </Button>
                      <Button asChild variant="outline" size="sm">
                        <Link
                          href={`/editor/${image.id || projectId}?image=${encodeURIComponent(image.imageUrl)}`}
                        >
                          <PencilSimpleIcon size={16} className="mr-2" />
                          Edit
                        </Link>
                      </Button>
                      {image.id && (
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          disabled={
                            !!busyImage ||
                            pending ||
                            (session?.user?.tokens ?? 0) < 1
                          }
                          onClick={() => variation(image)}
                        >
                          <CopyIcon size={16} className="mr-2" />
                          Variation · 1 credit
                        </Button>
                      )}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            !pending && (
              <div className="flex min-h-[480px] flex-col items-center justify-center rounded-xl border border-dashed bg-secondary/30 p-8 text-center">
                <CameraIcon
                  size={40}
                  weight="thin"
                  className="text-muted-foreground"
                />
                <h3 className="mt-6 text-xl font-medium">
                  Give your product a new setting.
                </h3>
                <p className="mt-3 max-w-sm text-sm leading-6 text-muted-foreground">
                  Upload a photo and describe the shot. Your generated images
                  will appear here, ready to download or refine.
                </p>
                <div className="mt-8 flex flex-wrap justify-center gap-2">
                  {[
                    "Soft morning light",
                    "Warm stone surface",
                    "Clean studio",
                  ].map((text) => (
                    <button
                      type="button"
                      key={text}
                      className="rounded-full border px-3 py-2 text-xs hover:bg-secondary"
                      onClick={() => {
                        setPrompt(
                          `Product photograph with ${text.toLowerCase()}, balanced composition and careful attention to the original product.`,
                        );
                      }}
                    >
                      {text}
                    </button>
                  ))}
                </div>
              </div>
            )
          )}
        </section>
      </div>
    </div>
  );
}
