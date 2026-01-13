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

  useEffect(() => {
    // Only load if the ref is available and no script/comment is already present
    if (adRef.current && adRef.current.childNodes.length === 0) {
      const adTag = `
<!-- admax -->
<script src="https://adm.shinobi.jp/s/414cb18a2dff9ceb2715e0145ecd71c4"></script>
<!-- admax -->
`;
      const range = document.createRange();
      const fragment = range.createContextualFragment(adTag.trim());
      adRef.current.appendChild(fragment);
    }
  }, []);

  return (
    <div 
      className={`flex justify-center my-8 min-h-[250px] w-full bg-slate-50/50 rounded-xl overflow-hidden border border-slate-100 items-center text-slate-400 text-sm relative ${className}`}
    >
      <div ref={adRef} className="admax-container min-w-[300px] min-h-[250px] flex justify-center items-center" />
      {/* Optional: Placeholder text while loading or if ad is blocked */}
      <div className="absolute -z-10 opacity-20">Advertisement</div>
    </div>
  );
};

export default AdBanner;
