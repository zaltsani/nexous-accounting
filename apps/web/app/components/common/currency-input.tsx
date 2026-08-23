import { cn, Input } from "@nexous/ui";
import { useEffect, useState } from "react";
import { formatCurrencyInputValue, parseCurrencyInputValueToNumber } from "~/libs/utils/input-utils";

interface CurrencyInputProps extends Omit<React.ComponentProps<typeof Input>, "value" | "onChange"> {
  value: number | string | null | undefined;
  onChange: (value: number | null) => void;
}

export const CurrencyInput = ({ value, onChange, className, ...props }: CurrencyInputProps) => {
  const [displayValue, setDisplayValue] = useState<string>("");

  useEffect(() => {
    if (value === null || value === undefined || value === "") {
      setDisplayValue("");
    } else {
      const currentParsed = parseCurrencyInputValueToNumber(displayValue);
      const incomingParsed = parseCurrencyInputValueToNumber(value);

      if (currentParsed !== incomingParsed) {
        setDisplayValue(formatCurrencyInputValue(value));
      }
    }
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    const formatted = formatCurrencyInputValue(inputValue);
    const numericValue = parseCurrencyInputValueToNumber(formatted);

    setDisplayValue(formatted);
    onChange(numericValue);
  };

  return (
    <div className="relative flex items-center w-full">
      <span
        className={cn(
          "absolute left-3 text-sm pointer-events-none select-none transition-colors",
          !displayValue && "text-muted-foreground"
        )}
      >
        Rp
      </span>
      <Input
        {...props}
        type="text"
        inputMode="decimal"
        className={cn("pl-8", className)}
        value={displayValue}
        onChange={handleChange}
      />
    </div>
  );
};