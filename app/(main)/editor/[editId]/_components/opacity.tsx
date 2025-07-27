import React, { useState } from 'react'
import ColorPicker from './color-picker'
import { useCanvasHook } from '../page'
import { Slider } from '@/components/ui/slider'

const Opacity = () => {
  const [opacity, setOpacity] = useState(1)
  const { canvasEditor } = useCanvasHook()

  const onOpacityChange = (value: number) => {
    setOpacity(value)
    if (canvasEditor) {
      canvasEditor.getActiveObject().set({
        opacity: value
      })
      canvasEditor.renderAll()
    }
  }

  return (
    <div>
      <h2>Opacity</h2>
      <Slider defaultValue={[opacity]} max={1} step={0.1} onValueChange={value => onOpacityChange(value[0])} />
    </div>
  )
}

export default Opacity