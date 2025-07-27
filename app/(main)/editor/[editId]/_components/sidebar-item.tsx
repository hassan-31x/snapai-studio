import React from 'react'

type Props = {
    selectedItem: {
        name: string;
        description: string;
    } | undefined;
}

const SidebarItem = ({ selectedItem }: Props) => {
  return (
    <div className='w-64 h-full bg-gray-200'>
      <h2 className='text-lg font-bold'>{selectedItem?.name}</h2>
      <p className='text-sm text-gray-500'>{selectedItem?.description}</p>
    </div>
  )
}

export default SidebarItem