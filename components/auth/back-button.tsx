"use client"

import { Button } from '@/components/ui/button'
import Link from 'next/link'

type Props = {
  label: string
  href: string
}

const BackButton = ({
  label,
  href,
}: Props) => {
  return (
    <Button
      variant='link'
      className='font-normal w-full text-gray-600 hover:text-gray-900'
      size='sm'
      asChild
      style={{fontFamily:'Inter,Geist,sans-serif'}}
    >
      <Link href={href}>
        {label}
      </Link>
    </Button>
  )
}

export default BackButton