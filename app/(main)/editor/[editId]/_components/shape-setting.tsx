import React from 'react'

import { Square, Minus, PaintBucket, Blend, SquareUserRoundIcon, Trash2 } from 'lucide-react'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import FillColor from './fill-color'
import BorderColor from './border-color'
import BorderWidth from './border-width'
import Opacity from './opacity'
import BorderRadius from './border-radius'
import { useCanvasHook } from '../page'

const shapeSettingsList = [
  {
    name: 'Fill',
    icon: <PaintBucket />,
    component: <FillColor />,
  },
  {
    name: 'Stroke Color',
    icon: <Square />,
    component: <BorderColor />,
  },
  {
    name: 'Stroke Width',
    icon: <Minus />,
    component: <BorderWidth />,
  },
  {
    name: 'Opacity',
    icon: <Blend />,
    component: <Opacity />,
  },
  {
    name: 'Border Radius',
    icon: <SquareUserRoundIcon />,
    component: <BorderRadius />,
  },
]

const ShapeSetting = () => {
  const { canvasEditor } = useCanvasHook()

  const handleDelete = () => {
    const activeObject = canvasEditor?.getActiveObject()
    if (activeObject) {
      canvasEditor.remove(activeObject)
      canvasEditor.renderAll()
    }
  }
  return (
    <div className='w-full h-full bg-white flex items-center gap-2 p-2'>
      {shapeSettingsList.map((item) => (
        <div key={item.name} className='w-10 h-10 cursor-pointer flex items-center justify-center hover:bg-gray-200 rounded-md'>
          <Popover>
            <PopoverTrigger asChild>
              {item.icon}
            </PopoverTrigger>
            <PopoverContent>
              {item.component}
            </PopoverContent>
          </Popover>
        </div>
      ))}
      <div onClick={handleDelete} className='w-10 h-10 cursor-pointer flex items-center justify-center hover:bg-gray-200 rounded-md'>
        <Trash2 />
      </div>
    </div>
  )
}

export default ShapeSetting