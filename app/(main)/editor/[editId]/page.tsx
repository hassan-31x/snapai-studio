'use client'

import React, { useContext, useState } from 'react'
import { useParams } from 'next/navigation';
import { db } from '@/lib/db';
import { Bot, Component, Image, Palette, Text } from 'lucide-react';
import SidebarItem from './_components/sidebar-item';
import CanvasEditor from './_components/canvas-editor';
import BackgroundSetting from './_components/background-setting';
import { CanvasContext } from '@/context/canvas-provider';
import Shapes from './_components/shapes';
import ImageUpload from './_components/image-upload';

const sideItems = [
  {
    name: 'Elements',
    description: 'Add elements to your design',
    icon: Component,
    component: <Shapes />,
  },
  {
    name: 'Images',
    description: 'Add images to your design',
    icon: Image,
    component: <ImageUpload />,
  },
  {
    name: 'Text',
    description: 'Add text to your design',
    icon: Text,
    component: <></>,
  },
  {
    name: 'AI',
    description: 'Add AI to your design',
    icon: Bot,
    component: <></>,
  },
  {
    name: 'Background',
    description: 'Change the background of your design',
    icon: Palette,
    component: <BackgroundSetting />,
  }
]

const DesigEditor = () => {
  const { editId } = useParams();
  const [selectedItem, setSelectedItem] = useState<string>('Elements');
  const [canvasEditor, setCanvasEditor] = useState<any>(null);

  // const editInfo = db.designs.findFirst({})
  return (
    <CanvasContext.Provider value={{ canvasEditor, setCanvasEditor }}>
      <div className='flex h-full'>
        <div className='w-36 h-full bg-gray-100 flex flex-col gap-2'>
          {sideItems.map((item) => (
            <div key={item.name} className={`flex items-center gap-2 p-2 cursor-pointer ${selectedItem === item.name ? 'bg-gray-200' : ''}`} onClick={() => setSelectedItem(item.name)}>
              <item.icon className='w-4 h-4' />
              <span>{item.name}</span>
            </div>
          ))}
        </div>
        <SidebarItem selectedItem={sideItems.find((item) => item.name === selectedItem)} />
        <div className='flex-1 h-full bg-gray-200'>
          <CanvasEditor />
        </div>
      </div>
    </CanvasContext.Provider>

  )
}

export default DesigEditor


export const useCanvasHook = () => {
  const context = useContext(CanvasContext);
  if (!context) {
    throw new Error("useCanvasHook must be used within a CanvasContext.Provider");
  }
  return context;
};
