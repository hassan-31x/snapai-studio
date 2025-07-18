import Image from "next/image";
import Link from "next/link";
import { Sparkles } from "lucide-react";

type Props = {
  children: React.ReactNode;
}

const AuthLayout = ({ children }: Props) => {
  return (
    <div className='min-h-screen bg-white flex relative overflow-hidden' style={{fontFamily:'Inter,system-ui,sans-serif'}}>
      {/* Left Side - Auth Form */}
      <div className="flex-1 lg:flex-none lg:w-1/2 flex flex-col justify-center px-8 lg:px-16 py-12 relative z-10">
        {/* Logo */}
        <div className="absolute top-8 left-8">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-8 h-8 bg-gradient-to-br from-violet-500 to-purple-600 rounded-lg flex items-center justify-center transition-transform group-hover:scale-105">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="text-xl font-semibold text-slate-900">
              Snap AI
            </span>
          </Link>
        </div>

        {/* Main Content */}
        <div className="max-w-md mx-auto w-full">
          {children}
        </div>

        {/* Footer Text */}
        <div className="absolute bottom-8 left-8 right-8 text-center lg:text-left">
          <p className="text-sm text-slate-500">
            By proceeding, you agree to our{" "}
            <Link href="/terms" className="text-violet-600 hover:text-violet-700 underline">
              Terms of use
            </Link>
            .{" "}
            <br className="hidden sm:inline" />
            Read our{" "}
            <Link href="/privacy" className="text-violet-600 hover:text-violet-700 underline">
              Privacy Policy
            </Link>
            .
          </p>
        </div>
      </div>

      {/* Right Side - Background Image */}
      <div className="hidden lg:block lg:w-1/2 relative">
        {/* Background Image */}
        <div className="absolute inset-0 bg-gradient-to-br from-violet-600 via-purple-600 to-pink-600">
          <div className="absolute inset-0 bg-black/20"></div>
          {/* You can replace this with an actual image */}
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&q=80')] bg-cover bg-center opacity-60"></div>
        </div>

        {/* Overlay Content */}
        <div className="absolute inset-0 flex items-center justify-center p-16">
          <div className="text-center text-white">
            <h1 className="text-4xl font-bold mb-6 leading-tight">
              Create Stunning AI Marketing Creatives
            </h1>
            <p className="text-xl text-violet-100 mb-8 leading-relaxed">
              Transform your products into professional ad creatives with the power of AI. Generate images, videos, and copy that convert.
            </p>
            <div className="flex items-center justify-center gap-4">
              <div className="px-4 py-2 bg-white/20 rounded-full backdrop-blur-sm border border-white/30">
                <span className="text-sm font-medium">✨ Powered by AI</span>
              </div>
              <div className="px-4 py-2 bg-white/20 rounded-full backdrop-blur-sm border border-white/30">
                <span className="text-sm font-medium">🚀 Fast Generation</span>
              </div>
            </div>
          </div>
        </div>

        {/* Floating Elements */}
        <div className="absolute top-8 right-8 w-16 h-16 bg-white/10 rounded-2xl backdrop-blur-sm flex items-center justify-center animate-pulse">
          <Sparkles className="w-8 h-8 text-white" />
        </div>
        <div className="absolute bottom-8 left-8 w-12 h-12 bg-white/10 rounded-xl backdrop-blur-sm flex items-center justify-center animate-pulse delay-500">
          <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
          </svg>
        </div>
      </div>

      {/* Mobile Background Pattern */}
      <div className="lg:hidden absolute inset-0 bg-gradient-to-br from-slate-50 to-violet-50/30">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(139,92,246,0.05)_1px,transparent_0)] [background-size:24px_24px]"></div>
      </div>
    </div>
  )
}

export default AuthLayout