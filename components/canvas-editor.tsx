"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Canvas, FabricImage, Textbox, Rect } from "fabric";
import { Button } from "@/components/ui/button";
import { saveDesign } from "@/actions/save-design";
import { toast } from "sonner";
export default function CanvasEditor({
  imageUrl,
  document,
}: {
  imageUrl: string;
  document?: string;
}) {
  const element = useRef<HTMLCanvasElement>(null);
  const container = useRef<HTMLDivElement>(null);
  const canvas = useRef<Canvas | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [color, setColor] = useState("#1d222b");
  const [dirty, setDirty] = useState(false);
  useEffect(() => {
    if (!element.current || !container.current) return;
    let active = true;
    const c = new Canvas(element.current, {
      width: 800,
      height: 800,
      backgroundColor: "#fafbfc",
      preserveObjectStacking: true,
    });
    canvas.current = c;
    const resize = () => {
      const width = Math.min((container.current?.clientWidth || 816) - 16, 800);
      c.setDimensions(
        { width, height: (width * c.height) / c.width },
        { cssOnly: true },
      );
    };
    const observer = new ResizeObserver(resize);
    observer.observe(container.current);
    resize();
    const changed = () => {
      if (active) setDirty(true);
    };
    (async () => {
      try {
        if (document) {
          const saved = JSON.parse(document);
          c.setDimensions({
            width: saved.width || 800,
            height: saved.height || 800,
          });
          await c.loadFromJSON(saved);
        } else {
          const photo = await FabricImage.fromURL(imageUrl, {
            crossOrigin: "anonymous",
          });
          const width = photo.width;
          const height = photo.height;
          c.setDimensions({ width, height });
          photo.set({
            left: 0,
            top: 0,
            originX: "left",
            originY: "top",
            selectable: false,
            evented: false,
          });
          c.add(photo);
        }
        for (const object of c.getObjects()) {
          if (object instanceof FabricImage)
            object.set({
              left: 0,
              top: 0,
              originX: "left",
              originY: "top",
              selectable: false,
              evented: false,
            });
        }
        if (active) {
          c.requestRenderAll();
          setLoaded(true);
          setDirty(false);
          c.on("object:modified", changed);
          c.on("object:added", changed);
          c.on("object:removed", changed);
          resize();
        }
      } catch {
        if (active)
          setError(
            "Could not open this image. Please return to your project and try again.",
          );
      }
    })();
    return () => {
      active = false;
      observer.disconnect();
      c.dispose();
      canvas.current = null;
    };
  }, [imageUrl, document]);
  useEffect(() => {
    if (!dirty) return;
    const warn = (event: BeforeUnloadEvent) => {
      event.preventDefault();
    };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);
  function addText() {
    const c = canvas.current;
    if (!c) return;
    const text = new Textbox("Your headline", {
      originX: "left",
      originY: "top",
      left: c.width * 0.1,
      top: c.height * 0.1,
      width: c.width * 0.65,
      fontSize: c.width * 0.05,
      fontFamily: "GeistSans",
      fill: color,
    });
    c.add(text);
    c.setActiveObject(text);
    c.requestRenderAll();
  }
  function addShape() {
    const c = canvas.current;
    if (!c) return;
    const shape = new Rect({
      originX: "left",
      originY: "top",
      left: c.width * 0.1,
      top: c.height * 0.65,
      width: c.width * 0.5,
      height: c.height * 0.15,
      fill: color,
    });
    c.add(shape);
    c.setActiveObject(shape);
    c.requestRenderAll();
  }
  function remove() {
    const c = canvas.current;
    const selected = c?.getActiveObjects() || [];
    selected
      .filter((object) => object.selectable)
      .forEach((object) => c?.remove(object));
    c?.discardActiveObject();
    c?.requestRenderAll();
  }
  function changeColor(value: string) {
    setColor(value);
    const c = canvas.current;
    const object = c?.getActiveObject();
    if (object && !(object instanceof FabricImage)) {
      object.set("fill", value);
      c?.requestRenderAll();
      setDirty(true);
    }
  }
  async function save() {
    const c = canvas.current;
    if (!c) return;
    setSaving(true);
    try {
      const result = await saveDesign(
        imageUrl,
        JSON.stringify({ ...c.toJSON(), width: c.width, height: c.height }),
      );
      if (!result.success) throw new Error(result.error);
      setDirty(false);
      toast.success("Design saved");
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Could not save your design",
      );
    } finally {
      setSaving(false);
    }
  }
  function exportImage() {
    try {
      const c = canvas.current;
      if (!c) return;
      c.discardActiveObject();
      c.requestRenderAll();
      const a = window.document.createElement("a");
      a.href = c.toDataURL({ format: "png", multiplier: 1 });
      a.download = "stillframe-design.png";
      a.click();
    } catch {
      toast.error("Could not export this design. Please try again.");
    }
  }
  return (
    <div className="studio-page">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <Link href="/submissions" className="text-sm text-muted-foreground">
            ← Your projects
          </Link>
          <h1 className="mt-3 text-3xl font-medium">The finishing touches.</h1>
          <p className="mt-3 text-sm text-muted-foreground">
            Add a headline, set the color, and move elements directly on the
            canvas.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-muted-foreground">
            {dirty ? "Unsaved changes" : "Saved"}
          </span>
          <Button onClick={save} disabled={!loaded || saving}>
            {saving ? "Saving…" : "Save design"}
          </Button>
          <Button variant="outline" onClick={exportImage} disabled={!loaded}>
            Export PNG
          </Button>
        </div>
      </div>
      <div className="mb-6 flex flex-wrap items-center gap-3 rounded-xl border p-4">
        <Button variant="outline" onClick={addText} disabled={!loaded}>
          Add text
        </Button>
        <Button variant="outline" onClick={addShape} disabled={!loaded}>
          Add rectangle
        </Button>
        <label className="flex items-center gap-2 text-sm">
          Color
          <input
            type="color"
            value={color}
            onChange={(e) => changeColor(e.target.value)}
            disabled={!loaded}
            className="h-8 w-8 cursor-pointer"
          />
        </label>
        <Button variant="ghost" onClick={remove} disabled={!loaded}>
          Delete selection
        </Button>
      </div>
      {error && (
        <p role="alert" className="mb-6 text-sm text-red-700">
          {error}
        </p>
      )}
      <div
        ref={container}
        className="mx-auto max-w-full overflow-auto rounded-xl border bg-secondary p-2"
        aria-label="Design canvas"
      >
        <canvas ref={element} aria-label="Product image canvas" />
      </div>
      {!loaded && !error && (
        <p
          role="status"
          className="mt-4 animate-pulse text-sm text-muted-foreground"
        >
          Opening your image…
        </p>
      )}
    </div>
  );
}
