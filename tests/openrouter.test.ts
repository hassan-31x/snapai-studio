import { afterEach, describe, expect, it, vi } from "vitest";
import { generateImage } from "@/lib/openrouter";
afterEach(() => {
  vi.unstubAllGlobals();
  vi.unstubAllEnvs();
});
describe("OpenRouter image protocol", () => {
  it("sends references through the image API and parses base64 bytes", async () => {
    vi.stubEnv("OPENROUTER_API_KEY", "test-key");
    const fetch = vi
      .fn()
      .mockResolvedValue(
        Response.json({
          data: [
            {
              b64_json: Buffer.from("image-bytes").toString("base64"),
              media_type: "image/png",
            },
          ],
        }),
      );
    vi.stubGlobal("fetch", fetch);
    const result = await generateImage(
      "Product photograph",
      ["data:image/png;base64,eA=="],
      "3:2",
    );
    expect(result.toString()).toBe("image-bytes");
    expect(fetch.mock.calls[0][0]).toBe("https://openrouter.ai/api/v1/images");
    const body = JSON.parse(fetch.mock.calls[0][1].body);
    expect(body.aspect_ratio).toBe("3:2");
    expect(body.input_references).toEqual([
      { type: "image_url", image_url: { url: "data:image/png;base64,eA==" } },
    ]);
  });
  it("fails explicitly instead of returning stock images", async () => {
    vi.stubEnv("OPENROUTER_API_KEY", "test-key");
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(Response.json({ data: [] })),
    );
    await expect(generateImage("Prompt", [])).rejects.toThrow("No image");
  });
  it("handles provider throttling without a retry that can double charge", async () => {
    vi.stubEnv("OPENROUTER_API_KEY", "test-key");
    const fetch = vi.fn().mockResolvedValue(new Response("", { status: 429 }));
    vi.stubGlobal("fetch", fetch);
    await expect(generateImage("Prompt", [])).rejects.toThrow("busy");
    expect(fetch).toHaveBeenCalledTimes(1);
  });
});
