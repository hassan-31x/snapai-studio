"use client"

import { signIn } from 'next-auth/react'
import { FcGoogle } from 'react-icons/fc'
import { FaGithub } from 'react-icons/fa'

import { Button } from '@/components/ui/button'
import { DEFAULT_LOGIN_REDIRECT } from '@/routes'

type Props = {}

const AuthSocial = (props: Props) => {
  const handleClick = (provider: "google" | "github") => {
    signIn(provider, {
      callbackUrl: DEFAULT_LOGIN_REDIRECT
    })
  }

  return (
    <div className='w-full space-y-4'>
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-gradient-to-r from-gray-200 via-gray-300 to-gray-200" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-white px-4 text-gray-500 font-medium" style={{fontFamily:'Inter,Geist,sans-serif'}}>
            Or continue with
          </span>
        </div>
      </div>
      
      <div className='flex items-center w-full gap-x-3'>
        <Button
          size='lg'
          className='w-full border border-gray-200/60 hover:border-indigo-200 hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 rounded-xl py-3 transition-all duration-200 group shadow-sm hover:shadow-md'
          variant='outline'
          onClick={() => handleClick('google')}
          style={{fontFamily:'Inter,Geist,sans-serif'}}
        >
          <FcGoogle className='h-5 w-5 mr-2 group-hover:scale-110 transition-transform duration-200' />
          <span className="font-medium">Google</span>
        </Button>
        <Button
          size='lg'
          className='w-full border border-gray-200/60 hover:border-gray-300 hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100 rounded-xl py-3 transition-all duration-200 group shadow-sm hover:shadow-md'
          variant='outline'
          onClick={() => handleClick('github')}
          style={{fontFamily:'Inter,Geist,sans-serif'}}
        >
          <FaGithub className='h-5 w-5 mr-2 group-hover:scale-110 transition-transform duration-200' />
          <span className="font-medium">GitHub</span>
        </Button>
      </div>
    </div>
  )
}

export default AuthSocial