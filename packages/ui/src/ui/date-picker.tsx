import * as React from "react";

import { CalendarIcon } from "lucide-react";
import { Button } from "./button";
import { Calendar } from "./calendar";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";

type DatePickerProps = {
  date: string | undefined;
  setDate: (date: string | undefined) => void;
  placeholder?: string;
};

export function DatePicker({ date, setDate, placeholder }: DatePickerProps) {
  const [open, setOpen] = React.useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger>
        <Button variant="outline" id="date" className="w-full justify-between font-normal">
          {date ? new Date(date).toLocaleDateString() : (placeholder ?? "Select date")}
          <CalendarIcon />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto overflow-hidden p-0" align="start">
        <Calendar
          mode="single"
          selected={date ? new Date(date) : undefined}
          captionLayout="dropdown"
          onSelect={(date) => {
            setDate(date ? date.toISOString() : undefined);
            setOpen(false);
          }}
        />
      </PopoverContent>
    </Popover>
  );
}
