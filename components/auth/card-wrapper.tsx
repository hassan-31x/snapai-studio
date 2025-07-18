"use client"

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
    <div className='w-full max-w-md mx-auto'>
      {/* Header */}
      <div className="mb-8">
        <AuthHeader label={headerLabel} />
      </div>

      {/* Social Login - Top */}
      {showSocial && (
        <div className="mb-6">
          <AuthSocial />
        </div>
      )}

      {/* Divider */}
      {showSocial && (
        <div className="relative mb-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-200"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-white text-slate-500 font-medium">or continue with e-mail</span>
          </div>
        </div>
      )}

      {/* Form Content */}
      <div className="mb-6">
        {children}
      </div>

      {/* Bottom Link */}
      <div className="text-center">
        <BackButton label={backButtonLabel} href={backButtonhref} />
      </div>
    </div>
  )
}

export default CardWrapper