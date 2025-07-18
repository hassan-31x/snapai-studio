import React from 'react';
import { getAllSubmissions } from "@/actions/get-all-submissions";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { 
  TrendingUp, 
  Grid3X3, 
  Zap, 
  Video, 
  Camera, 
  Users, 
  Sparkles,
  Heart,
  Download,
  ExternalLink,
  Plus,
  LayoutGrid,
  Grid,
  Columns,
  Wand2,
  Copy,
  Share2
} from "lucide-react";
import Link from "next/link";
import { imageTypes } from "@/lib/image-types";

const Dashboard = async () => {
  const submissions = await getAllSubmissions();
  
  // Generate dummy data for missing information
  const generateDummyData = () => {
    const prompts = [
      "Craft a mesmerizing double exposure photo illustration that seamlessly blends nature and portraiture",
      "Create a stunning cinematic portrait with dramatic lighting and ethereal atmosphere",
      "Design a mystical forest scene with enchanted lighting and magical elements",
      "Produce a vibrant cyberpunk cityscape with neon reflections and urban energy",
      "Generate an elegant minimalist composition with clean lines and soft shadows",
      "Build a dynamic action scene with motion blur and intense color grading",
      "Construct a dreamy landscape with pastel colors and soft focus effects",
      "Develop a bold fashion portrait with striking contrast and modern aesthetics"
    ];
    
    const users = [
      "TinkerRobot", "ArtMaster", "CreativeBot", "DesignGuru", "PixelWizard", 
      "VisionAI", "ImageCraft", "StyleGen", "ArtFlow", "SnapMaster"
    ];
    
    return {
      prompt: prompts[Math.floor(Math.random() * prompts.length)],
      user: users[Math.floor(Math.random() * users.length)],
      likes: Math.floor(Math.random() * 500) + 50,
      model: "Snap AI Pro",
      style: ["Photographic", "Cinematic", "Artistic", "Abstract", "Portrait"][Math.floor(Math.random() * 5)]
    };
  };
  
  // Extract all individual images from submissions and shuffle them
  const allImages = submissions.flatMap(submission => {
    const images = [];
    
    // Add original image
    if (submission.originalImageUrl) {
      images.push({
        url: submission.originalImageUrl,
        productName: submission.productName,
        category: submission.productCategory,
        submissionId: submission.id,
        type: 'original',
        ...generateDummyData()
      });
    }
    
    // Add generated images
    imageTypes.forEach(imgType => {
      const url = submission[imgType.key as keyof typeof submission] as string;
      if (url) {
        images.push({
          url,
          productName: submission.productName,
          category: submission.productCategory,
          submissionId: submission.id,
          type: imgType.label,
          dimensions: imgType.dimensions,
          ...generateDummyData()
        });
      }
    });
    
    return images;
  });
  
  // Shuffle the images for random display
  const shuffledImages = allImages.sort(() => Math.random() - 0.5);
  
  const categories = [
    ...Array.from(new Set(submissions.map((s) => s.productCategory).filter(Boolean))),
  ];

  const filterButtons = [
    { id: 'trending', label: 'Trending', icon: TrendingUp, active: true },
    { id: 'all', label: 'All', icon: Grid3X3 },
    { id: 'upscaled', label: 'Upscaled', icon: Zap },
    { id: 'video', label: 'Video', icon: Video },
    { id: 'photography', label: 'Photography', icon: Camera },
    { id: 'animals', label: 'Animals', icon: Users },
    { id: 'anime', label: 'Anime', icon: Sparkles },
    { id: 'architecture', label: 'Architecture', icon: Grid3X3 },
    { id: 'character', label: 'Character', icon: Users },
    { id: 'food', label: 'Food', icon: Heart },
  ];

  return (
    <div className="min-h-screen bg-slate-100">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(139,92,246,0.05)_1px,transparent_0)] [background-size:20px_20px] pointer-events-none"></div>
      
      <div className="relative z-10">
        {/* Header Section */}
        <div className="p-6">
          <div className="relative overflow-hidden bg-gradient-to-r from-violet-600 via-purple-600 to-pink-600 p-8 rounded-xl shadow-lg">
            <div className="absolute inset-0 bg-black/10"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-white mb-2">
                    Experience Flow State
                  </h1>
                  <p className="text-violet-100 text-lg">
                    Only 1 token per image starting March 2025
                  </p>
                </div>
                <Button 
                  className="bg-white/20 hover:bg-white/30 text-white border border-white/30 backdrop-blur-sm"
                  size="lg"
                >
                  Try Flow State
                </Button>
              </div>
            </div>
            
            {/* Floating Icons */}
            <div className="absolute top-4 right-20 w-16 h-16 bg-white/10 rounded-2xl backdrop-blur-sm flex items-center justify-center">
              <Camera className="w-8 h-8 text-white" />
            </div>
            <div className="absolute top-12 right-40 w-12 h-12 bg-white/10 rounded-xl backdrop-blur-sm flex items-center justify-center">
              <Video className="w-6 h-6 text-white" />
            </div>
            <div className="absolute bottom-4 right-32 w-14 h-14 bg-white/10 rounded-xl backdrop-blur-sm flex items-center justify-center">
              <Sparkles className="w-7 h-7 text-white" />
            </div>
          </div>
        </div>

        {/* Featured Guides Section */}
        <div className="p-6">
          <div className="bg-white/60 backdrop-blur-sm rounded-3xl border border-white/60 shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-slate-900">
                <span className="text-violet-600">Featured</span> Guides
              </h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                {
                  title: "YOUR IMAGES WITH SNAP AI",
                  category: "Upscaling",
                  gradient: "from-slate-800 to-slate-600",
                  image: "/api/placeholder/300/200"
                },
                {
                  title: "STYLE REFERENCE",
                  category: "How to Use",
                  gradient: "from-amber-500 to-orange-500",
                  image: "/api/placeholder/300/200"
                },
                {
                  title: "CONSISTENT CHARACTERS",
                  category: "Creating",
                  gradient: "from-cyan-500 to-blue-500",
                  image: "/api/placeholder/300/200"
                },
                {
                  title: "CONTENT REFERENCE",
                  category: "Using",
                  gradient: "from-green-500 to-emerald-500",
                  image: "/api/placeholder/300/200"
                }
              ].map((guide, idx) => (
                <div key={idx} className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-slate-100 to-slate-200 h-48 cursor-pointer transition-transform hover:scale-105">
                  <div className={`absolute inset-0 bg-gradient-to-br ${guide.gradient} opacity-90`}></div>
                  <div className="absolute inset-0 bg-black/20"></div>
                  <div className="relative z-10 p-4 h-full flex flex-col justify-between">
                    <div>
                      <Badge className="bg-white/20 text-white border-white/30 text-xs mb-2">
                        {guide.category}
                      </Badge>
                    </div>
                    <div>
                      <h3 className="text-white font-semibold text-sm leading-tight">
                        {guide.title}
                      </h3>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Community Creations Section */}
        <div className="p-6">
          <div className="bg-white/60 backdrop-blur-sm rounded-3xl border border-white/60 shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-slate-900">
                <span className="text-violet-600">Community</span> Creations
              </h2>
              <div className="flex items-center gap-3">
                {/* Layout Options */}
                <div className="flex items-center bg-white rounded-full p-1 border border-slate-200">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="rounded-full h-8 w-8 p-0 bg-violet-600 text-white hover:bg-violet-700"
                    title="Large Grid"
                  >
                    <LayoutGrid className="w-4 h-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="rounded-full h-8 w-8 p-0 hover:bg-slate-100"
                    title="Medium Grid"
                  >
                    <Grid3X3 className="w-4 h-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="rounded-full h-8 w-8 p-0 hover:bg-slate-100"
                    title="Compact Grid"
                  >
                    <Grid className="w-4 h-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="rounded-full h-8 w-8 p-0 hover:bg-slate-100"
                    title="List View"
                  >
                    <Columns className="w-4 h-4" />
                  </Button>
                </div>
                
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="rounded-full bg-white/60 border-slate-200/60 hover:bg-white/80"
                >
                  <Grid3X3 className="w-4 h-4 mr-2" />
                  Filter
                </Button>
                <Link href="/generate">
                  <Button 
                    size="sm" 
                    className="rounded-full bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white shadow-lg"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Generate Creative
                  </Button>
                </Link>
              </div>
            </div>

            {/* Filter Tabs */}
            <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
              {filterButtons.map((filter) => (
                <Button
                  key={filter.id}
                  variant={filter.active ? "default" : "outline"}
                  size="sm"
                  className={`flex items-center gap-2 rounded-full whitespace-nowrap ${
                    filter.active 
                      ? "bg-violet-600 hover:bg-violet-700 text-white" 
                      : "bg-white hover:bg-slate-50 text-slate-600 border-slate-200"
                  }`}
                >
                  <filter.icon className="w-4 h-4" />
                  {filter.label}
                </Button>
              ))}
            </div>

            {/* Images Grid - Larger Size */}
            {shuffledImages.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {shuffledImages.slice(0, 16).map((image, idx) => (
                  <Link key={idx} href={`/submissions/${image.submissionId}`} target="_blank">
                    <div className="group relative overflow-hidden rounded-2xl bg-slate-100 aspect-square cursor-pointer transition-all hover:scale-[1.02] hover:shadow-xl">
                      <img
                        src={image.url}
                        alt={image.productName}
                        className="w-full h-full object-cover transition-transform group-hover:scale-110"
                      />
                      
                      {/* Hover Overlay with Text Data */}
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all duration-300">
                        {/* Top Section - User Info */}
                        <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-gradient-to-br from-violet-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xs font-medium">
                              {image.user.charAt(0)}
                            </div>
                            <span className="text-white text-sm font-medium">{image.user}</span>
                          </div>
                          <div className="flex items-center gap-1 bg-black/40 rounded-full px-2 py-1 backdrop-blur-sm">
                            <Heart className="w-4 h-4 text-white" />
                            <span className="text-white text-sm">{image.likes}</span>
                          </div>
                        </div>

                        {/* Bottom Section - Prompt and Actions */}
                        <div className="absolute bottom-4 left-4 right-4">
                          <div className="mb-3">
                            <p className="text-white text-sm font-medium line-clamp-2 mb-1">
                              {image.prompt}
                            </p>
                            <div className="flex items-center gap-2 text-white/80 text-xs">
                              <span>{image.model}</span>
                              <span>•</span>
                              <span>{image.style}</span>
                            </div>
                          </div>
                          
                          {/* Action Buttons */}
                          <div className="flex items-center justify-center">
                            <Button 
                              size="sm" 
                              className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white rounded-full px-6 py-1 text-sm font-medium shadow-lg backdrop-blur-sm border border-white/20"
                              // onClick={(e) => e.preventDefault()}
                            >
                              <Wand2 className="w-3 h-3 mr-2" />
                              Remix
                            </Button>
                          </div>
                        </div>

                        {/* Side Actions */}
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 flex flex-col gap-2">
                          <Button 
                            size="sm" 
                            variant="secondary" 
                            className="h-10 w-10 p-0 rounded-full bg-white/20 border-white/30 backdrop-blur-sm hover:bg-white/30"
                            // onClick={(e) => e.preventDefault()}
                          >
                            <Heart className="w-4 h-4 text-white" />
                          </Button>
                          <Button 
                            size="sm" 
                            variant="secondary" 
                            className="h-10 w-10 p-0 rounded-full bg-white/20 border-white/30 backdrop-blur-sm hover:bg-white/30"
                            // onClick={(e) => e.preventDefault()}
                          >
                            <Download className="w-4 h-4 text-white" />
                          </Button>
                          <Button 
                            size="sm" 
                            variant="secondary" 
                            className="h-10 w-10 p-0 rounded-full bg-white/20 border-white/30 backdrop-blur-sm hover:bg-white/30"
                            // onClick={(e) => e.preventDefault()}
                          >
                            <Share2 className="w-4 h-4 text-white" />
                          </Button>
                        </div>
                      </div>

                      {/* Category Badge - Always Visible */}
                      <div className="absolute top-4 left-4 opacity-100 group-hover:opacity-0 transition-opacity">
                        <Badge 
                          variant="secondary" 
                          className="bg-white/90 text-slate-700 text-xs backdrop-blur-sm"
                        >
                          {image.category}
                        </Badge>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Plus className="w-8 h-8 text-slate-400" />
                </div>
                <h3 className="text-lg font-medium text-slate-900 mb-2">No creations yet</h3>
                <p className="text-slate-500 mb-6">Start creating your first AI-powered marketing creative</p>
                <Link href="/generate">
                  <Button className="bg-violet-600 hover:bg-violet-700">
                    Create Your First Creative
                  </Button>
                </Link>
              </div>
            )}

            {/* Load More */}
            {shuffledImages.length > 16 && (
              <div className="text-center mt-8">
                <Button variant="outline" size="lg" className="rounded-full">
                  Load More Creations
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;