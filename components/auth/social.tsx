"use client"

import { signIn } from 'next-auth/react'
import { FcGoogle } from 'react-icons/fc'
import { FaGithub, FaApple } from 'react-icons/fa'

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
    <div className='space-y-3'>
      <Button
        size='lg'
        className='w-full h-12 bg-white text-slate-900 border border-slate-200 font-medium'
        variant='outline'
        onClick={() => handleClick('google')}
      >
        <FcGoogle className='h-5 w-5 mr-3' />
        Continue with Google
      </Button>
      {/* TODO: add login with behance / ad accounts */}
      {/* <Button
        size='lg'
        className='w-full h-12 bg-slate-900 hover:bg-slate-800 text-white font-medium'
        onClick={() => handleClick('github')}
      >
        <FaApple className='h-5 w-5 mr-3' />
        Continue with Apple
      </Button> */}
    </div>
  )
}

export default AuthSocial