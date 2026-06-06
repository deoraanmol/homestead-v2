import { cn } from "@/lib/utils";

type Props = {
  rating: number;
  max?: number;
  size?: "sm" | "md" | "lg";
  showValue?: boolean;
  className?: string;
};

export function StarRating({
  rating,
  max = 5,
  size = "md",
  showValue = false,
  className,
}: Props) {
  const sizeClass =
    size === "sm" ? "h-3.5 w-3.5 text-xs" : size === "lg" ? "h-5 w-5 text-base" : "h-4 w-4 text-sm";

  return (
    <div className={cn("inline-flex items-center gap-1", className)}>
      <div className="inline-flex" aria-label={`Rating: ${rating} out of ${max}`}>
        {Array.from({ length: max }).map((_, i) => {
          const filled = rating >= i + 1;
          const partial = !filled && rating > i && rating < i + 1;
          return (
            <span
              key={i}
              className={cn(
                sizeClass,
                filled || partial ? "text-amber-400" : "text-slate-300"
              )}
            >
              ★
            </span>
          );
        })}
      </div>
      {showValue && (
        <span className={cn("font-semibold text-slate-700", sizeClass)}>{rating.toFixed(1)}</span>
      )}
    </div>
  );
}
