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

const SubmitProduct = () => {
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
    <div className="container max-w-6xl mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Create AI Creatives</h1>
        <p className="text-muted-foreground mt-1">
          Submit your product details to generate AI-powered marketing creatives
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
        <TabsList className="grid grid-cols-3 w-full max-w-md">
          <TabsTrigger value="form" disabled={pending}>Product Details</TabsTrigger>
          <TabsTrigger value="processing" disabled={!pending && activeTab !== "processing"}>Processing</TabsTrigger>
          <TabsTrigger value="results" disabled={!result}>Results</TabsTrigger>
        </TabsList>

        <TabsContent value="form">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left side: Product & Advanced Info */}
            <div className="lg:col-span-2 flex flex-col gap-8">
              {/* Product Information Card */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>Product Information</CardTitle>
                  <CardDescription>
                    Provide detailed information about your product to generate better creatives
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form id="product-form" onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="productName">Product Name*</Label>
                        <Input
                          id="productName"
                          name="productName"
                          type="text"
                          required
                          value={form.productName}
                          onChange={handleChange}
                          placeholder="e.g. Super Widget Pro"
                          className="border-input/60 focus-visible:ring-offset-1"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="productCategory">Product Category*</Label>
                        <Select 
                          value={form.productCategory} 
                          onValueChange={handleCategoryChange}
                          required
                        >
                          <SelectTrigger className="border-input/60">
                            <SelectValue placeholder="Select a category" />
                          </SelectTrigger>
                          <SelectContent>
                            {categories.map(category => (
                              <SelectItem key={category} value={category}>{category}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="productTagline">Product Tagline*</Label>
                      <Input
                        id="productTagline"
                        name="productTagline"
                        type="text"
                        required
                        value={form.productTagline}
                        onChange={handleChange}
                        placeholder="e.g. The best widget for everyone"
                        className="border-input/60 focus-visible:ring-offset-1"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="highlightedBenefit">Key Benefit*</Label>
                      <Input
                        id="highlightedBenefit"
                        name="highlightedBenefit"
                        type="text"
                        required
                        value={form.highlightedBenefit}
                        onChange={handleChange}
                        placeholder="e.g. Saves you 10 hours a week"
                        className="border-input/60 focus-visible:ring-offset-1"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="productDescription">Product Description*</Label>
                      <Textarea
                        id="productDescription"
                        name="productDescription"
                        required
                        value={form.productDescription}
                        onChange={handleChange}
                        placeholder="Describe your product in detail, including features, benefits, and target audience"
                        className="min-h-[120px] border-input/60 focus-visible:ring-offset-1"
                      />
                    </div>
                  </form>
                </CardContent>
              </Card>

              {/* Advanced Information Card */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Advanced Information</CardTitle>
                      <CardDescription>
                        Fine-tune the creative direction for your brand and product visuals
                      </CardDescription>
                    </div>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              if (!form.productName || !form.productCategory) return;
                              setShowAIModal(true);
                            }}
                            aria-disabled={!form.productName || !form.productCategory}
                            className={`gap-2 bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200 hover:from-purple-100 hover:to-blue-100 ${
                              (!form.productName || !form.productCategory) ? 'opacity-60 cursor-not-allowed' : ''
                            }`}
                          >
                            <Wand2 className="h-4 w-4 text-purple-600" />
                            Write with AI
                          </Button>
                        </TooltipTrigger>
                        {(!form.productName || !form.productCategory) && (
                          <TooltipContent side="top" align="center" sideOffset={10}>
                            <p>Add product name and category first</p>
                          </TooltipContent>
                        )}
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="brandName">Brand Name</Label>
                      <Input
                        id="brandName"
                        name="brandName"
                        type="text"
                        value={form.brandName}
                        onChange={handleChange}
                        className="border-input/60 focus-visible:ring-offset-1"
                      />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="brandTone">Brand Tone</Label>
                      <Textarea
                        id="brandTone"
                        name="brandTone"
                        value={form.brandTone}
                        onChange={handleChange}
                        className="min-h-[60px] border-input/60 focus-visible:ring-offset-1"
                      />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="colorTheme">Color Theme</Label>
                      <Textarea
                        id="colorTheme"
                        name="colorTheme"
                        value={form.colorTheme}
                        onChange={handleChange}
                        className="min-h-[60px] border-input/60 focus-visible:ring-offset-1"
                      />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="backgroundStyle">Background Style</Label>
                      <Textarea
                        id="backgroundStyle"
                        name="backgroundStyle"
                        value={form.backgroundStyle}
                        onChange={handleChange}
                        className="min-h-[60px] border-input/60 focus-visible:ring-offset-1"
                      />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="lightingStyle">Lighting Style</Label>
                      <Textarea
                        id="lightingStyle"
                        name="lightingStyle"
                        value={form.lightingStyle}
                        onChange={handleChange}
                        className="min-h-[60px] border-input/60 focus-visible:ring-offset-1"
                      />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="productPlacement">Product Placement</Label>
                      <Textarea
                        id="productPlacement"
                        name="productPlacement"
                        value={form.productPlacement}
                        onChange={handleChange}
                        className="min-h-[60px] border-input/60 focus-visible:ring-offset-1"
                      />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="typographyStyle">Typography Style</Label>
                      <Textarea
                        id="typographyStyle"
                        name="typographyStyle"
                        value={form.typographyStyle}
                        onChange={handleChange}
                        className="min-h-[60px] border-input/60 focus-visible:ring-offset-1"
                      />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="compositionGuidelines">Composition Guidelines</Label>
                      <Textarea
                        id="compositionGuidelines"
                        name="compositionGuidelines"
                        value={form.compositionGuidelines}
                        onChange={handleChange}
                        className="min-h-[80px] border-input/60 focus-visible:ring-offset-1"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right side: Product Image & Submit Card at the top */}
            <div className="flex flex-col gap-6">
              {/* Product Image Card */}
              <Card>
                <CardHeader>
                  <CardTitle>Product Image</CardTitle>
                  <CardDescription>
                    Upload a high-quality image of your product
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div 
                      className={`border-2 border-dashed rounded-lg p-4 text-center ${
                        filePreview ? 'border-primary/40' : 'border-muted-foreground/25'
                      } hover:border-primary/70 transition-colors cursor-pointer`}
                      onClick={() => document.getElementById('productImage')?.click()}
                    >
                      {filePreview ? (
                        <div className="aspect-video relative">
                          <img 
                            src={filePreview} 
                            alt="Product preview" 
                            className="mx-auto max-h-[200px] object-contain" 
                          />
                        </div>
                      ) : (
                        <div className="py-8 flex flex-col items-center">
                          <Upload className="h-10 w-10 text-muted-foreground/70 mb-2" />
                          <p className="text-sm text-muted-foreground">
                            Click to upload or drag and drop
                          </p>
                          <p className="text-xs text-muted-foreground/70 mt-1">
                            PNG, JPG or WEBP (max 5MB)
                          </p>
                        </div>
                      )}
                      <Input
                        id="productImage"
                        name="productImage"
                        type="file"
                        required
                        accept="image/*"
                        onChange={handleChange}
                        className="hidden"
                      />
                    </div>
                    
                    {filePreview && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span>Image uploaded</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* AI Creative Generation Card */}
              <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-100">
                <CardHeader>
                  <CardTitle>AI Creative Generation</CardTitle>
                  <CardDescription>
                    Our AI will create multiple marketing assets for your product
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="bg-blue-100 p-2 rounded-full">
                      <ImageIcon className="h-4 w-4 text-blue-700" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Social Media Images</p>
                      <p className="text-xs text-muted-foreground">Optimized for platforms</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <div className="bg-purple-100 p-2 rounded-full">
                      <TextIcon className="h-4 w-4 text-purple-700" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Marketing Copy</p>
                      <p className="text-xs text-muted-foreground">Compelling product descriptions</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <div className="bg-emerald-100 p-2 rounded-full">
                      <Sparkles className="h-4 w-4 text-emerald-700" />
                    </div>
                    <div>
                        
                      <p className="text-sm font-medium">Ad Campaigns</p>
                      <p className="text-xs text-muted-foreground">Ready-to-use advertising</p>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button 
                    type="submit"
                    form="product-form"
                    disabled={pending || !isFormValid()}
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                  >
                    Generate Creatives <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="processing">
          <Card className="border-0 shadow-lg bg-gradient-to-br from-slate-50 to-blue-50">
            <CardContent className="pt-10 pb-10">
              <div className="flex flex-col items-center justify-center space-y-6">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="h-16 w-16 rounded-full bg-blue-100/80 animate-ping" />
                  </div>
                  <div className="relative flex items-center justify-center h-20 w-20 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600">
                    <Sparkles className="h-8 w-8 text-white animate-pulse" />
                  </div>
                </div>
                
                <div className="text-center space-y-2">
                  <h3 className="text-xl font-semibold">Generating AI Creatives</h3>
                  <p className="text-muted-foreground max-w-md">
                    Our AI is analyzing your product and creating custom marketing assets. 
                    This may take a few moments...
                  </p>
                </div>
                
                <div className="w-full max-w-md space-y-3">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Analyzing product data</span>
                      <span className="text-green-600">Complete</span>
                    </div>
                    <div className="h-1.5 w-full bg-muted overflow-hidden rounded-full">
                      <div className="h-full bg-green-500 w-full rounded-full" />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Generating marketing copy</span>
                      <span className="text-green-600">Complete</span>
                    </div>
                    <div className="h-1.5 w-full bg-muted overflow-hidden rounded-full">
                      <div className="h-full bg-green-500 w-full rounded-full" />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Creating visual assets</span>
                      <span className="flex items-center">
                        <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                        In progress
                      </span>
                    </div>
                    <div className="h-1.5 w-full bg-muted overflow-hidden rounded-full">
                      <div className="h-full bg-blue-500 w-3/4 rounded-full animate-pulse" />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Finalizing results</span>
                      <span className="text-muted-foreground">Pending</span>
                    </div>
                    <div className="h-1.5 w-full bg-muted overflow-hidden rounded-full">
                      <div className="h-full bg-muted-foreground/30 w-0" />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="results">
          {enhancedResults && (
            <div className="space-y-8">
              <Card className="border-green-100 bg-gradient-to-br from-green-50 to-emerald-50">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-6 w-6 text-green-600" />
                    <CardTitle>AI Creatives Generated Successfully</CardTitle>
                  </div>
                  <CardDescription>
                    We&apos;ve created {enhancedResults?.creatives?.length} marketing visuals for {form.productName}
                  </CardDescription>
                </CardHeader>
              </Card>

              <div>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-semibold flex items-center gap-2">
                    <ImageIcon className="h-5 w-5 text-blue-600" />
                    Social Media Creatives
                  </h3>
                  <Button variant="outline" size="sm" className="gap-2" onClick={downloadAllImages}>
                    <Download className="h-4 w-4" />
                    Download All
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {enhancedResults.creatives.map((creative: any, idx: number) => (
                    <Card key={idx} className="overflow-hidden group hover:shadow-lg transition-all border-muted/60">
                      <div className="aspect-[4/3] relative overflow-hidden bg-slate-50">
                        <img 
                          src={creative.imageUrl} 
                          alt={creative.title} 
                          className="w-full h-full object-contain"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center">
                          <a
                            href={creative.imageUrl}
                            download={`${creative.title.replace(/\s+/g, '_').toLowerCase()}.png`}
                            onClick={async (e) => {
                              e.preventDefault();
                              await downloadImage(creative.imageUrl, `${creative.title.replace(/\s+/g, '_').toLowerCase()}.png`);
                            }}
                          >
                            <Button variant="secondary" size="sm" className="mb-4 gap-1.5">
                              <Download className="h-3.5 w-3.5" />
                              Download
                            </Button>
                          </a>
                        </div>
                      </div>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <div className="p-1.5 rounded-md bg-slate-100">
                              {getSocialIcon(creative.type)}
                            </div>
                            <div>
                              <h4 className="font-medium text-sm">{creative.title}</h4>
                              <p className="text-xs text-muted-foreground">{creative.dimensions}</p>
                            </div>
                          </div>
                          <Badge variant="outline" className="bg-slate-50 text-xs">
                            {creative.type.replace('_', ' ')}
                          </Badge>
                        </div>
                        
                        {creative.assetDetails && (
                          <div className="mt-3 pt-3 border-t border-slate-100 text-xs space-y-2">
                            <div className="flex gap-1">
                              <span className="font-medium min-w-24">Background:</span>
                              <span className="text-muted-foreground">{creative.assetDetails.backgroundTone}</span>
                            </div>
                            <div className="flex gap-1">
                              <span className="font-medium min-w-24">Surface:</span>
                              <span className="text-muted-foreground">{creative.assetDetails.surfaceType}</span>
                            </div>
                            <div className="flex gap-1">
                              <span className="font-medium min-w-24">Accent:</span>
                              <span className="text-muted-foreground">{creative.assetDetails.accentProp}</span>
                            </div>
                            <div className="flex gap-1">
                              <span className="font-medium min-w-24">Lighting:</span>
                              <span className="text-muted-foreground">{creative.assetDetails.lighting}</span>
                            </div>
                            <div className="flex gap-1">
                              <span className="font-medium min-w-24">Camera Angle:</span>
                              <span className="text-muted-foreground">{creative.assetDetails.cameraAngle}</span>
                            </div>
                            <div className="flex gap-1">
                              <span className="font-medium min-w-24">Overlay Text:</span>
                              <span className="text-muted-foreground italic">&quot;{creative.assetDetails.overlayText}&quot;</span>
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              <div className="flex justify-center mt-12">
                <Button 
                  onClick={() => {
                    setActiveTab("form");
                    setForm(initialForm);
                    setFile(null);
                    setFilePreview(null);
                    setResult(null);
                  }}
                  variant="outline"
                  className="mr-4"
                >
                  Create New
                </Button>
                <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 gap-2" onClick={downloadAllImages}>
                  <Download className="h-4 w-4" />
                  Download All Assets
                </Button>
              </div>
            </div>
          )}
        </TabsContent>
      </Tabs>

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

export default SubmitProduct;