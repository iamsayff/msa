import React, { useState } from 'react';

interface FullWidthBannerProps {
  src: string;
  alt: string;
  className?: string;
  priority?: boolean;
  edgeToEdge?: boolean;
  fitMode?: string;
}

export const FullWidthBanner: React.FC<FullWidthBannerProps> = ({
  src,
  alt,
  className = '',
  priority = true,
}) => {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div 
      className={`w-full overflow-hidden rounded-2xl sm:rounded-3xl shadow-2xs border border-slate-200/80 bg-slate-100 relative group flex items-center justify-center ${className}`}
    >
      {/* Loading Skeleton Pulse */}
      {!isLoaded && (
        <div className="absolute inset-0 bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 animate-pulse z-10 h-36 sm:h-52 md:h-64 lg:h-80" />
      )}

      <img
        src={src}
        alt={alt}
        onLoad={() => setIsLoaded(true)}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
        className={`w-full h-36 sm:h-52 md:h-64 lg:h-80 xl:h-96 object-cover object-center block select-none pointer-events-none transition-opacity duration-300 ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        }`}
      />
    </div>
  );
};
