'use client'

import React, { useState } from 'react'
import { useParams } from 'next/navigation';
import { db } from '@/lib/db';
import { Bot, Component, Image, Text } from 'lucide-react';
import SidebarItem from './_components/sidebar-item';
import CanvasEditor from './_components/canvas-editor';

const sideItems = [
  {
    name: 'Elements',
    description: 'Add elements to your design',
    icon: Component,
  },
  {
    name: 'Images',
    description: 'Add images to your design',
    icon: Image,
  },
  {
    name: 'Text',
    description: 'Add text to your design',
    icon: Text,
  },
  {
    name: 'AI',
    description: 'Add AI to your design',
    icon: Bot,
  }
]

const DesigEditor = () => {
  const { editId } = useParams();
  const [selectedItem, setSelectedItem] = useState<string>('Elements');

  // const editInfo = db.designs.findFirst({})
  return (
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
  )
}

export default DesigEditor