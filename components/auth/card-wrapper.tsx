"use client"

import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import AuthHeader from './header';
import AuthSocial from './social';
import BackButton from './back-button';

type Props = {
  children: React.ReactNode;
  headerLabel: string;
  backButtonLabel: string;
  backButtonhref: string;
  showSocial?: boolean;
}

const CardWrapper = ({
  children,
  headerLabel,
  backButtonLabel,
  backButtonhref,
  showSocial = false,
}: Props) => {

  return (
    <div className="relative">
      {/* Card Background Effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-white via-indigo-50/30 to-purple-50/30 rounded-2xl blur-sm transform translate-x-1 translate-y-1"></div>
      
      <Card className='relative w-full bg-white/90 backdrop-blur-sm border border-white/20 shadow-xl rounded-2xl overflow-hidden' 
        style={{
          boxShadow: '0 20px 40px 0 rgba(60,60,120,0.12), 0 8px 16px 0 rgba(0,0,0,0.04)',
          background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(248,250,252,0.95) 100%)'
        }}>
        
        {/* Subtle top gradient bar */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400"></div>
        
        {/* Decorative corner elements */}
        <div className="absolute top-4 right-4 w-12 h-12 bg-gradient-to-br from-indigo-100/50 to-purple-100/50 rounded-full opacity-40"></div>
        <div className="absolute bottom-4 left-4 w-8 h-8 bg-gradient-to-br from-blue-100/50 to-indigo-100/50 rounded-full opacity-40"></div>
        
        <CardHeader className="pb-6 relative">
          <AuthHeader label={headerLabel} />
        </CardHeader>
        <CardContent className="px-8 relative">
          {children}
        </CardContent>
        {showSocial && (
          <CardFooter className="px-8 pb-6 relative">
            <AuthSocial />
          </CardFooter>
        )}
        <CardFooter className="px-8 pb-8 relative">
          <BackButton label={backButtonLabel} href={backButtonhref} />
        </CardFooter>
      </Card>
    </div>
  )
}

export default CardWrapper