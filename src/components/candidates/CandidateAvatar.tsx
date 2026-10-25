import React, { useState } from 'react';
import { Camera, User } from 'lucide-react';
import { Candidate, PostCategoryConfig } from '../../types/election';

interface CandidateAvatarProps {
  candidate: Candidate;
  categoryConfig: PostCategoryConfig;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showPlaceholderBadge?: boolean;
}

export const CandidateAvatar: React.FC<CandidateAvatarProps> = ({
  candidate,
  categoryConfig,
  size = 'md',
  showPlaceholderBadge = true,
}) => {
  const [imgError, setImgError] = useState(false);

  const sizeClasses = {
    sm: 'w-12 h-12 text-sm',
    md: 'w-20 h-20 text-base',
    lg: 'w-24 h-24 text-lg',
    xl: 'w-28 h-28 text-xl',
  };

  const badgeSizeClasses = {
    sm: 'w-4 h-4 text-[9px]',
    md: 'w-6 h-6 text-xs',
    lg: 'w-7 h-7 text-sm',
    xl: 'w-8 h-8 text-base',
  };

  const initials = candidate.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .substring(0, 2);

  const hasRealImage = !!candidate.avatarUrl && !imgError;

  return (
    <div className="relative inline-block select-none group">
      {/* Outer ring with category theme color */}
      <div
        className={`${sizeClasses[size]} rounded-full ring-3 ${categoryConfig.themeColor.avatarBorder} ring-offset-2 p-0.5 bg-white shadow-xs overflow-hidden flex items-center justify-center transition-transform group-hover:scale-102`}
      >
        {hasRealImage ? (
          <img
            src={candidate.avatarUrl}
            alt={candidate.name}
            onError={() => setImgError(true)}
            className="w-full h-full object-cover rounded-full"
            loading="lazy"
          />
        ) : (
          /* High-fidelity Photo Placeholder */
          <div
            className="w-full h-full rounded-full flex flex-col items-center justify-center relative overflow-hidden transition-colors"
            style={{
              backgroundColor: `${categoryConfig.themeColor.accentColor}12`,
              border: `1.5px dashed ${categoryConfig.themeColor.accentColor}50`,
            }}
          >
            {/* Concentric subtle background ring */}
            <div
              className="absolute inset-1 rounded-full border border-white/60 pointer-events-none"
            />

            {/* Stylized Candidate Silhouette or Initials Seal */}
            <div className="flex flex-col items-center justify-center text-center z-10">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center mb-0.5 text-white shadow-2xs font-bold"
                style={{ backgroundColor: categoryConfig.themeColor.accentColor }}
              >
                <span className="text-xs tracking-wider">{initials}</span>
              </div>
              <span
                className="text-[9px] font-bold tracking-tight uppercase"
                style={{ color: categoryConfig.themeColor.accentColor }}
              >
                {candidate.symbolName ? candidate.symbolName.split(' ')[0] : `#${candidate.serialNumber ?? 0}`}
              </span>
            </div>

            {/* Overlay hint on hover: Candidate Photo Placeholder */}
            <div className="absolute inset-0 bg-slate-900/60 text-white opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center p-1 text-[8px] font-bold text-center">
              <Camera className="w-3.5 h-3.5 mb-0.5 text-slate-200" />
              <span>Photo</span>
            </div>
          </div>
        )}
      </div>

      {/* Ballot Number Badge on the bottom-right corner of Avatar */}
      {showPlaceholderBadge && (
        <div
          className={`absolute -bottom-1 -right-1 ${badgeSizeClasses[size]} rounded-full bg-white shadow-xs border border-slate-200/80 flex items-center justify-center transition-transform group-hover:scale-110`}
          title={`Ballot No.: #${candidate.serialNumber ?? 0}`}
        >
          <span className="font-extrabold text-[10px] text-slate-800">#{candidate.serialNumber ?? 0}</span>
        </div>
      )}
    </div>
  );
};
