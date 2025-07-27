import React from 'react'

import { Square, Minus, PaintBucket, Blend, SquareUserRoundIcon, Trash2 } from 'lucide-react'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'

const shapeSettingsList = [
  {
    name: 'Fill',
    icon: <PaintBucket />,
  },
  {
    name: 'Stroke Color',
    icon: <Square />,
  },
  {
    name: 'Stroke Width',
    icon: <Minus />,
  },
  {
    name: 'Opacity',
    icon: <Blend />,
  },
  {
    name: 'Border Radius',
    icon: <SquareUserRoundIcon />,
  },
  {
    name: 'Delete',
    icon: <Trash2 />,
  }
]

const ShapeSetting = () => {
  return (
    <div className='w-full h-full bg-white flex items-center gap-2 p-2'>
      {shapeSettingsList.map((item) => (
        <div key={item.name} className='w-10 h-10 cursor-pointer flex items-center justify-center hover:bg-gray-200 rounded-md'>
          <Popover>
            <PopoverTrigger asChild>
              {item.icon}
            </PopoverTrigger>
            <PopoverContent>
              <div>{item.name}</div>
            </PopoverContent>
          </Popover>
        </div>
      ))}
    </div>
  )
}

export default ShapeSetting