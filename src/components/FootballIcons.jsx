import React from 'react';

export function SoccerBallIcon({ size = 20, className = "" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className}>
      <circle cx="12" cy="12" r="10" />
      <polygon points="12,7 15,10 14,14 10,14 9,10" fill="currentColor" fillOpacity="0.25" stroke="currentColor" />
      <line x1="12" y1="2" x2="12" y2="7" />
      <line x1="21.5" y1="9" x2="15" y2="10" />
      <line x1="18" y1="20" x2="14" y2="14" />
      <line x1="6" y1="20" x2="10" y2="14" />
      <line x1="2.5" y1="9" x2="9" y2="10" />
    </svg>
  );
}

export function BootIcon({ size = 20, className = "" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className}>
      <path d="M3 17h18v2H3z" />
      <path d="M4 17l1-6a2 2 0 0 1 2-1.7h3l3 3.7h5a3 3 0 0 1 3 3v1H4z" />
      <circle cx="6" cy="19" r="1" fill="currentColor" />
      <circle cx="11" cy="19" r="1" fill="currentColor" />
      <circle cx="16" cy="19" r="1" fill="currentColor" />
      <circle cx="20" cy="19" r="1" fill="currentColor" />
    </svg>
  );
}

export function JerseyIcon({ size = 20, className = "" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className}>
      <path d="M6 3l3 2a4 4 0 0 0 6 0l3-2 3 5-3 2v11H6V10L3 8l3-5z" />
      <path d="M9 13h6" />
      <path d="M12 9v8" />
    </svg>
  );
}

export function GloveIcon({ size = 20, className = "" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className}>
      <path d="M7 11V4a1.5 1.5 0 0 1 3 0v5" />
      <path d="M10 9V3a1.5 1.5 0 0 1 3 0v6" />
      <path d="M13 9V4a1.5 1.5 0 0 1 3 0v7" />
      <path d="M16 11V6a1.5 1.5 0 0 1 3 0v8a6 6 0 0 1-6 6H9a5 5 0 0 1-5-5v-3a2 2 0 0 1 3.5-1.4L9 12" />
      <path d="M7 20h10" />
    </svg>
  );
}

export function BottleIcon({ size = 20, className = "" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className}>
      <rect x="9" y="2" width="6" height="3" rx="1" />
      <path d="M10 5v2a3 3 0 0 1-3 3v10a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V10a3 3 0 0 1-3-3V5" />
      <line x1="7" y1="14" x2="17" y2="14" />
      <line x1="7" y1="18" x2="17" y2="18" />
    </svg>
  );
}

export function ShinShieldIcon({ size = 20, className = "" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className}>
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <path d="M12 6v12" />
    </svg>
  );
}

export function WhistleIcon({ size = 20, className = "" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className}>
      <path d="M11 5h8a3 3 0 0 1 3 3v1a3 3 0 0 1-3 3h-1.5" />
      <circle cx="8" cy="14" r="5" />
      <path d="M11 9l2 5" />
      <circle cx="4" cy="14" r="1" fill="currentColor" />
    </svg>
  );
}

export function TrophyIcon({ size = 20, className = "" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className}>
      <path d="M6 9H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h2" />
      <path d="M18 9h2a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2h-2" />
      <path d="M6 3h12v7a6 6 0 0 1-12 0V3z" />
      <path d="M9 21h6" />
      <path d="M12 16v5" />
    </svg>
  );
}

export function SoccerBagIcon({ size = 20, className = "" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className}>
      <path d="M6 7l1-4h10l1 4" />
      <rect x="3" y="7" width="18" height="14" rx="3" />
      <circle cx="12" cy="14" r="3" stroke="currentColor" strokeWidth="1.5" />
      <line x1="3" y1="11" x2="21" y2="11" />
    </svg>
  );
}
