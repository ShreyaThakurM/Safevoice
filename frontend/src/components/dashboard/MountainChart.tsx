export const MountainChart = () => {
  return (
    <div className="relative w-full h-56">
      <svg viewBox="0 0 600 240" className="w-full h-full" preserveAspectRatio="none">
        <defs>
          <linearGradient id="g-sage" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="hsl(var(--clay-sage))" stopOpacity="0.85" />
            <stop offset="100%" stopColor="hsl(var(--clay-sage))" stopOpacity="0.55" />
          </linearGradient>
          <linearGradient id="g-teal" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="hsl(var(--clay-teal))" stopOpacity="0.7" />
            <stop offset="100%" stopColor="hsl(var(--clay-teal))" stopOpacity="0.4" />
          </linearGradient>
          <linearGradient id="g-peach" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="hsl(var(--clay-peach))" stopOpacity="0.95" />
            <stop offset="100%" stopColor="hsl(var(--clay-terracotta))" stopOpacity="0.7" />
          </linearGradient>
          <filter id="soft" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="0.6" />
          </filter>
        </defs>

        <path
          d="M0,200 C80,140 140,90 220,110 C300,130 360,60 440,80 C520,100 560,150 600,140 L600,240 L0,240 Z"
          fill="url(#g-sage)"
          filter="url(#soft)"
        />
        <path
          d="M0,210 C90,170 160,130 240,150 C320,170 380,110 470,130 C540,145 580,180 600,175 L600,240 L0,240 Z"
          fill="url(#g-teal)"
          filter="url(#soft)"
        />
        <path
          d="M0,225 C100,200 180,170 280,185 C360,197 430,160 510,175 C560,184 585,205 600,200 L600,240 L0,240 Z"
          fill="url(#g-peach)"
          filter="url(#soft)"
        />
      </svg>
    </div>
  );
};