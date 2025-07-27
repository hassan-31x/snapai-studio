"use client";

import React, { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Loader2, Copy, ArrowUp, Download } from "lucide-react";
import { generateImageVariations, upscaleImage } from "@/actions/image-variations";

interface ImageActionsProps {
  image: {
    id: string;
    imageUrl: string;
    prompt: string;
    aspectRatio: string;
    scene: string;
  };
  onVariationsGenerated: (variations: Array<{
    id: string;
    imageUrl: string;
    prompt: string;
    aspectRatio: string;
    scene: string;
  }>) => void;
  onVariationsStarted: (numberOfVariations: number) => void; // New callback for loading state
  onImageUpscaled: (upscaledImage: {
    id: string;
    imageUrl: string;
    prompt: string;
    aspectRatio: string;
    scene: string;
  }) => void;
  userId: string;
}

export function ImageActions({ image, onVariationsGenerated, onVariationsStarted, onImageUpscaled, userId }: ImageActionsProps) {
  const [showVariationsDialog, setShowVariationsDialog] = useState(false);
  const [numberOfVariations, setNumberOfVariations] = useState(2);
  const [variationsPending, startVariationsTransition] = useTransition();
  const [upscalePending, startUpscaleTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const handleGenerateVariations = () => {
    // Close modal immediately
    setShowVariationsDialog(false);
    
    // Notify parent to show loading placeholders
    onVariationsStarted(numberOfVariations);
    
    startVariationsTransition(async () => {
      try {
        const result = await generateImageVariations({
          originalImageId: image.id,
          numberOfVariations,
          userId
        });

        if (result.success && result.variations) {
          onVariationsGenerated(result.variations);
          setError(null);
        } else {
          setError(result.error || "Failed to generate variations");
        }
      } catch (error) {
        console.error("Error generating variations:", error);
        setError("An unexpected error occurred");
      }
    });
  };

  const handleUpscale = () => {
    startUpscaleTransition(async () => {
      try {
        const result = await upscaleImage({
          originalImageId: image.id,
          userId
        });

        if (result.success && result.upscaledImage) {
          onImageUpscaled(result.upscaledImage);
          setError(null);
        } else {
          setError(result.error || "Failed to upscale image");
        }
      } catch (error) {
        console.error("Error upscaling image:", error);
        setError("An unexpected error occurred");
      }
    });
  };

  const downloadImage = async () => {
    const response = await fetch(image.imageUrl);
    const blob = await response.blob();
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `product-shot-${image.id}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
  };

  return (
    <TooltipProvider>
      {/* Hover Actions */}
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
        <div className="flex items-center gap-1 bg-black/30 backdrop-blur-sm rounded-lg p-1">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowVariationsDialog(true)}
                disabled={variationsPending}
                className="h-8 w-8 p-0 bg-white/90 hover:bg-white text-slate-900 rounded-md hover:text-slate-900"
              >
                <Copy className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Create Variations</p>
            </TooltipContent>
          </Tooltip>
          
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleUpscale}
                disabled={true}
                // disabled={upscalePending}
                className="h-8 w-8 p-0 bg-white/90 hover:bg-white text-slate-900 rounded-md hover:text-slate-900"
              >
                {upscalePending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <ArrowUp className="h-4 w-4" />
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Upscale Image</p>
            </TooltipContent>
          </Tooltip>
          
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                onClick={downloadImage}
                className="h-8 w-8 p-0 bg-white/90 hover:bg-white text-slate-900 rounded-md hover:text-slate-900"
              >
                <Download className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Download Image</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </div>

      {/* Variations Dialog */}
      <Dialog open={showVariationsDialog} onOpenChange={setShowVariationsDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Copy className="h-5 w-5 text-violet-600" />
              Generate Variations
            </DialogTitle>
            <p className="text-sm text-slate-600">
              Create variations of this image with similar style but different details
            </p>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* Number of Variations */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium text-slate-700">Number of Variations</Label>
                <span className="text-sm font-medium text-violet-600">{numberOfVariations}</span>
              </div>
              <Slider
                value={[numberOfVariations]}
                onValueChange={(value) => setNumberOfVariations(value[0])}
                max={4}
                min={1}
                step={1}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-slate-500">
                <span>1 variation</span>
                <span>4 variations</span>
              </div>
            </div>

            {/* Original Image Preview */}
            <div className="space-y-2">
              <Label className="text-sm font-medium text-slate-700">Original Image</Label>
              <div className="aspect-square bg-slate-100 rounded-lg overflow-hidden">
                <img
                  src={image.imageUrl}
                  alt="Original"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between pt-4 border-t">
            <Button
              variant="outline"
              onClick={() => setShowVariationsDialog(false)}
              disabled={variationsPending}
            >
              Cancel
            </Button>
            
            <Button
              onClick={handleGenerateVariations}
              disabled={variationsPending}
              className="bg-violet-600 hover:bg-violet-700"
            >
              {variationsPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Copy className="mr-2 h-4 w-4" />
                  Generate {numberOfVariations} Variation{numberOfVariations > 1 ? 's' : ''}
                </>
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </TooltipProvider>
  );
}
