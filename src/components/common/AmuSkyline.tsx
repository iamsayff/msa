import React from 'react';

interface AmuSkylineProps {
  className?: string;
  fill?: string;
  opacity?: number;
}

export const AmuSkyline: React.FC<AmuSkylineProps> = ({
  className = 'w-full h-12',
  fill = '#059669',
  opacity = 0.35,
}) => {
  return (
    <svg
      viewBox="0 0 600 100"
      preserveAspectRatio="none"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      fill={fill}
      opacity={opacity}
    >
      {/* Base ground line */}
      <rect x="0" y="90" width="600" height="10" />

      {/* Left campus buildings */}
      <rect x="15" y="60" width="30" height="30" rx="1" />
      <rect x="22" y="45" width="16" height="15" rx="1" />
      <polygon points="30,30 20,45 40,45" />

      {/* Minaret 1 */}
      <rect x="65" y="25" width="14" height="65" rx="1" />
      <rect x="62" y="20" width="20" height="5" rx="1" />
      <polygon points="72,5 64,20 80,20" />
      {/* Minaret dome tip */}
      <circle cx="72" cy="4" r="2" />

      {/* Arched Hallway 1 */}
      <rect x="95" y="55" width="45" height="35" rx="2" />
      <path d="M102,90 V70 Q117,55 132,70 V90 Z" fill="#ffffff" opacity="0.3" />

      {/* Bab-e-Syed Grand Gate / Central Arch */}
      <rect x="155" y="40" width="70" height="50" rx="2" />
      <path d="M170,90 V60 Q190,40 210,60 V90 Z" fill="#ffffff" opacity="0.35" />
      <polygon points="190,25 155,40 225,40" />
      {/* Little dome on gate */}
      <path d="M180,25 Q190,12 200,25 Z" />

      {/* Central Grand Strachey Hall Minaret */}
      <rect x="245" y="15" width="18" height="75" rx="1" />
      <rect x="241" y="12" width="26" height="4" rx="1" />
      <polygon points="254,0 243,12 265,12" />
      <circle cx="254" cy="0" r="2.5" />

      {/* Grand Central Mosque / Hall Dome */}
      <rect x="280" y="45" width="80" height="45" rx="2" />
      <path d="M295,45 C295,15 345,15 345,45 Z" />
      <line x1="320" y1="15" x2="320" y2="4" stroke={fill} strokeWidth="3" />
      <circle cx="320" cy="3" r="2" />
      {/* Arched windows */}
      <path d="M305,90 V65 Q320,52 335,65 V90 Z" fill="#ffffff" opacity="0.3" />

      {/* Twin Minaret 2 */}
      <rect x="375" y="15" width="18" height="75" rx="1" />
      <rect x="371" y="12" width="26" height="4" rx="1" />
      <polygon points="384,0 373,12 395,12" />
      <circle cx="384" cy="0" r="2.5" />

      {/* Library / Science building */}
      <rect x="410" y="50" width="55" height="40" rx="1" />
      <rect x="420" y="38" width="35" height="12" rx="1" />
      <polygon points="437.5,24 418,38 457,38" />

      {/* Right Minaret & Hall */}
      <rect x="480" y="30" width="14" height="60" rx="1" />
      <polygon points="487,12 479,30 495,30" />
      <rect x="510" y="58" width="40" height="32" rx="1" />
      <rect x="565" y="65" width="25" height="25" rx="1" />
    </svg>
  );
};
