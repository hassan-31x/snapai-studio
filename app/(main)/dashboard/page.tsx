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
  Plus
} from "lucide-react";
import Link from "next/link";
import { imageTypes } from "@/lib/image-types";

const Dashboard = async () => {
  const submissions = await getAllSubmissions();
  
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
        type: 'original'
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
          dimensions: imgType.dimensions
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50/50">
      {/* Header */}
      <div className="relative overflow-hidden bg-gradient-to-r from-violet-600 via-purple-600 to-pink-600 p-8 rounded-xl m-6 mb-8">
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

      {/* Featured Guides */}
      <div className="px-6 mb-8">
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

      {/* Community Creations */}
      <div className="px-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-slate-900">
            <span className="text-violet-600">Community</span> Creations
          </h2>
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

        {/* Images Grid */}
        {shuffledImages.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {shuffledImages.slice(0, 20).map((image, idx) => (
              <Link key={idx} href={`/submissions/${image.submissionId}`}>
                <div className="group relative overflow-hidden rounded-xl bg-slate-100 aspect-square cursor-pointer transition-all hover:scale-105 hover:shadow-lg">
                  <img
                    src={image.url}
                    alt={image.productName}
                    className="w-full h-full object-cover transition-transform group-hover:scale-110"
                  />
                  
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="absolute bottom-3 left-3 right-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-white text-sm font-medium truncate">
                            {image.productName}
                          </p>
                          <p className="text-white/80 text-xs">
                            {image.type}
                          </p>
                        </div>
                        <div className="flex gap-1">
                          <Button size="sm" variant="secondary" className="h-8 w-8 p-0">
                            <Heart className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="secondary" className="h-8 w-8 p-0">
                            <Download className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Type Badge */}
                  <div className="absolute top-2 left-2">
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
            <Link href="/submit">
              <Button className="bg-violet-600 hover:bg-violet-700">
                Create Your First Creative
              </Button>
            </Link>
          </div>
        )}

        {/* Load More */}
        {shuffledImages.length > 20 && (
          <div className="text-center mt-8">
            <Button variant="outline" size="lg" className="rounded-full">
              Load More Creations
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;