import React, { useEffect, useRef } from 'react';

interface AdBannerProps {
  className?: string;
}

/**
 * AdBanner Component for Ninja AdMax
 * This component dynamically loads the ad script provided by the user.
 */
const AdBanner: React.FC<AdBannerProps> = ({ className = '' }) => {
  const adRef = useRef<HTMLDivElement>(null);

  return (
    <div 
      className={`flex justify-center my-8 min-h-[250px] w-full bg-slate-50/50 rounded-xl overflow-hidden border border-slate-100 items-center text-slate-400 text-sm relative ${className}`}
    >
      <iframe
        src="/ad.html"
        width="300"
        height="250"
        frameBorder="0"
        scrolling="no"
        marginHeight={0}
        marginWidth={0}
        title="Advertisement"
        className="z-10"
        style={{ overflow: 'hidden' }}
      />
      {/* Optional: Placeholder text while loading or if ad is blocked */}
      <div className="absolute -z-10 opacity-20">Advertisement</div>
    </div>
  );
};

export default AdBanner;
