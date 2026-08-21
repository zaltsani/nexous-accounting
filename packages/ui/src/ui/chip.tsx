import { cn } from "../libs/utils";

type ChipVariant = "active" | "inactive";

interface ChipProps {
  label: string;
  variant?: ChipVariant;
  className?: string;
  labelClassName?: string;
  dotClassName?: string;
}

const variantStyles: Record<ChipVariant, string> = {
  active: "bg-[#308555] text-[#308555]",
  inactive: "bg-destructive text-destructive",
};

export const Chip = ({
  label,
  variant,
  className,
  labelClassName,
  dotClassName,
}: ChipProps) => {
  return (
    <div
      className={cn(
        "inline-flex items-center gap-2 px-2 py-1.5 border border-border rounded-full bg-white w-fit select-none shrink-0",
        className
      )}
    >
      <span
        className={cn(
          "h-2 w-2 rounded-full shrink-0",
          variant && variantStyles[variant],
          dotClassName
        )}
      />
      <span className={cn(
        "text-xs leading-none whitespace-nowrap shrink-0",
        labelClassName,
        variant && variantStyles[variant],
        "bg-transparent"
      )}>
        {label}
      </span>
    </div>
  );
};