import { FabricImage } from "fabric";
import React from "react";
import { useCanvasHook } from "@/context/canvas-provider";

const ImageUpload = () => {
  const { canvasEditor } = useCanvasHook();
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      console.log(file);
    }

    const canvasImageRef = await FabricImage.fromURL(
      "https://res.cloudinary.com/dtr7khiig/image/upload/v1751676833/ai-creatives/generated/instagram_post-b985b7bb-2cf1-4ba9-a430-c11db7f365aa.png",
    );
    canvasImageRef.set({
      width: 300,
      height: 300,
      // scaleX: 1,
      // scaleY: 1,
    });
    canvasEditor?.add(canvasImageRef);
    canvasEditor?.renderAll();
  };
  return (
    <div>
      <h3>Image Upload</h3>
      <input type="file" accept="image/*" onChange={handleImageUpload} />
    </div>
  );
};

export default ImageUpload;
