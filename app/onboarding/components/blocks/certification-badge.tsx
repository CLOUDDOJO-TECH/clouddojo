"use client";

import Image from "next/image";
import { Certification } from "../data/certifications_data";

interface CertificationBadgeProps {
  certification: Certification;
  isSelected: boolean;
  onSelect: (certificationId: string) => void;
}

export function CertificationBadge({
  certification,
  isSelected,
  onSelect,
}: CertificationBadgeProps) {
  return (
    <button
      onClick={() => onSelect(certification.id)}
      className={`
        relative flex flex-col items-center p-2 sm:p-4 rounded-lg border-2 border-dashed
        transition-all duration-200 active:scale-95 sm:hover:scale-105
        backdrop-blur-sm w-full
        ${
          isSelected
            ? "border-emerald-500 bg-emerald-50/40 dark:bg-emerald-500/10 shadow-lg shadow-emerald-500/20"
            : "border-gray-300 dark:border-gray-600 bg-white/20 dark:bg-white/5 hover:border-gray-400 dark:hover:border-gray-500 hover:bg-white/30 dark:hover:bg-white/10"
        }
      `}
    >
      {isSelected && (
        <div className="absolute top-1.5 right-1.5 sm:top-2 sm:right-2 z-10">
          <svg
            className="w-4 h-4 sm:w-6 sm:h-6 text-emerald-500 animate-in zoom-in-75 duration-200"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      )}

      <div className="w-full flex items-center justify-center mb-1.5 sm:mb-3 aspect-square max-h-24 sm:max-h-32">
        <Image
          src={certification.imagePath}
          alt={certification.name}
          width={120}
          height={120}
          className="object-contain w-full h-full"
        />
      </div>

      <div className="text-center w-full px-1">
        <p className="text-[11px] sm:text-sm font-semibold text-gray-900 dark:text-white mb-0.5 sm:mb-1 line-clamp-2">
          {certification.name}
        </p>
        <p className="text-[9px] sm:text-xs text-gray-600 dark:text-gray-400 line-clamp-2 hidden sm:block">
          {certification.description}
        </p>
      </div>
    </button>
  );
}
