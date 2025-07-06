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
    <div className='w-full space-y-3'>
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-gray-200" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-white px-2 text-gray-500" style={{fontFamily:'Inter,Geist,sans-serif'}}>
            Or continue with
          </span>
        </div>
      </div>
      
      <div className='flex items-center w-full gap-x-3'>
        <Button
          size='lg'
          className='w-full border-gray-200 hover:bg-gray-50 rounded-lg py-3'
          variant='outline'
          onClick={() => handleClick('google')}
          style={{fontFamily:'Inter,Geist,sans-serif'}}
        >
          <FcGoogle className='h-5 w-5 mr-2' />
          Google
        </Button>
        <Button
          size='lg'
          className='w-full border-gray-200 hover:bg-gray-50 rounded-lg py-3'
          variant='outline'
          onClick={() => handleClick('github')}
          style={{fontFamily:'Inter,Geist,sans-serif'}}
        >
          <FaGithub className='h-5 w-5 mr-2' />
          GitHub
        </Button>
      </div>
    </div>
  )
}

export default AuthSocial