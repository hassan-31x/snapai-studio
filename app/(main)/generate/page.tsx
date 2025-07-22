"use client";

import React, { useState, useTransition } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { submitProductAction } from "@/actions/submit-product";
import { generateProductShotsAction } from "@/actions/generate-product-shots";
import { 
  CheckCircle, 
  Image as ImageIcon, 
  Loader2, 
  Upload, 
  Sparkles, 
  ArrowRight, 
  Download,
  Instagram,
  Linkedin,
  Facebook,
  Twitter,
  Globe,
  LayoutTemplate,
  FileText as TextIcon,
  Wand2,
  Settings,
  Camera,
  X,
  Plus
} from "lucide-react";
import { useSession } from "next-auth/react";
import { AIAssistantModal } from "@/components/ai-assistant-modal";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Slider } from "@/components/ui/slider";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const initialForm = {
  productName: "",
  productTagline: "",
  productImage: null,
  productCategory: "",
  highlightedBenefit: "",
  productDescription: "",
  // Advanced fields
  brandName: "LUMISÉRA",
  brandTone: "Luxury skincare — clean, calm, and elegant.",
  colorTheme: "Deep sea blues, emerald greens, warm golds, and beige.",
  backgroundStyle: "Soft gradients or realistic textures like water, marble, or satin.",
  lightingStyle: "Always soft, diffused lighting with a subtle spotlight effect and gentle reflections.",
  productPlacement: "The product should feel grounded, not floating — placed on surfaces like trays, marble slabs, or fabric. Props like flower petals, ribbons, or boxes can be used sparingly.",
  typographyStyle: "Use serif fonts in uppercase for titles. For secondary text, use thin script or modern sans-serif. Font color should be white, soft gold, or dark green — never harsh.",
  compositionGuidelines: "Maintain clean symmetry or elegant off-center balance. Always leave intentional space around the product. Keep supporting elements minimal and refined."
};

const initialProductShotForm = {
  prompt: "",
  aspectRatio: "1024x1024",
  scene: "",
  numberOfImages: 1
};

const categories = [
  "Technology", "Fashion", "Home", "Beauty", "Health", "Food", "Fitness", 
  "Productivity", "Entertainment", "Education", "Eco-Friendly"
];

const scenes = [
  {
    id: "studio",
    name: "Studio",
    description: "Clean, professional studio setup",
    image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=200&h=120&fit=crop",
    prompt: "Professional studio lighting with clean white background, commercial photography setup"
  },
  {
    id: "outdoor",
    name: "Outdoor",
    description: "Natural outdoor environment",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=200&h=120&fit=crop",
    prompt: "Natural outdoor setting with soft daylight, organic environment"
  },
  {
    id: "luxury",
    name: "Premium Luxury",
    description: "High-end luxury setting",
    image: "https://images.unsplash.com/photo-1618220179428-22790b461013?w=200&h=120&fit=crop",
    prompt: "Premium luxury setting with marble surfaces, gold accents, and sophisticated lighting"
  },
  {
    id: "minimal",
    name: "Minimal Aesthetics",
    description: "Clean, minimalist design",
    image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=200&h=120&fit=crop",
    prompt: "Minimalist aesthetic with clean lines, neutral tones, and negative space"
  },
  {
    id: "lifestyle",
    name: "Lifestyle",
    description: "Real-life usage scenario",
    image: "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=200&h=120&fit=crop",
    prompt: "Lifestyle photography showing natural usage in everyday environment"
  },
  {
    id: "artistic",
    name: "Artistic",
    description: "Creative artistic composition",
    image: "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=200&h=120&fit=crop",
    prompt: "Artistic composition with creative lighting, shadows, and artistic elements"
  },
  {
    id: "industrial",
    name: "Industrial",
    description: "Modern industrial setting",
    image: "https://images.unsplash.com/photo-1565814329452-e1efa11c5b89?w=200&h=120&fit=crop",
    prompt: "Industrial setting with concrete, metal textures, and modern architecture"
  },
  {
    id: "nature",
    name: "Nature",
    description: "Natural elements and textures",
    image: "https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=200&h=120&fit=crop",
    prompt: "Natural setting with organic textures, plants, and earth tones"
  }
];

