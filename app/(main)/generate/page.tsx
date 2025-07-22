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
  Wand2
} from "lucide-react";
import { useSession } from "next-auth/react";
import { AIAssistantModal } from "@/components/ai-assistant-modal";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

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

const categories = [
  "Technology", "Fashion", "Home", "Beauty", "Health", "Food", "Fitness", 
  "Productivity", "Entertainment", "Education", "Eco-Friendly"
];

const Generate = () => {
  const [form, setForm] = useState(initialForm);
  const [file, setFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [result, setResult] = useState<any>(null);
  const [pending, startTransition] = useTransition();
  const [activeTab, setActiveTab] = useState<string>("form");
  const [showAIModal, setShowAIModal] = useState(false);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      if (value) formData.append(key, value as string);
    });
    if (file) formData.append("productImage", file);
    formData.append("userId", session?.user?.id || "");
    setResult(null);
    setActiveTab("processing");
    
    startTransition(async () => {
      try {
        const res = await submitProductAction(formData);
        setResult(res);
        setActiveTab("results");
      } catch (error) {
        console.error("Error submitting product:", error);
        // Handle error state
      }
    });
  };

  const isFormValid = () => {
    return (
      form.productName &&
      form.productTagline &&
      form.productCategory &&
      form.productDescription &&
      file
    );
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
    if (!enhancedResults?.creatives) return;
    for (const creative of enhancedResults.creatives) {
      const filename = `${creative.title.replace(/\s+/g, '_').toLowerCase()}.png`;
      await downloadImage(creative.imageUrl, filename);
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
          <form id="product-form" onSubmit={handleSubmit} className="space-y-6">
            {/* Product Image Upload */}
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
        <div className="flex-1 flex flex-col items-center justify-center p-8">
          <div className="w-full max-w-4xl space-y-6">
            {/* Prompt Input Area */}
            <div className="bg-white rounded-2xl border border-slate-200/60 p-6 shadow-sm">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-violet-100 rounded-full flex items-center justify-center">
                      <ImageIcon className="h-4 w-4 text-violet-600" />
                    </div>
                    <span className="text-sm font-medium text-slate-900">Image</span>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1 bg-blue-50 rounded-full">
                    <span className="text-xs font-medium text-blue-700">New</span>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <Textarea
                    placeholder="Type a prompt..."
                    className="min-h-[100px] border-slate-200 focus:border-violet-300 focus:ring-violet-200 resize-none text-sm"
                    value="Create a professional product showcase with elegant lighting and modern composition"
                    readOnly
                  />
                  
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
                      form="product-form"
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
                <span>Style:</span>
                <span className="font-medium">Dynamic</span>
              </div>
              <div className="flex items-center gap-2">
                <span>Ratio:</span>
                <span className="font-medium">1:1</span>
              </div>
              <div className="flex items-center gap-2">
                <span>Size:</span>
                <span className="font-medium">Large</span>
              </div>
              <div className="flex items-center gap-2">
                <span>Credits:</span>
                <span className="font-medium text-violet-600">4 per image</span>
              </div>
            </div>

            {/* Processing State */}
            {pending && (
              <div className="bg-white rounded-2xl border border-slate-200/60 p-8 shadow-sm">
                <div className="flex flex-col items-center justify-center space-y-4">
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="h-12 w-12 rounded-full bg-violet-100/80 animate-ping" />
                    </div>
                    <div className="relative flex items-center justify-center h-16 w-16 rounded-full bg-gradient-to-br from-violet-500 to-purple-600">
                      <Sparkles className="h-6 w-6 text-white animate-pulse" />
                    </div>
                  </div>
                  
                  <div className="text-center space-y-2">
                    <h3 className="text-lg font-medium text-slate-900">Generating AI Creatives</h3>
                    <p className="text-slate-500">
                      Creating stunning visuals for your product...
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Results Modal/Overlay */}
      {result && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto m-4">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-slate-900">Generated Creatives</h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setResult(null)}
                className="text-slate-500 hover:text-slate-700"
              >
                ✕
              </Button>
            </div>
            
            {/* Results content */}
            <div className="space-y-6">
              <div className="text-center">
                <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-slate-900 mb-2">Creatives Generated!</h3>
                <p className="text-slate-600">Your AI-powered marketing assets are ready</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {enhancedResults?.creatives?.map((creative: any, idx: number) => (
                  <div key={idx} className="bg-slate-50 rounded-xl p-4 space-y-3">
                    <div className="aspect-square bg-white rounded-lg overflow-hidden">
                      <img
                        src={creative.imageUrl}
                        alt={creative.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-medium text-slate-900 text-sm">{creative.title}</h4>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-slate-500">{creative.dimensions}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 px-2 text-xs"
                          onClick={() => downloadImage(creative.imageUrl, creative.title)}
                        >
                          <Download className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="flex justify-center gap-4 pt-4">
                <Button
                  variant="outline"
                  onClick={() => {
                    setForm(initialForm);
                    setFile(null);
                    setFilePreview(null);
                    setResult(null);
                  }}
                >
                  Create New
                </Button>
                <Button
                  className="bg-violet-600 hover:bg-violet-700"
                  onClick={downloadAllImages}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download All
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

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