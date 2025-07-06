import Image from "next/image";
import Link from "next/link";

type Props = {
  children: React.ReactNode;
}

const AuthLayout = ({ children }: Props) => {
  return (
    <div className='min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex flex-col relative overflow-hidden' style={{fontFamily:'Inter,Geist,sans-serif'}}>
      {/* Background Graphics */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Gradient Orbs */}
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-indigo-200 to-purple-200 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-blue-200 to-indigo-200 rounded-full opacity-20 animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full opacity-10 animate-pulse delay-2000"></div>
        
        {/* Grid Pattern */}
        <div 
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(139,92,246,0.3) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(139,92,246,0.3) 1px, transparent 1px)
            `,
            backgroundSize: "32px 32px",
          }}
        ></div>
        
        {/* Floating Icons */}
        <div className="absolute top-20 left-20 text-indigo-200 opacity-30 animate-bounce" style={{animationDelay: '0s', animationDuration: '3s'}}>
          <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd"></path>
          </svg>
        </div>
        <div className="absolute top-40 right-32 text-purple-200 opacity-30 animate-bounce" style={{animationDelay: '1s', animationDuration: '3s'}}>
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
          </svg>
        </div>
        <div className="absolute bottom-32 left-32 text-blue-200 opacity-30 animate-bounce" style={{animationDelay: '2s', animationDuration: '3s'}}>
          <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd"></path>
          </svg>
        </div>
        <div className="absolute bottom-20 right-20 text-indigo-200 opacity-30 animate-bounce" style={{animationDelay: '0.5s', animationDuration: '3s'}}>
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd"></path>
          </svg>
        </div>
      </div>
      
      {/* Header */}
      <div className="relative z-10 w-full py-6 px-6">
        <Link href="/" className="flex items-center group">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-400 to-purple-400 rounded-full opacity-20 group-hover:opacity-30 transition-opacity"></div>
            <Image src="/logo.png" alt="Snap AI Logo" width={36} height={36} className="rounded-full relative z-10" />
          </div>
          <span className="text-xl font-semibold bg-gradient-to-r from-gray-900 to-indigo-700 bg-clip-text text-transparent" style={{fontFamily:'Geist,Inter,sans-serif'}}>
            Snap AI
          </span>
        </Link>
      </div>
      
      {/* Main Content */}
      <div className='flex-1 flex items-center justify-center px-6 py-12 relative z-10'>
        <div className="w-full max-w-md">
          {children}
        </div>
      </div>
      
      {/* Footer */}
      <div className="relative z-10 py-6 px-6 text-center">
        <p className="text-xs text-gray-500" style={{fontFamily:'Inter,Geist,sans-serif'}}>
          © {new Date().getFullYear()} Snap AI. All rights reserved.
        </p>
      </div>
    </div>
  )
}

export default AuthLayout