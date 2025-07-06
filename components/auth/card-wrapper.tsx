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
    <Card className='w-full bg-white border border-gray-100/60 shadow-lg rounded-2xl' 
      style={{boxShadow:'0 8px 32px 0 rgba(60,60,120,0.08)'}}>
      <CardHeader className="pb-6">
        <AuthHeader label={headerLabel} />
      </CardHeader>
      <CardContent className="px-8">
        {children}
      </CardContent>
      {showSocial && (
        <CardFooter className="px-8 pb-6">
          <AuthSocial />
        </CardFooter>
      )}
      <CardFooter className="px-8 pb-8">
        <BackButton label={backButtonLabel} href={backButtonhref} />
      </CardFooter>
    </Card>
  )
}

export default CardWrapper