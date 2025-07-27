import React, { useState } from 'react'
import ColorPicker from './color-picker'
import { useCanvasHook } from '../page'

const BorderColor = () => {
  const [color, setColor] = useState('#000000')
  const { canvasEditor } = useCanvasHook()

  const onColorChange = (color: string) => {
    setColor(color)
    if (canvasEditor) {
      canvasEditor.getActiveObject().set({
        stroke: color
      })
      canvasEditor.renderAll()
    }
  }

  return (
    <div>
      <ColorPicker 
        value={color}
        onChange={onColorChange}
      />
    </div>
  )
}

export default BorderColor