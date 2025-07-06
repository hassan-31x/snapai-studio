import { cn } from '@/lib/utils'

type Props = {
  label: string
}

const AuthHeader = ({ label }: Props) => {
  return (
    <div className='w-full flex flex-col items-center justify-center gap-y-4 relative'>
      {/* Decorative icon */}
      <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mb-2 relative group">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform scale-105"></div>
        <svg className="w-8 h-8 text-white relative z-10" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z" clipRule="evenodd"></path>
        </svg>
      </div>

      <h1 className="text-2xl md:text-3xl font-semibold bg-gradient-to-br from-gray-900 via-indigo-800 to-purple-700 bg-clip-text text-transparent" style={{fontFamily:'Geist,Inter,sans-serif'}}>
        Welcome
      </h1>
      <p className='text-gray-600 text-sm text-center max-w-sm leading-relaxed' style={{fontFamily:'Inter,Geist,sans-serif'}}>
        {label}
      </p>
    </div>
  )
}

export default AuthHeader