const aspectRatios = [
  { value: "1024x1024", label: "Square (1:1)", dimensions: "1024 × 1024" },
  { value: "1536x1024", label: "Landscape (3:2)", dimensions: "1536 × 1024" },
  { value: "1024x1536", label: "Portrait (2:3)", dimensions: "1024 × 1536" }
];

const Generate = () => {
  const [creationType, setCreationType] = useState<"ad_creative" | "product_shot">("ad_creative");
  const [form, setForm] = useState(initialForm);
  const [productShotForm, setProductShotForm] = useState(initialProductShotForm);
  const [file, setFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [similarImages, setSimilarImages] = useState<File[]>([]);
  const [result, setResult] = useState<any>(null);
  const [pending, startTransition] = useTransition();
  const [activeTab, setActiveTab] = useState<string>("form");
  const [showAIModal, setShowAIModal] = useState(false);
  const [showSceneModal, setShowSceneModal] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const { data: session } = useSession();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type, files } = e.target as any;
    if (type === "file" && files && files[0]) {
      setFile(files[0]);
      const reader = new FileReader();
      reader.onload = (e) => {
        setFilePreview(e.target?.result as string);
      };
      reader.readAsDataURL(files[0]);
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleCategoryChange = (value: string) => {
    setForm((prev) => ({ ...prev, productCategory: value }));
  };

  const handleAIDataGenerated = (data: any) => {
    setForm((prev) => ({
      ...prev,
      brandName: data.brandName || prev.brandName,
      brandTone: data.brandTone || prev.brandTone,
      colorTheme: data.colorTheme || prev.colorTheme,
      backgroundStyle: data.backgroundStyle || prev.backgroundStyle,
      lightingStyle: data.lightingStyle || prev.lightingStyle,
      productPlacement: data.productPlacement || prev.productPlacement,
      typographyStyle: data.typographyStyle || prev.typographyStyle,
      compositionGuidelines: data.compositionGuidelines || prev.compositionGuidelines
    }));
  };

  const handleProductShotChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProductShotForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleAspectRatioChange = (value: string) => {
    setProductShotForm((prev) => ({ ...prev, aspectRatio: value }));
  };

  const handleSceneSelect = (sceneId: string) => {
    setProductShotForm((prev) => ({ ...prev, scene: sceneId }));
    setShowSceneModal(false);
  };

  const handleSimilarImagesUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setSimilarImages(files);
  };

  const removeSimilarImage = (index: number) => {
    setSimilarImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleNumberOfImagesChange = (value: number[]) => {
    setProductShotForm((prev) => ({ ...prev, numberOfImages: value[0] }));
  };

  // Helper function to get grid layout based on number of images
  const getGridLayout = (numberOfImages: number) => {
    // Always show 4 columns for better layout
    return "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4";
  };

  // Helper function to get aspect ratio class
  const getAspectRatioClass = (aspectRatio: string) => {
    switch (aspectRatio) {
      case "1024x1024":
        return "aspect-square";
      case "1536x1024":
        return "aspect-[3/2]";
      case "1024x1536":
        return "aspect-[2/3]";
      default:
        return "aspect-square";
    }
  };

  // Helper function to render loading placeholders
  const renderLoadingPlaceholders = () => {
    const numberOfImages = creationType === "product_shot" ? productShotForm.numberOfImages : 5;
    const aspectRatio = creationType === "product_shot" ? productShotForm.aspectRatio : "1024x1024";
    
    return Array.from({ length: numberOfImages }, (_, index) => (
      <div
        key={index}
        className={`${getAspectRatioClass(aspectRatio)} bg-slate-100 rounded-xl border border-slate-200 flex items-center justify-center relative overflow-hidden max-w-sm mx-auto w-full`}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-violet-50 to-purple-50 opacity-50" />
        <div className="relative flex flex-col items-center justify-center space-y-3">
          <div className="relative">
            <div className="w-8 h-8 border-4 border-violet-200 border-t-violet-600 rounded-full animate-spin" />
          </div>
          <div className="text-center">
            <p className="text-sm font-medium text-slate-700">Generating...</p>
            <p className="text-xs text-slate-500">Image {index + 1}</p>
          </div>
        </div>
      </div>
    ));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      if (value) formData.append(key, value as string);
    });
    if (file) formData.append("productImage", file);
    formData.append("userId", session?.user?.id || "");
    setResult(null);
    setIsGenerating(true);
    
    startTransition(async () => {
      try {
        const res = await submitProductAction(formData);
        setResult(res);
        setIsGenerating(false);
      } catch (error) {
        console.error("Error submitting product:", error);
        setIsGenerating(false);
        // Handle error state
      }
    });
  };

  const handleProductShotSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !productShotForm.prompt.trim()) return;

    const formData = new FormData();
    formData.append("userId", session?.user?.id || "");
    formData.append("prompt", productShotForm.prompt);
    formData.append("aspectRatio", productShotForm.aspectRatio);
    formData.append("scene", productShotForm.scene);
    formData.append("numberOfImages", productShotForm.numberOfImages.toString());
    formData.append("productImage", file);
    
    // Add similar images
    similarImages.forEach((img, index) => {
      formData.append(`similarImage_${index}`, img);
    });

    setResult(null);
    setIsGenerating(true);
    
    startTransition(async () => {
      try {
        const res = await generateProductShotsAction(formData);
        setResult(res);
        setIsGenerating(false);
      } catch (error) {
        console.error("Error generating product shots:", error);
        setIsGenerating(false);
        // Handle error state
      }
    });
  };

  const isFormValid = () => {
    if (creationType === "ad_creative") {
      return (
        form.productName &&
        form.productTagline &&
        form.productCategory &&
        form.productDescription &&
        file
      );
    } else {
      return (
        file &&
        productShotForm.prompt.trim() &&
        productShotForm.scene
      );
    }
  };

  // Use the API response directly instead of creating mock data
  const enhancedResults = result || null;

  // Function to get the appropriate icon for each social media type
  const getSocialIcon = (type: string) => {
    switch (type) {
      case "instagram_story":
      case "instagram_post":
        return <Instagram className="h-5 w-5" />;
      case "facebook_post":
        return <Facebook className="h-5 w-5" />;
      case "linkedin_post":
        return <Linkedin className="h-5 w-5" />;
      case "twitter_post":
        return <Twitter className="h-5 w-5" />;
      case "website_banner":
        return <Globe className="h-5 w-5" />;
      default:
        return <LayoutTemplate className="h-5 w-5" />;
    }
  };

  // Helper to download a single image
  const downloadImage = async (url: string, filename: string) => {
    const response = await fetch(url);
    const blob = await response.blob();
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
  };

  // Helper to download all images
  const downloadAllImages = async () => {
    if (creationType === "product_shot" && result?.images) {
      for (const [index, image] of result.images.entries()) {
        await downloadImage(image.imageUrl, `product-shot-${index + 1}.png`);
      }
    } else if (result?.creatives) {
      for (const creative of result.creatives) {
        const filename = `${creative.title.replace(/\s+/g, '_').toLowerCase()}.png`;
        await downloadImage(creative.imageUrl, filename);
      }
    }
  };

  return (
    <div className="flex h-screen bg-slate-50/30 overflow-hidden">
      {/* Sidebar */}
      <div className="w-80 bg-white border-r border-slate-200/60 flex flex-col">
        <div className="p-6 border-b border-slate-200/60">
          <h2 className="text-lg font-semibold text-slate-900">Product Settings</h2>
          <p className="text-sm text-slate-500 mt-1">Configure your product details</p>
        </div>
         <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Creation Type Dropdown */}
          <div className="space-y-3">
            <Label className="text-sm font-medium text-slate-700">Creation Type</Label>
            <Select value={creationType} onValueChange={(value: "ad_creative" | "product_shot") => setCreationType(value)}>
              <SelectTrigger className="h-9 text-sm border-slate-200 focus:border-violet-300 focus:ring-violet-200">
                <SelectValue placeholder="Select creation type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ad_creative">Ad Creative</SelectItem>
                <SelectItem value="product_shot">Product Shot</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Product Image Upload - Common for both types */}
          <div className="space-y-3">
            <Label className="text-sm font-medium text-slate-700">Product Image</Label>
            <div className="flex items-center justify-center w-full">
              <label
                htmlFor="productImage"
                className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-slate-200 rounded-xl cursor-pointer bg-slate-50/50 hover:bg-slate-50 transition-colors"
              >
                <div className="flex flex-col items-center justify-center">
                  {filePreview ? (
                    <img
                      src={filePreview}
                      alt="Product preview"
                      className="w-20 h-20 object-cover rounded-lg"
                    />
                  ) : (
                    <Upload className="w-8 h-8 mb-2 text-slate-400" />
                  )}
                  <p className="text-xs text-slate-500">
                    {file ? file.name : "Click to upload"}
                  </p>
                </div>
                <input
                  id="productImage"
                  name="productImage"
                  type="file"
                  accept="image/*"
                  onChange={handleChange}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          {/* Conditional Forms */}
          {creationType === "ad_creative" ? (
            <form id="product-form" onSubmit={handleSubmit} className="space-y-6">
              {/* Product Information */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="productName" className="text-sm font-medium text-slate-700">Product Name</Label>
                  <Input
                    id="productName"
                    name="productName"
                    type="text"
                    required
                    value={form.productName}
                    onChange={handleChange}
                    placeholder="Enter product name"
                    className="h-9 text-sm border-slate-200 focus:border-violet-300 focus:ring-violet-200"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="productCategory" className="text-sm font-medium text-slate-700">Category</Label>
                  <Select value={form.productCategory} onValueChange={handleCategoryChange}>
                    <SelectTrigger className="h-9 text-sm border-slate-200 focus:border-violet-300 focus:ring-violet-200">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="productTagline" className="text-sm font-medium text-slate-700">Tagline</Label>
                  <Input
                    id="productTagline"
                    name="productTagline"
                    type="text"
                    required
                    value={form.productTagline}
                    onChange={handleChange}
                    placeholder="Product tagline"
                    className="h-9 text-sm border-slate-200 focus:border-violet-300 focus:ring-violet-200"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="highlightedBenefit" className="text-sm font-medium text-slate-700">Key Benefit</Label>
                  <Input
                    id="highlightedBenefit"
                    name="highlightedBenefit"
                    type="text"
                    value={form.highlightedBenefit}
                    onChange={handleChange}
                    placeholder="Main benefit"
                    className="h-9 text-sm border-slate-200 focus:border-violet-300 focus:ring-violet-200"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="productDescription" className="text-sm font-medium text-slate-700">Description</Label>
                  <Textarea
                    id="productDescription"
                    name="productDescription"
                    required
                    value={form.productDescription}
                    onChange={handleChange}
                    placeholder="Product description"
                    className="text-sm border-slate-200 focus:border-violet-300 focus:ring-violet-200 min-h-[80px] resize-none"
                  />
                </div>
              </div>

              {/* Advanced Settings */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium text-slate-700">Advanced Settings</h3>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowAIModal(true)}
                    className="h-7 px-2 text-xs text-violet-600 hover:text-violet-700 hover:bg-violet-50"
                  >
                    <Sparkles className="h-3 w-3 mr-1" />
                    AI Help
                  </Button>
                </div>

                <div className="space-y-3">
                  <div className="space-y-2">
                    <Label htmlFor="brandName" className="text-xs font-medium text-slate-600">Brand Name</Label>
                    <Input
                      id="brandName"
                      name="brandName"
                      type="text"
                      value={form.brandName}
                      onChange={handleChange}
                      placeholder="Brand name"
                      className="h-8 text-xs border-slate-200 focus:border-violet-300 focus:ring-violet-200"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="brandTone" className="text-xs font-medium text-slate-600">Brand Tone</Label>
                    <Input
                      id="brandTone"
                      name="brandTone"
                      type="text"
                      value={form.brandTone}
                      onChange={handleChange}
                      placeholder="Brand tone"
                      className="h-8 text-xs border-slate-200 focus:border-violet-300 focus:ring-violet-200"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="colorTheme" className="text-xs font-medium text-slate-600">Color Theme</Label>
                    <Input
                      id="colorTheme"
                      name="colorTheme"
                      type="text"
                      value={form.colorTheme}
                      onChange={handleChange}
                      placeholder="Colors"
                      className="h-8 text-xs border-slate-200 focus:border-violet-300 focus:ring-violet-200"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="backgroundStyle" className="text-xs font-medium text-slate-600">Background Style</Label>
                    <Input
                      id="backgroundStyle"
                      name="backgroundStyle"
                      type="text"
                      value={form.backgroundStyle}
                      onChange={handleChange}
                      placeholder="Background"
                      className="h-8 text-xs border-slate-200 focus:border-violet-300 focus:ring-violet-200"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="lightingStyle" className="text-xs font-medium text-slate-600">Lighting Style</Label>
                    <Input
                      id="lightingStyle"
                      name="lightingStyle"
                      type="text"
                      value={form.lightingStyle}
                      onChange={handleChange}
                      placeholder="Lighting"
                      className="h-8 text-xs border-slate-200 focus:border-violet-300 focus:ring-violet-200"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="productPlacement" className="text-xs font-medium text-slate-600">Product Placement</Label>
                    <Input
                      id="productPlacement"
                      name="productPlacement"
                      type="text"
                      value={form.productPlacement}
                      onChange={handleChange}
                      placeholder="Placement"
                      className="h-8 text-xs border-slate-200 focus:border-violet-300 focus:ring-violet-200"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="typographyStyle" className="text-xs font-medium text-slate-600">Typography</Label>
                    <Input
                      id="typographyStyle"
                      name="typographyStyle"
                      type="text"
                      value={form.typographyStyle}
                      onChange={handleChange}
                      placeholder="Typography"
                      className="h-8 text-xs border-slate-200 focus:border-violet-300 focus:ring-violet-200"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="compositionGuidelines" className="text-xs font-medium text-slate-600">Composition</Label>
                    <Textarea
                      id="compositionGuidelines"
                      name="compositionGuidelines"
                      value={form.compositionGuidelines}
                      onChange={handleChange}
                      placeholder="Composition guidelines"
                      className="text-xs border-slate-200 focus:border-violet-300 focus:ring-violet-200 min-h-[60px] resize-none"
                    />
                  </div>
                </div>
              </div>
            </form>
          ) : (
            /* Product Shot Form */
            <div className="space-y-6">
              {/* Aspect Ratio */}
              <div className="space-y-3">
                <Label className="text-sm font-medium text-slate-700">Image Dimensions</Label>
                <div className="grid grid-cols-3 gap-2">
                  {aspectRatios.map((ratio) => (
                    <button
                      key={ratio.value}
                      type="button"
                      onClick={() => handleAspectRatioChange(ratio.value)}
                      className={`
                        flex flex-col items-center justify-center p-3 rounded-lg border-2 transition-all
                        ${productShotForm.aspectRatio === ratio.value 
                          ? 'border-violet-500 bg-violet-50 text-violet-700' 
                          : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                        }
                      `}
                    >
                      <div className={`
                        border-2 rounded mb-2 transition-colors
                        ${productShotForm.aspectRatio === ratio.value 
                          ? 'border-violet-400' 
                          : 'border-slate-300'
                        }
                        ${ratio.value === '1024x1024' ? 'w-4 h-4' : ''}
                        ${ratio.value === '1536x1024' ? 'w-6 h-4' : ''}
                        ${ratio.value === '1024x1536' ? 'w-4 h-6' : ''}
                      `} />
                      <span className="text-xs font-medium">
                        {ratio.value === '1024x1024' ? '1:1' : ''}
                        {ratio.value === '1536x1024' ? '3:2' : ''}
                        {ratio.value === '1024x1536' ? '2:3' : ''}
                      </span>
                      <span className="text-xs text-slate-500 mt-1">{ratio.dimensions}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Similar Images Upload */}
              <div className="space-y-3">
                <Label className="text-sm font-medium text-slate-700">Similar Images (Optional)</Label>
                <div className="flex items-center justify-center w-full">
                  <label
                    htmlFor="similarImages"
                    className="flex flex-col items-center justify-center w-full h-20 border border-dashed border-slate-200 rounded-lg cursor-pointer bg-slate-50/50 hover:bg-slate-50 transition-colors"
                  >
                    <div className="flex items-center justify-center">
                      <Plus className="w-4 h-4 mr-2 text-slate-400" />
                      <span className="text-xs text-slate-500">Add similar images</span>
                    </div>
                    <input
                      id="similarImages"
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleSimilarImagesUpload}
                      className="hidden"
                    />
                  </label>
                </div>
                {similarImages.length > 0 && (
                  <div className="grid grid-cols-3 gap-2">
                    {similarImages.map((img, index) => (
                      <div key={index} className="relative">
                        <img
                          src={URL.createObjectURL(img)}
                          alt={`Similar ${index + 1}`}
                          className="w-full h-16 object-cover rounded border"
                        />
                        <button
                          onClick={() => removeSimilarImage(index)}
                          className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white rounded-full flex items-center justify-center text-xs"
                        >
                          <X className="w-2 h-2" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Scene Selection */}
              <div className="space-y-3">
                <Label className="text-sm font-medium text-slate-700">Scene</Label>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowSceneModal(true)}
                  className="w-full h-20 text-left justify-start p-3"
                >
                  {productShotForm.scene ? (
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-slate-100 rounded overflow-hidden">
                        <img
                          src={scenes.find(s => s.id === productShotForm.scene)?.image}
                          alt="Selected scene"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <p className="font-medium text-sm">{scenes.find(s => s.id === productShotForm.scene)?.name}</p>
                        <p className="text-xs text-slate-500">{scenes.find(s => s.id === productShotForm.scene)?.description}</p>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center text-slate-500">
                      <Camera className="w-4 h-4 mr-2" />
                      <span>Select a scene</span>
                    </div>
                  )}
                </Button>
              </div>

              {/* Number of Images */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-medium text-slate-700">Number of Images</Label>
                  <span className="text-sm font-medium text-violet-600">{productShotForm.numberOfImages}</span>
                </div>
                <Slider
                  value={[productShotForm.numberOfImages]}
                  onValueChange={handleNumberOfImagesChange}
                  max={4}
                  min={1}
                  step={1}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-slate-500">
                  <span>1 image</span>
                  <span>4 images</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="h-16 px-6 border-b border-slate-200/60 bg-white/80 backdrop-blur-sm flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-slate-900">Phoenix 1.0</h1>
            <p className="text-xs text-slate-500">Generate stunning AI creatives</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm text-slate-600">
              <Sparkles className="h-4 w-4 text-violet-500" />
              <span>24 credits</span>
            </div>
            <Button variant="outline" size="sm" className="text-sm">
              Upgrade Plan
            </Button>
          </div>
        </div>

        {/* Main Generation Area */}
        <div className="flex-1 flex flex-col">
          {/* Prompt input - always visible at top when there's content */}
          {(isGenerating || result) && (
            <div className="p-4 border-b border-slate-200/60 bg-white/95 backdrop-blur-sm">
              <div className="max-w-4xl mx-auto">
                <div className="bg-white rounded-xl border border-slate-200/60 p-4 shadow-sm">
                  <div className="space-y-3">
                    {/* Top row with icon and button */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 bg-violet-100 rounded-full flex items-center justify-center">
                          <ImageIcon className="h-3 w-3 text-violet-600" />
                        </div>
                        <span className="text-sm font-medium text-slate-900">
                          {creationType === "ad_creative" ? "Ad Creative Generation" : "Product Shot Generation"}
                        </span>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setResult(null);
                          setIsGenerating(false);
                        }}
                        className="h-8 px-3 text-xs"
                      >
                        New Generation
                      </Button>
                    </div>
                    
                    {/* Full width input */}
                    <div className="w-full">
                      <textarea
                        className="w-full text-sm font-medium text-slate-900 bg-transparent border-none outline-none p-2 rounded border border-slate-200 focus:border-violet-300"
                        value={creationType === "product_shot" ? productShotForm.prompt : "Professional product showcase with elegant lighting"}
                        readOnly
                      />
                    </div>
                    
                    {/* Meta details below input */}
                    <div className="flex items-center justify-center gap-6 text-xs text-slate-500">
                      <div className="flex items-center gap-1">
                        <span>Images:</span>
                        <span className="font-medium">{creationType === "product_shot" ? productShotForm.numberOfImages : 5}</span>
                      </div>
                      <span>•</span>
                      <div className="flex items-center gap-1">
                        <span>Format:</span>
                        <span className="font-medium">{creationType === "product_shot" ? aspectRatios.find(r => r.value === productShotForm.aspectRatio)?.label : "Multiple"}</span>
                      </div>
                      <span>•</span>
                      <div className="flex items-center gap-1">
                        <span>Type:</span>
                        <span className="font-medium">{creationType === "ad_creative" ? "Ad Creative" : "Product Shot"}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Main playground area */}
          <div className="flex-1 p-8 bg-gradient-to-br from-slate-50/50 via-white to-indigo-50/30">
            <div className="max-w-6xl mx-auto h-full">
              {!isGenerating && !result ? (
                /* Initial state - center prompt input */
                <div className="h-full flex flex-col items-center justify-center space-y-6">
                  <div className="w-full max-w-4xl space-y-6">
                    {/* Prompt Input Area */}
                    <div className="bg-white rounded-2xl border border-slate-200/60 p-6 shadow-lg">
                      <div className="space-y-4">
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-violet-100 rounded-full flex items-center justify-center">
                              <ImageIcon className="h-4 w-4 text-violet-600" />
                            </div>
                            <span className="text-sm font-medium text-slate-900">
                              {creationType === "ad_creative" ? "Ad Creative" : "Product Shot"}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 px-3 py-1 bg-blue-50 rounded-full">
                            <span className="text-xs font-medium text-blue-700">
                              {creationType === "ad_creative" ? "Marketing" : "New"}
                            </span>
                          </div>
                        </div>
                        
                        <div className="space-y-3">
                          {creationType === "product_shot" ? (
                            <Textarea
                              placeholder="Describe your product shot... (e.g., 'luxury skincare product on marble surface with soft lighting')"
                              className="min-h-[100px] border-slate-200 focus:border-violet-300 focus:ring-violet-200 resize-none text-sm"
                              value={productShotForm.prompt}
                              name="prompt"
                              onChange={handleProductShotChange}
                            />
                          ) : (
                            <Textarea
                              placeholder="Type a prompt..."
                              className="min-h-[100px] border-slate-200 focus:border-violet-300 focus:ring-violet-200 resize-none text-sm"
                              value="Create a professional product showcase with elegant lighting and modern composition"
                              readOnly
                            />
                          )}
                          
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Button variant="ghost" size="sm" className="h-8 px-3 text-xs bg-violet-50 text-violet-700 hover:bg-violet-100">
                                <ImageIcon className="h-3 w-3 mr-1" />
                                Image
                              </Button>
                              <Button variant="ghost" size="sm" className="h-8 px-3 text-xs">
                                Video
                                <Badge className="ml-1 bg-blue-100 text-blue-700 text-xs px-1">New</Badge>
                              </Button>
                              <Button variant="ghost" size="sm" className="h-8 px-3 text-xs">
                                Flow State
                              </Button>
                            </div>
                            
                            <Button
                              type="submit"
                              form={creationType === "ad_creative" ? "product-form" : undefined}
                              onClick={creationType === "product_shot" ? handleProductShotSubmit : undefined}
                              disabled={pending || !isFormValid()}
                              className="bg-violet-600 hover:bg-violet-700 text-white px-6 h-9 text-sm"
                            >
                              {pending ? (
                                <>
                                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                  Generating...
                                </>
                              ) : (
                                <>
                                  Generate
                                  <ArrowRight className="ml-2 h-4 w-4" />
                                </>
                              )}
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Generation Settings */}
                    <div className="flex items-center justify-center gap-6 text-sm text-slate-600">
                      <div className="flex items-center gap-2">
                        <span>Type:</span>
                        <span className="font-medium">{creationType === "ad_creative" ? "Ad Creative" : "Product Shot"}</span>
                      </div>
                      {creationType === "product_shot" && (
                        <>
                          <div className="flex items-center gap-2">
                            <span>Ratio:</span>
                            <span className="font-medium">{aspectRatios.find(r => r.value === productShotForm.aspectRatio)?.label}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span>Images:</span>
                            <span className="font-medium">{productShotForm.numberOfImages}</span>
                          </div>
                        </>
                      )}
                      {creationType === "ad_creative" && (
                        <>
                          <div className="flex items-center gap-2">
                            <span>Style:</span>
                            <span className="font-medium">Dynamic</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span>Ratio:</span>
                            <span className="font-medium">Multiple</span>
                          </div>
                        </>
                      )}
                      <div className="flex items-center gap-2">
                        <span>Credits:</span>
                        <span className="font-medium text-violet-600">
                          {creationType === "ad_creative" ? "4 per image" : `${productShotForm.numberOfImages * 2} total`}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                /* Generation and results state */
                <div className="h-full">
                  <div className="mb-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h2 className="text-xl font-semibold text-slate-900 mb-2">
                          {isGenerating ? "Generating Images..." : "Generated Images"}
                        </h2>
                        <p className="text-slate-600">
                          {isGenerating 
                            ? `Creating ${creationType === "product_shot" ? productShotForm.numberOfImages : 5} images for your ${creationType === "product_shot" ? "product shot" : "ad campaign"}...`
                            : `Your ${creationType === "product_shot" ? "product shots" : "ad creatives"} are ready!`
                          }
                        </p>
                      </div>
                      {result && result.success && (
                        <Button
                          onClick={downloadAllImages}
                          variant="outline"
                          className="flex items-center gap-2"
                        >
                          <Download className="h-4 w-4" />
                          Download All
                        </Button>
                      )}
                    </div>
                  </div>

                  {/* Image Grid with subtle background */}
                  <div className="bg-white/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-200/60 shadow-sm">
                    <div className={`grid gap-6 ${getGridLayout(creationType === "product_shot" ? productShotForm.numberOfImages : 5)}`}>
                      {isGenerating ? (
                        renderLoadingPlaceholders()
                      ) : result && result.success ? (
                        /* Show generated images */
                        creationType === "product_shot" ? (
                          result.images?.map((image: any, index: number) => (
                            <div
                              key={index}
                              className={`${getAspectRatioClass(productShotForm.aspectRatio)} bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow group max-w-sm mx-auto w-full`}
                            >
                              <div className="relative h-full">
                                <img
                                  src={image.imageUrl}
                                  alt={`Product shot ${index + 1}`}
                                  className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                                  <Button
                                    variant="secondary"
                                    size="sm"
                                    onClick={() => downloadImage(image.imageUrl, `product-shot-${index + 1}.png`)}
                                    className="bg-white/90 hover:bg-white text-slate-900"
                                  >
                                    <Download className="h-4 w-4 mr-2" />
                                    Download
                                  </Button>
                                </div>
                              </div>
                            </div>
                          ))
                        ) : (
                          /* Ad creative results */
                          result.creatives?.map((creative: any, index: number) => (
                            <div
                              key={index}
                              className="aspect-square bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow group max-w-sm mx-auto w-full"
                            >
                              <div className="relative h-full">
                                <img
                                  src={creative.imageUrl}
                                  alt={creative.title}
                                  className="w-full h-full object-cover"
                                />
                                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                                  <h3 className="text-white font-medium text-sm">{creative.title}</h3>
                                  <p className="text-white/80 text-xs">{creative.dimensions}</p>
                                </div>
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                                  <Button
                                    variant="secondary"
                                    size="sm"
                                    onClick={() => downloadImage(creative.imageUrl, creative.title)}
                                    className="bg-white/90 hover:bg-white text-slate-900"
                                  >
                                    <Download className="h-4 w-4 mr-2" />
                                    Download
                                  </Button>
                                </div>
                              </div>
                            </div>
                          ))
                        )
                      ) : (
                        /* Error state */
                        <div className="col-span-full flex flex-col items-center justify-center py-12">
                          <div className="text-center">
                            <h3 className="text-lg font-medium text-slate-900 mb-2">Generation Failed</h3>
                            <p className="text-slate-600 mb-4">
                              {result?.error || "Something went wrong while generating your images."}
                            </p>
                            <Button
                              onClick={() => {
                                setResult(null);
                                setIsGenerating(false);
                              }}
                              variant="outline"
                            >
                              Try Again
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Action buttons */}
                  {result && result.success && (
                    <div className="flex justify-center gap-4 mt-8 pt-6 border-t border-slate-200">
                      <Button
                        variant="outline"
                        onClick={() => {
                          setResult(null);
                          setIsGenerating(false);
                        }}
                      >
                        Generate New
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Scene Selection Modal */}
      <Dialog open={showSceneModal} onOpenChange={setShowSceneModal}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Choose a Scene</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
            {scenes.map((scene) => (
              <div
                key={scene.id}
                onClick={() => handleSceneSelect(scene.id)}
                className="cursor-pointer group"
              >
                <div className="aspect-video overflow-hidden rounded-lg border-2 border-transparent group-hover:border-violet-300 transition-colors">
                  <img
                    src={scene.image}
                    alt={scene.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                </div>
                <div className="mt-2 text-center">
                  <h3 className="text-sm font-medium text-slate-900">{scene.name}</h3>
                  <p className="text-xs text-slate-500 mt-1">{scene.description}</p>
                </div>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      {/* AI Assistant Modal */}
      <AIAssistantModal
        open={showAIModal}
        onOpenChange={setShowAIModal}
        productName={form.productName}
        productCategory={form.productCategory}
        onDataGenerated={handleAIDataGenerated}
      />
    </div>
  );
};

export default Generate;