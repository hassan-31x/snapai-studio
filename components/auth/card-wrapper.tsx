"use client";

import AuthHeader from "./header";
import AuthSocial from "./social";
import BackButton from "./back-button";

type Props = {
  children: React.ReactNode;
  headerLabel: string;
  backButtonLabel: string;
  backButtonhref: string;
  showSocial?: boolean;
};

const CardWrapper = ({
  children,
  headerLabel,
  backButtonLabel,
  backButtonhref,
  showSocial = false,
}: Props) => {
  return (
    <div className="w-full max-w-md mx-auto">
      {/* Header */}
      <div className="mb-8">
        <AuthHeader label={headerLabel} />
      </div>

      {showSocial && <AuthSocial />}

      {/* Form Content */}
      <div className="mb-6">{children}</div>

      {/* Bottom Link */}
      <div className="text-center">
        <BackButton label={backButtonLabel} href={backButtonhref} />
      </div>
    </div>
  );
};

export default CardWrapper;
