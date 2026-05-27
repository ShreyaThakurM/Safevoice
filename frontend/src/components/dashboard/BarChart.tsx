interface BarChartProps {
  data: number[];
  colors?: string[];
}

export const BarChart = ({ data, colors }: BarChartProps) => {
  const max = Math.max(...data);
  return (
    <div className="flex items-end gap-3 h-28 px-2">
      {data.map((v, i) => {
        const h = (v / max) * 100;
        const color = colors?.[i] ?? "hsl(var(--clay-teal))";
        return (
          <div key={i} className="flex-1 flex flex-col items-center gap-2">
            <div
              className="w-full rounded-t-2xl rounded-b-md"
              style={{
                height: `${h}%`,
                background: `linear-gradient(180deg, ${color}, hsl(var(--clay-cream)))`,
                boxShadow:
                  "inset 0 1px 0 hsl(0 0% 100% / 0.5), 0 6px 12px -4px hsl(var(--shadow-soft) / 0.3)",
              }}
            />
          </div>
        );
      })}
    </div>
  );
};