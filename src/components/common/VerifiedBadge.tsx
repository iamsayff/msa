import React from 'react';

interface VerifiedBadgeProps {
  className?: string;
  size?: number;
  title?: string;
}

/**
 * Stylish Twitter/X / Facebook style Blue Verified Badge (12-point Rosette with white checkmark)
 */
export const VerifiedBadge: React.FC<VerifiedBadgeProps> = ({
  className = "w-4.5 h-4.5",
  size = 18,
  title = "Verified AMU Candidate Profile"
}) => {
  return (
    <span title={title} className={`inline-flex items-center justify-center shrink-0 ${className}`}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="drop-shadow-xs select-none"
      >
        {/* Twitter/FB style 12-point rosette badge in Twitter/Meta blue (#1DA1F2) */}
        <path
          d="M22.5 12.5c0-1.58-.875-2.95-2.148-3.6.154-.435.238-.905.238-1.4 0-2.21-1.79-4-4-4-.495 0-.965.084-1.4.238C14.55 2.475 13.18 1.6 11.6 1.6c-1.58 0-2.95.875-3.6 2.148-.435-.154-.905-.238-1.4-.238-2.21 0-4 1.79-4 4 0 .495.084.965.238 1.4C1.575 9.55.7 10.92.7 12.5c0 1.58.875 2.95 2.148 3.6-.154.435-.238.905-.238 1.4 0 2.21 1.79 4 4 4 .495 0 .965-.084 1.4-.238 1.05 1.273 2.42 2.148 4 2.148 1.58 0 2.95-.875 3.6-2.148.435.154.905.238 1.4.238 2.21 0 4-1.79 4-4 0-.495-.084-.965-.238-1.4 1.273-.65 2.148-2.02 2.148-3.6z"
          fill="#1DA1F2"
        />
        {/* Crisp white checkmark */}
        <path
          d="M9.8 16.2l-3.5-3.5 1.4-1.4 2.1 2.1 6.3-6.3 1.4 1.4-7.7 7.7z"
          fill="#FFFFFF"
        />
      </svg>
    </span>
  );
};
