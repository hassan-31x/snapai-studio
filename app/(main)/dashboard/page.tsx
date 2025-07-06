"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'motion/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { PlusCircle, ImageIcon, TextIcon, BarChart3, Sparkles, Download, Eye, Calendar, TrendingUp, Zap, Target } from 'lucide-react';

// Define types for our data structure
type Creative = {
  type: 'image' | 'copy';
  url?: string;
  content?: string;
};

type Product = {
  id: string;
  productName: string;
  productImage: string;
  category: string;
  date: string;
  status: string;
  creatives: Creative[];
};

// Dummy data for previously created AI creatives
const dummyCreatives: Product[] = [
  {
    id: '1',
    productName: 'EcoFresh Water Bottle',
    productImage: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8',
    category: 'Eco-Friendly',
    date: '2023-10-15',
    status: 'completed',
    creatives: [
      { type: 'image', url: 'https://images.unsplash.com/photo-1536939459926-301728717817' },
      { type: 'copy', content: 'Stay hydrated in style. EcoFresh bottles keep your drinks cold for 24 hours and hot for 12.' },
    ],
  },
  {
    id: '2',
    productName: 'SmartDesk Pro',
    productImage: 'https://images.unsplash.com/photo-1518655048521-f130df041f66',
    category: 'Office',
    date: '2023-10-10',
    status: 'completed',
    creatives: [
      { type: 'image', url: 'https://images.unsplash.com/photo-1593062096033-9a26b09da705' },
      { type: 'copy', content: 'Transform your workspace with SmartDesk Pro. Adjustable height, wireless charging, and smart connectivity.' },
    ],
  },
  {
    id: '3',
    productName: 'SleepWell Pillow',
    productImage: 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2',
    category: 'Home',
    date: '2023-10-05',
    status: 'completed',
    creatives: [
      { type: 'image', url: 'https://images.unsplash.com/photo-1631379578550-7038263c4c6a' },
      { type: 'copy', content: 'Experience the perfect night\'s sleep with our memory foam pillow, designed for all sleeping positions.' },
    ],
  },
  {
    id: '4',
    productName: 'FitTrack Watch',
    productImage: 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1',
    category: 'Fitness',
    date: '2023-09-28',
    status: 'completed',
    creatives: [
      { type: 'image', url: 'https://images.unsplash.com/photo-1575311373937-040b8e1fd6b0' },
      { type: 'copy', content: 'Track your fitness journey with precision. Heart rate, sleep quality, and workout metrics in one sleek device.' },
    ],
  },
];

