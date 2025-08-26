
import React from 'react';

type IconProps = {
  className?: string;
};

export const AdminIcon: React.FC<IconProps> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.096 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
);

export const InternalMedicineIcon: React.FC<IconProps> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2v.5a2 2 0 01-2 2h-1a2 2 0 00-2 2v1a2 2 0 002 2h2a2 2 0 002-2v-2.945M12 3.935A2.5 2.5 0 0114.5 1.5h1A2.5 2.5 0 0118 3.935V5.5A2.5 2.5 0 0115.5 8h-.5a2 2 0 00-2 2v.5a2 2 0 002 2h1a2 2 0 012 2v1a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2.945m-3.75-1.065a2.5 2.5 0 01-2.5-2.5V3.935A2.5 2.5 0 018.5 1.5h.5a2 2 0 012 2v.5a2 2 0 01-2 2h-1a2 2 0 00-2 2v1a2 2 0 002 2h.5" />
  </svg>
);

export const PediatricsIcon: React.FC<IconProps> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 2C9.238 2 7 4.238 7 7c0 1.513.565 2.895 1.5 3.97V17c0 1.105.895 2 2 2h3c1.105 0 2-.895 2-2v-6.03A4.978 4.978 0 0017 7c0-2.762-2.238-5-5-5zm-2 18h4v2h-4v-2z" />
        <circle cx="10" cy="11" r="1" />
        <circle cx="14" cy="11" r="1" />
    </svg>
);

export const SurgeryIcon: React.FC<IconProps> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9.26c-.23-.23-.48-.44-.74-.63l-8.5 8.5c.19.26.4.51.63.74 3.12 3.12 8.18 3.12 11.3 0s3.12-8.18 0-11.3c-.63-.63-1.3-1.17-2.02-1.63M12 10l-1.5 1.5M10 12l1.5-1.5" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2m0 14v2m-9-9H3m18 0h-2M5.64 5.64L4.22 4.22m15.56 15.56l-1.42-1.42M5.64 18.36l-1.42 1.42m15.56-15.56l-1.42-1.42" />
  </svg>
);

export const GynecologyIcon: React.FC<IconProps> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 14c-1.657 0-3-1.343-3-3s1.343-3 3-3 3 1.343 3 3-1.343 3-3 3z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 2v6m0 8v6m-6-8h-2c-1.105 0-2 .895-2 2v0c0 1.105.895 2 2 2h2m12-4h2c1.105 0 2 .895 2 2v0c0 1.105-.895 2-2 2h-2" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M16 3.5a4 4 0 10-8 0" />
  </svg>
);

export const FamilyMedicineIcon: React.FC<IconProps> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0h6" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 15V9" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6" />
    </svg>
);


export const PsychiatryIcon: React.FC<IconProps> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 2a10 10 0 00-2.828 19.497A10 10 0 0012 22a10 10 0 009.9-8.5M12 2v9m0 0H9m3 0h3m-3 0l-3 4m3-4l3 4" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 10.5a7.5 7.5 0 1115 0" />
    </svg>
);

export const EmergencyMedicineIcon: React.FC<IconProps> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2.5-2.5 2 2 3-5 3 5 2-2L18 12h3" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 21l-2-3h4l-2 3zM12 3l2 3h-4l2-3zM3 12l3-2v4l-3-2zM21 12l-3-2v4l3-2z" />
    </svg>
);

export const BioethicsIcon: React.FC<IconProps> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v18m-7-3h14M5 6l7 4 7-4M5 18l7-4 7 4" />
    </svg>
);

export const PublicHealthIcon: React.FC<IconProps> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.273 12.001c4.567-4.567 13.157-4.567 17.454 0M12 3.273c-4.567 4.567-4.567 13.157 0 17.454" />
    </svg>
);

export const JurisprudenceIcon: React.FC<IconProps> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 4h18M6 4l1 16h10l1-16M12 4v16" />
    </svg>
);

export const ShuffleIcon: React.FC<IconProps> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" />
    </svg>
);

export const SunIcon: React.FC<IconProps> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
  </svg>
);

export const MoonIcon: React.FC<IconProps> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
  </svg>
);