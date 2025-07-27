import React from 'react'
import { ChromePicker, CirclePicker } from 'react-color'

const ColorPicker = ({ value, onChange }: { value: string, onChange: (color: string) => void }) => {
  return (
    <div className='space-y-4'>
      <ChromePicker 
        color={value}
        onChange={(color) => onChange(color.hex)}
        className=''
      />
      <CirclePicker 
        color={value}
        onChange={(color) => onChange(color.hex)}
        className=''
      />
    </div>
  )
}

export default ColorPicker