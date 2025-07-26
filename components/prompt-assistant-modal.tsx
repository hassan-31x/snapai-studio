"use client";

import React, { useState, useTransition } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Sparkles, Wand2 } from "lucide-react";
import { generatePromptAssistance, PromptAssistantParams } from "@/actions/prompt-assistance";

interface PromptAssistantModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onPromptGenerated: (prompt: string) => void;
}

const productTypes = [
  "Electronics & Tech",
  "Fashion & Accessories", 
  "Beauty & Skincare",
  "Food & Beverages",
  "Home & Decor",
  "Sports & Fitness",
  "Jewelry & Watches",
  "Books & Stationery",
  "Toys & Games",
  "Other"
];

const productStyles = [
  "Modern & Sleek",
  "Classic & Elegant", 
  "Minimalist & Clean",
  "Bold & Dramatic",
  "Vintage & Retro",
  "Luxury & Premium",
  "Casual & Everyday",
  "Industrial & Urban",
  "Natural & Organic",
  "Artistic & Creative"
];

const settings = [
  "Professional Studio",
  "Natural Outdoor",
  "Home Environment", 
  "Office Setting",
  "Luxury Interior",
  "Industrial Space",
  "Minimalist Background",
  "Lifestyle Context",
  "Abstract/Artistic",
  "Custom Setting"
];

const moods = [
  "Professional & Clean",
  "Warm & Inviting",
  "Bold & Energetic", 
  "Calm & Serene",
  "Luxury & Sophisticated",
  "Fresh & Modern",
  "Cozy & Comfortable",
  "Dynamic & Active",
  "Elegant & Refined",
  "Fun & Playful"
];

export function PromptAssistantModal({ open, onOpenChange, onPromptGenerated }: PromptAssistantModalProps) {
  const [formData, setFormData] = useState<PromptAssistantParams>({
    productName: "",
    productType: "",
    productStyle: "",
    setting: "",
    mood: "",
    keyFeatures: ""
  });
  
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (field: keyof PromptAssistantParams, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setError(null);
  };

  const isFormValid = () => {
    return formData.productName.trim() &&
           formData.productType && 
           formData.productStyle && 
           formData.setting && 
           formData.mood && 
           formData.keyFeatures.trim();
  };

  const handleGenerate = () => {
    if (!isFormValid()) {
      setError("Please fill in all fields");
      return;
    }

    startTransition(async () => {
      try {
        const result = await generatePromptAssistance(formData);
        
        if (result.success && result.prompt) {
          onPromptGenerated(result.prompt);
          onOpenChange(false);
          // Reset form
          setFormData({
            productName: "",
            productType: "",
            productStyle: "",
            setting: "",
            mood: "",
            keyFeatures: ""
          });
        } else {
          setError(result.error || "Failed to generate prompt");
        }
      } catch (error) {
        console.error("Error generating prompt:", error);
        setError("An unexpected error occurred");
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-violet-600" />
            Prompt Assistant
          </DialogTitle>
          <p className="text-sm text-slate-600">
            Tell us about your product and we&apos;ll create the perfect prompt for your shot
          </p>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Product Name */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-slate-700">Product Name or Description</Label>
            <Input
              placeholder="e.g., iPhone 15 Pro, Nike Air Max, Organic Face Cream..."
              value={formData.productName}
              onChange={(e) => handleInputChange("productName", e.target.value)}
              className="h-10"
            />
            <p className="text-xs text-slate-500">
              What specific product are you photographing?
            </p>
          </div>

          {/* Product Type */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-slate-700">Product Type</Label>
            <Select 
              value={formData.productType} 
              onValueChange={(value) => handleInputChange("productType", value)}
            >
              <SelectTrigger className="h-10">
                <SelectValue placeholder="Select your product type" />
              </SelectTrigger>
              <SelectContent>
                {productTypes.map((type) => (
                  <SelectItem key={type} value={type}>{type}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Product Style */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-slate-700">Product Style</Label>
            <Select 
              value={formData.productStyle} 
              onValueChange={(value) => handleInputChange("productStyle", value)}
            >
              <SelectTrigger className="h-10">
                <SelectValue placeholder="Choose the style that fits your product" />
              </SelectTrigger>
              <SelectContent>
                {productStyles.map((style) => (
                  <SelectItem key={style} value={style}>{style}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Setting */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-slate-700">Setting & Environment</Label>
            <Select 
              value={formData.setting} 
              onValueChange={(value) => handleInputChange("setting", value)}
            >
              <SelectTrigger className="h-10">
                <SelectValue placeholder="Where should your product be photographed?" />
              </SelectTrigger>
              <SelectContent>
                {settings.map((setting) => (
                  <SelectItem key={setting} value={setting}>{setting}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Mood */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-slate-700">Desired Mood</Label>
            <Select 
              value={formData.mood} 
              onValueChange={(value) => handleInputChange("mood", value)}
            >
              <SelectTrigger className="h-10">
                <SelectValue placeholder="What feeling should the image convey?" />
              </SelectTrigger>
              <SelectContent>
                {moods.map((mood) => (
                  <SelectItem key={mood} value={mood}>{mood}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Key Features */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-slate-700">Key Features to Highlight</Label>
            <Textarea
              placeholder="Describe the key features, benefits, or unique aspects you want to showcase (e.g., sleek design, premium materials, innovative technology...)"
              value={formData.keyFeatures}
              onChange={(e) => handleInputChange("keyFeatures", e.target.value)}
              className="min-h-[80px] resize-none"
            />
            <p className="text-xs text-slate-500">
              Tell us what makes your product special and what should stand out in the photo
            </p>
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
            onClick={() => onOpenChange(false)}
            disabled={pending}
          >
            Cancel
          </Button>
          
          <Button
            onClick={handleGenerate}
            disabled={!isFormValid() || pending}
            className="bg-violet-600 hover:bg-violet-700"
          >
            {pending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Wand2 className="mr-2 h-4 w-4" />
                Generate Prompt
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
