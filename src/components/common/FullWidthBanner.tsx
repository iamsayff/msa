import React from 'react';

interface FullWidthBannerProps {
  src: string;
  alt: string;
  className?: string;
  edgeToEdge?: boolean;
}

export const FullWidthBanner: React.FC<FullWidthBannerProps> = ({
  src,
  alt,
  className = '',
  edgeToEdge = true,
}) => {
  return (
    <div 
      className={`w-full overflow-hidden select-none pointer-events-none ${
        edgeToEdge 
          ? '-mx-4 sm:-mx-6 lg:-mx-8 w-[calc(100%+2rem)] sm:w-[calc(100%+3rem)] lg:w-[calc(100%+4rem)] rounded-none sm:rounded-2xl lg:rounded-3xl shadow-xs' 
          : 'rounded-2xl sm:rounded-3xl shadow-xs'
      } border-y sm:border border-slate-200/80 bg-slate-100 ${className}`}
    >
      <img
        src={src}
        alt={alt}
        className="w-full h-44 sm:h-56 md:h-72 lg:h-80 xl:h-96 object-cover block select-none pointer-events-none"
        loading="lazy"
      />
    </div>
  );
};
