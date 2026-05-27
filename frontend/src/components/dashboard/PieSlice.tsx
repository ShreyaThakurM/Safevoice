interface PieProps {
  segments: { value: number; color: string }[];
  size?: number;
}

export const PieSlice = ({ segments, size = 200 }: PieProps) => {
  const total = segments.reduce((s, x) => s + x.value, 0);
  const cx = size / 2;
  const cy = size / 2;
  const r = size / 2 - 4;
  let cumulative = 0;

  const paths = segments.map((s, i) => {
    const startAngle = (cumulative / total) * Math.PI * 2 - Math.PI / 2;
    cumulative += s.value;
    const endAngle = (cumulative / total) * Math.PI * 2 - Math.PI / 2;
    const x1 = cx + r * Math.cos(startAngle);
    const y1 = cy + r * Math.sin(startAngle);
    const x2 = cx + r * Math.cos(endAngle);
    const y2 = cy + r * Math.sin(endAngle);
    const largeArc = endAngle - startAngle > Math.PI ? 1 : 0;
    const d = `M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2} Z`;
    return <path key={i} d={d} fill={s.color} />;
  });

  return (
    <svg width={size} height={size} className="drop-shadow-[0_8px_12px_hsl(var(--shadow-soft)/0.25)]">
      <defs>
        <radialGradient id="pie-sheen" cx="35%" cy="30%" r="70%">
          <stop offset="0%" stopColor="hsl(0 0% 100%)" stopOpacity="0.35" />
          <stop offset="60%" stopColor="hsl(0 0% 100%)" stopOpacity="0" />
        </radialGradient>
      </defs>
      {paths}
      <circle cx={cx} cy={cy} r={r} fill="url(#pie-sheen)" />
    </svg>
  );
};