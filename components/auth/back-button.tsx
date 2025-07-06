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
      className='font-medium w-full text-gray-600 hover:text-indigo-600 transition-colors duration-200 group'
      size='sm'
      asChild
      style={{fontFamily:'Inter,Geist,sans-serif'}}
    >
      <Link href={href} className="flex items-center justify-center gap-1">
        <span className="group-hover:underline decoration-indigo-400 underline-offset-2">
          {label}
        </span>
        <svg className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </Link>
    </Button>
  )
}

export default BackButton