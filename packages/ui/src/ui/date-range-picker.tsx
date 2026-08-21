import type { ButtonProps } from "@base-ui/react";
import { endOfDay, format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { type DateRange } from "react-day-picker";

import { Button } from "./button";
import { Calendar } from "./calendar";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";

export type DateRangePickerProps = Omit<ButtonProps, "value" | "onChange"> & {
  value: DateRange | undefined;
  onChange: (date: DateRange | undefined) => void;
  placeholder?: string;
};

export function DateRangePicker({
  value,
  onChange,
  placeholder = "Pick a date",
  className,
  ...props
}: DateRangePickerProps) {
  const handleSelect = (range: DateRange | undefined) => {
    if (!range) {
      onChange(undefined);
      return;
    }

    onChange({
      from: range.from,
      to: range.to ? endOfDay(range.to) : undefined,
    });
  };

  return (
    <Popover>
      <PopoverTrigger>
        <Button
          variant="outline"
          className={`justify-start px-2.5 font-normal ${className ?? ""}`}
          {...props}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {value?.from ? (
            value.to ? (
              <>
                {format(value.from, "LLL dd, y")} - {format(value.to, "LLL dd, y")}
              </>
            ) : (
              format(value.from, "LLL dd, y")
            )
          ) : (
            <span className="text-muted-foreground">{placeholder}</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="range"
          defaultMonth={value?.from}
          selected={value}
          onSelect={handleSelect}
          numberOfMonths={1}
        />
      </PopoverContent>
    </Popover>
  );
}
