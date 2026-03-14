interface LogoProps {
  variant?: 'full' | 'compact' | 'icon';
  theme?: 'light' | 'dark';
  className?: string;
}

export function Logo({ variant = 'full', theme = 'light', className = '' }: LogoProps) {
  const darkBlue = '#0F172A';
  const green = '#059669';
  const white = '#FFFFFF';
  const textColor = theme === 'light' ? darkBlue : white;

  if (variant === 'icon') {
    return (
      <svg
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
      >
        <rect width="40" height="40" rx="10" fill={theme === 'light' ? darkBlue : white} />
        <path
          d="M11 20C11 14.477 15.477 10 21 10"
          stroke={green}
          strokeWidth="3.5"
          strokeLinecap="round"
        />
        <path
          d="M29 20C29 25.523 24.523 30 19 30"
          stroke={green}
          strokeWidth="3.5"
          strokeLinecap="round"
        />
        <circle cx="20" cy="20" r="4" fill={green} />
        <path
          d="M16 16L24 24"
          stroke={theme === 'light' ? white : darkBlue}
          strokeWidth="2"
          strokeLinecap="round"
          opacity="0.3"
        />
      </svg>
    );
  }

  if (variant === 'compact') {
    return (
      <svg
        viewBox="0 0 100 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
      >
        <rect width="40" height="40" rx="10" fill={theme === 'light' ? darkBlue : white} />
        <path
          d="M11 20C11 14.477 15.477 10 21 10"
          stroke={green}
          strokeWidth="3.5"
          strokeLinecap="round"
        />
        <path
          d="M29 20C29 25.523 24.523 30 19 30"
          stroke={green}
          strokeWidth="3.5"
          strokeLinecap="round"
        />
        <circle cx="20" cy="20" r="4" fill={green} />
        <text x="48" y="27" fill={textColor} fontFamily="Inter, sans-serif" fontWeight="700" fontSize="16">
          AM
        </text>
      </svg>
    );
  }

  return (
    <svg
      viewBox="0 0 180 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <text x="0" y="24" fill={textColor} fontFamily="Inter, sans-serif" fontWeight="700" fontSize="22">
        Arbo
      </text>
      <text x="52" y="24" fill={green} fontFamily="Inter, sans-serif" fontWeight="700" fontSize="22">
        Matcher
      </text>
    </svg>
  );
}

export function LogoText({ theme = 'light', className = '' }: { theme?: 'light' | 'dark'; className?: string }) {
  const textColor = theme === 'light' ? 'text-[#0F172A]' : 'text-white';

  return (
    <span className={`font-bold ${className}`}>
      <span className={textColor}>Arbo</span>
      <span className="text-[#059669]">Matcher</span>
    </span>
  );
}

export function LogoIcon({ theme = 'light', className = '' }: { theme?: 'light' | 'dark'; className?: string }) {
  const darkBlue = '#0F172A';
  const green = '#059669';
  const white = '#FFFFFF';

  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <rect width="32" height="32" rx="8" fill={theme === 'light' ? darkBlue : white} />
      <path
        d="M9 16C9 11.582 12.582 8 17 8"
        stroke={green}
        strokeWidth="3"
        strokeLinecap="round"
      />
      <path
        d="M23 16C23 20.418 19.418 24 15 24"
        stroke={green}
        strokeWidth="3"
        strokeLinecap="round"
      />
      <circle cx="16" cy="16" r="3" fill={green} />
    </svg>
  );
}
