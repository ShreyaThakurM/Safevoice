import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface ClayCardProps {
  children: ReactNode;
  className?: string;
  title?: string;
  subtitle?: string;
  showDot?: boolean;
}

export const ClayCard = ({ children, className, title, subtitle, showDot = true }: ClayCardProps) => {
  return (
    <div className={cn("glass-card relative p-6 overflow-hidden", className)}>
      {showDot && (
        <div className="absolute top-5 left-5 w-3.5 h-3.5 rounded-full clay-dot" />
      )}
      {(title || subtitle) && (
        <div className="pl-7 mb-4">
          {title && <h3 className="text-sm font-medium text-foreground/80 tracking-tight">{title}</h3>}
          {subtitle && <p className="text-[11px] text-muted-foreground mt-0.5">{subtitle}</p>}
        </div>
      )}
      {children}
    </div>
  );
};