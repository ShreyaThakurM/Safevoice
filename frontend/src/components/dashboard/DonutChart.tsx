interface DonutProps {
  segments: { value: number; color: string }[];
  size?: number;
  thickness?: number;
  centerLabel?: string;
  centerSub?: string;
}

export const DonutChart = ({ segments, size = 160, thickness = 28, centerLabel, centerSub }: DonutProps) => {
  const radius = (size - thickness) / 2;
  const circumference = 2 * Math.PI * radius;
  const total = segments.reduce((s, x) => s + x.value, 0);
  let offset = 0;

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <defs>
          <filter id="donut-shadow" x="-50%" y="-50%" width="200%" height="200%">
            <feDropShadow dx="0" dy="3" stdDeviation="3" floodColor="hsl(var(--shadow-soft))" floodOpacity="0.25" />
          </filter>
        </defs>
        {segments.map((s, i) => {
          const len = (s.value / total) * circumference;
          const dasharray = `${len} ${circumference - len}`;
          const el = (
            <circle
              key={i}
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="none"
              stroke={s.color}
              strokeWidth={thickness}
              strokeDasharray={dasharray}
              strokeDashoffset={-offset}
              strokeLinecap="butt"
              filter="url(#donut-shadow)"
            />
          );
          offset += len;
          return el;
        })}
      </svg>
      {(centerLabel || centerSub) && (
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          {centerLabel && <span className="text-2xl font-semibold text-foreground/90">{centerLabel}</span>}
          {centerSub && <span className="text-[10px] text-muted-foreground tracking-wide uppercase">{centerSub}</span>}
        </div>
      )}
    </div>
  );
};