// Function to fetch creatives from database (commented out for now)
// async function fetchCreatives() {
//   // This would be replaced with actual database fetch
//   // const creatives = await db.creatives.findMany({
//   //   where: { userId: session.user.id },
//   //   orderBy: { createdAt: 'desc' },
//   // });
//   // return creatives;
//   return dummyCreatives;
// }

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('all');
  // Use dummy data instead of actual fetch for now
  // const creatives = await fetchCreatives();
  const creatives = dummyCreatives;

  return (
    <div className="min-h-screen" style={{fontFamily:'Inter,Geist,sans-serif'}}>
      {/* Header Section */}
      <div className="bg-gradient-to-b from-gray-50/30 to-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <motion.div
            initial={{ opacity: 0, filter: "blur(10px)", y: 10 }}
            animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
            className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6"
          >
            <div>
              <h1 className="text-3xl md:text-4xl font-semibold text-gray-900 mb-3" style={{fontFamily:'Geist,Inter,sans-serif'}}>
                Creative Dashboard
              </h1>
              <p className="text-lg text-gray-500 max-w-2xl" style={{fontFamily:'Inter,Geist,sans-serif'}}>
                Manage your AI-generated ad creatives and track performance
              </p>
            </div>
            <Link href="/submit">
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button 
                  className="px-6 py-3 bg-gray-900 text-white rounded-xl shadow-lg hover:bg-gray-700 transition-all border border-gray-900/80"
                  style={{fontFamily:'Geist,Inter,sans-serif', boxShadow:'0 4px 16px 0 rgba(60,60,120,0.12)'}}
                >
                  <PlusCircle className="mr-2 h-5 w-5" />
                  Create New Creative
                </Button>
              </motion.div>
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="max-w-7xl mx-auto px-6 -mt-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {[
            {
              title: "Total Creatives",
              value: creatives.length.toString(),
              icon: <Sparkles className="w-6 h-6 text-indigo-600" />,
              bgColor: "from-indigo-50 to-blue-50",
              borderColor: "border-indigo-100/60",
              change: "+12% this month"
            },
            {
              title: "Images Generated",
              value: creatives.reduce((acc, item) => acc + item.creatives.filter(c => c.type === 'image').length, 0).toString(),
              icon: <ImageIcon className="w-6 h-6 text-purple-600" />,
              bgColor: "from-purple-50 to-pink-50",
              borderColor: "border-purple-100/60",
              change: "+24% this month"
            },
            {
              title: "Copy Generated",
              value: creatives.reduce((acc, item) => acc + item.creatives.filter(c => c.type === 'copy').length, 0).toString(),
              icon: <TextIcon className="w-6 h-6 text-green-600" />,
              bgColor: "from-green-50 to-emerald-50",
              borderColor: "border-green-100/60",
              change: "+18% this month"
            }
          ].map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, filter: "blur(10px)", y: 20 }}
              animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
              transition={{ duration: 0.7, ease: 'easeOut', delay: index * 0.1 }}
            >
              <Card className={`bg-gradient-to-br ${stat.bgColor} border ${stat.borderColor} shadow-lg hover:shadow-xl transition-all duration-300 group`}
                style={{boxShadow:'0 4px 16px 0 rgba(60,60,120,0.08)'}}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-white rounded-xl shadow-sm group-hover:scale-110 transition-transform duration-300">
                      {stat.icon}
                    </div>
                    <div className="text-right">
                      <div className="text-2xl md:text-3xl font-bold text-gray-900" style={{fontFamily:'Geist,Inter,sans-serif'}}>
                        {stat.value}
                      </div>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-sm font-medium text-gray-700" style={{fontFamily:'Inter,Geist,sans-serif'}}>
                      {stat.title}
                    </h3>
                    <p className="text-xs text-gray-500 flex items-center gap-1">
                      <TrendingUp className="w-3 h-3" />
                      {stat.change}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 pb-12">
        <motion.div
          initial={{ opacity: 0, filter: "blur(10px)", y: 20 }}
          animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut', delay: 0.3 }}
        >
          <Tabs defaultValue="all" className="space-y-8" onValueChange={setActiveTab}>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <TabsList className="bg-gray-50/50 p-1 rounded-xl border border-gray-200/60" style={{boxShadow:'0 2px 8px 0 rgba(60,60,120,0.04)'}}>
                <TabsTrigger 
                  value="all" 
                  className="rounded-lg px-4 py-2 text-sm font-medium data-[state=active]:bg-white data-[state=active]:shadow-sm transition-all"
                  style={{fontFamily:'Inter,Geist,sans-serif'}}
                >
                  All Creatives
                </TabsTrigger>
                <TabsTrigger 
                  value="images" 
                  className="rounded-lg px-4 py-2 text-sm font-medium data-[state=active]:bg-white data-[state=active]:shadow-sm transition-all"
                  style={{fontFamily:'Inter,Geist,sans-serif'}}
                >
                  Images
                </TabsTrigger>
                <TabsTrigger 
                  value="copy" 
                  className="rounded-lg px-4 py-2 text-sm font-medium data-[state=active]:bg-white data-[state=active]:shadow-sm transition-all"
                  style={{fontFamily:'Inter,Geist,sans-serif'}}
                >
                  Copy
                </TabsTrigger>
              </TabsList>
              
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-500" style={{fontFamily:'Inter,Geist,sans-serif'}}>
                  {creatives.length} items total
                </span>
                <div className="w-px h-4 bg-gray-300"></div>
                <Button variant="outline" size="sm" className="text-xs border-gray-200 hover:bg-gray-50">
                  Export All
                </Button>
              </div>
            </div>

            <TabsContent value="all" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {creatives.map((creative, index) => (
                  <motion.div
                    key={creative.id}
                    initial={{ opacity: 0, filter: "blur(10px)", y: 20 }}
                    animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
                    transition={{ duration: 0.7, ease: 'easeOut', delay: index * 0.05 }}
                  >
                    <Card className="group overflow-hidden bg-white border border-gray-100/60 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                      style={{boxShadow:'0 4px 16px 0 rgba(60,60,120,0.06)'}}>
                      <div className="aspect-video relative overflow-hidden bg-gray-50">
                        <Image
                          src={creative.productImage}
                          alt={creative.productName}
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300"></div>
                        <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <Button size="sm" variant="secondary" className="bg-white/90 backdrop-blur-sm h-8 w-8 p-0">
                            <Eye className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                      <CardContent className="p-6">
                        <div className="flex justify-between items-start mb-3">
                          <h3 className="font-semibold text-gray-900 text-lg group-hover:text-indigo-600 transition-colors" style={{fontFamily:'Geist,Inter,sans-serif'}}>
                            {creative.productName}
                          </h3>
                          <Badge variant="outline" className="bg-indigo-50 text-indigo-600 border-indigo-200 text-xs">
                            {creative.category}
                          </Badge>
                        </div>
                        
                        <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                          <Calendar className="w-4 h-4" />
                          <span style={{fontFamily:'Inter,Geist,sans-serif'}}>
                            {new Date(creative.date).toLocaleDateString('en-US', { 
                              month: 'short', 
                              day: 'numeric',
                              year: 'numeric'
                            })}
                          </span>
                        </div>

                        <div className="flex gap-2 flex-wrap mb-4">
                          {creative.creatives.map((item, idx) => (
                            <Badge key={idx} variant="secondary" className="text-xs bg-gray-100 text-gray-700 border-0">
                              {item.type === 'image' ? <ImageIcon className="h-3 w-3 mr-1" /> : <TextIcon className="h-3 w-3 mr-1" />}
                              {item.type}
                            </Badge>
                          ))}
                        </div>
                      </CardContent>
                      <CardFooter className="bg-gray-50/30 border-t border-gray-100 px-6 py-4 flex justify-between">
                        <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-900 hover:bg-gray-100 text-xs">
                          View Details
                        </Button>
                        <Button size="sm" className="bg-gray-900 text-white hover:bg-gray-700 text-xs px-4 rounded-lg">
                          <Download className="h-3 w-3 mr-1" />
                          Download
                        </Button>
                      </CardFooter>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="images" className="space-y-6">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {creatives.flatMap((creative, creativeIndex) => 
                  creative.creatives
                    .filter(item => item.type === 'image' && item.url)
                    .map((image, idx) => (
                      <motion.div
                        key={`${creative.id}-${idx}`}
                        initial={{ opacity: 0, filter: "blur(10px)", scale: 0.95 }}
                        animate={{ opacity: 1, filter: "blur(0px)", scale: 1 }}
                        transition={{ duration: 0.5, ease: 'easeOut', delay: (creativeIndex * creative.creatives.length + idx) * 0.02 }}
                      >
                        <Card className="group overflow-hidden bg-white border border-gray-100/60 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                          <div className="aspect-square relative overflow-hidden bg-gray-50">
                            <Image
                              src={image.url as string}
                              alt={`${creative.productName} creative`}
                              fill
                              sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                              className="object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300"></div>
                            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                              <Button size="sm" variant="secondary" className="bg-white/90 backdrop-blur-sm h-7 w-7 p-0">
                                <Download className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                          <CardContent className="p-3">
                            <p className="text-xs text-gray-600 truncate font-medium" style={{fontFamily:'Inter,Geist,sans-serif'}}>
                              {creative.productName}
                            </p>
                            <p className="text-xs text-gray-400 mt-1" style={{fontFamily:'Inter,Geist,sans-serif'}}>
                              {creative.category}
                            </p>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))
                )}
              </div>
            </TabsContent>

            <TabsContent value="copy" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {creatives.flatMap((creative, creativeIndex) => 
                  creative.creatives
                    .filter(item => item.type === 'copy' && item.content)
                    .map((copy, idx) => (
                      <motion.div
                        key={`${creative.id}-${idx}`}
                        initial={{ opacity: 0, filter: "blur(10px)", y: 20 }}
                        animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
                        transition={{ duration: 0.7, ease: 'easeOut', delay: (creativeIndex + idx) * 0.1 }}
                      >
                        <Card className="group bg-white border border-gray-100/60 hover:shadow-lg transition-all duration-300"
                          style={{boxShadow:'0 4px 16px 0 rgba(60,60,120,0.06)'}}>
                          <CardHeader className="pb-4">
                            <div className="flex justify-between items-start">
                              <div>
                                <CardTitle className="text-lg text-gray-900" style={{fontFamily:'Geist,Inter,sans-serif'}}>
                                  {creative.productName}
                                </CardTitle>
                                <CardDescription className="text-sm text-gray-500 mt-1" style={{fontFamily:'Inter,Geist,sans-serif'}}>
                                  Copy variation #{idx + 1} • {creative.category}
                                </CardDescription>
                              </div>
                              <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200 text-xs">
                                <TextIcon className="w-3 h-3 mr-1" />
                                Copy
                              </Badge>
                            </div>
                          </CardHeader>
                          <CardContent className="pt-0">
                            <div className="bg-gray-50/50 rounded-xl p-4 border border-gray-100">
                              <p className="text-sm text-gray-700 leading-relaxed" style={{fontFamily:'Inter,Geist,sans-serif'}}>
                                &quot;{copy.content}&quot;
                              </p>
                            </div>
                          </CardContent>
                          <CardFooter className="flex justify-between gap-2 pt-4">
                            <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-900 text-xs">
                              Edit Copy
                            </Button>
                            <Button variant="outline" size="sm" className="text-xs border-gray-200 hover:bg-gray-50">
                              Copy Text
                            </Button>
                          </CardFooter>
                        </Card>
                      </motion.div>
                    ))
                )}
              </div>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;