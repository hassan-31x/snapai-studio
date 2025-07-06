import Image from "next/image";
import Link from "next/link";

type Props = {
  children: React.ReactNode;
}

const AuthLayout = ({ children }: Props) => {
  return (
    <div className='min-h-screen bg-white flex flex-col' style={{fontFamily:'Inter,Geist,sans-serif'}}>
      {/* Header */}
      <div className="w-full py-6 px-6">
        <Link href="/" className="flex items-center gap-3">
          <Image src="/logo.png" alt="Snap AI Logo" width={32} height={32} className="rounded-full" />
          <span className="text-lg font-semibold text-gray-900" style={{fontFamily:'Geist,Inter,sans-serif'}}>
            Snap AI
          </span>
        </Link>
      </div>
      
      {/* Main Content */}
      <div className='flex-1 flex items-center justify-center px-6 py-12'>
        <div className="w-full max-w-md">
          {children}
        </div>
      </div>
      
      {/* Footer */}
      <div className="py-6 px-6 text-center">
        <p className="text-xs text-gray-400" style={{fontFamily:'Inter,Geist,sans-serif'}}>
          © {new Date().getFullYear()} Snap AI. All rights reserved.
        </p>
      </div>
    </div>
  )
}

export default AuthLayout