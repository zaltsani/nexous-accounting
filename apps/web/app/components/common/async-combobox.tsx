import * as React from "react";
import {
  Combobox,
  ComboboxInput,
  ComboboxContent,
  ComboboxList,
  ComboboxItem,
  ComboboxEmpty,
} from "@nexous-accounting/ui";

export interface Option {
  value: string;
  label: string;
  code?: string;
  [key: string]: any;
}

interface AsyncComboboxProps<T extends Option> {
  value?: string;
  onChange?: (value: string | undefined) => void;
  placeholder?: string;
  disabled?: boolean;

  options: T[];
  onSearchChange?: (search: string) => void;
  onFetchNextPage?: () => void;
  hasNextPage?: boolean;
  isFetching?: boolean;
  isFetchingNextPage?: boolean;

  renderItem?: (item: T) => React.ReactNode;
}

export function AsyncCombobox<T extends Option>({
  value,
  onChange,
  placeholder = "Pilih...",
  disabled = false,
  options,
  onSearchChange,
  onFetchNextPage,
  hasNextPage,
  isFetching,
  isFetchingNextPage,
  renderItem,
}: AsyncComboboxProps<T>) {
  const [open, setOpen] = React.useState(false);
  const [inputValue, setInputValue] = React.useState("");

  const selectedOption = React.useMemo(() => {
    if (!value) return null;
    return options.find((item) => item.value === value) || null;
  }, [options, value]);

  React.useEffect(() => {
    if (!open) {
      if (selectedOption) {
        setInputValue(selectedOption.label);
      } else if (!value) {
        setInputValue("");
      }
    }
  }, [selectedOption, value, open]);

  React.useEffect(() => {
    if (!open) return;

    const timer = setTimeout(() => {
      onSearchChange?.(inputValue);
    }, 300);

    return () => clearTimeout(timer);
  }, [inputValue, open, onSearchChange]);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    if (scrollHeight - scrollTop <= clientHeight + 40) {
      if (hasNextPage && !isFetchingNextPage) {
        onFetchNextPage?.();
      }
    }
  };

  const resetSearchOnOpen = () => {
    setInputValue("");
    onSearchChange?.("");
  };

  const hasOptions = options.length > 0;

  return (
    <Combobox
      open={open}
      onOpenChange={(nextOpen) => {
        setOpen(nextOpen);
        if (nextOpen) {
          resetSearchOnOpen();
        }
      }}
      items={options}
      value={selectedOption}
      onValueChange={(selected: T | null) => {
        onChange?.(selected?.value);
        setOpen(false);
      }}
      itemToStringValue={(item: T | null) => item?.label || ""}
      filter={() => true}
    >
      <ComboboxInput
        placeholder={placeholder}
        disabled={disabled}
        value={inputValue}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
          setInputValue(e.target.value);
          if (!open) setOpen(true);
        }}
        onFocus={resetSearchOnOpen}
      />

      <ComboboxContent>
        {!hasOptions && (
          <ComboboxEmpty>{isFetching ? "Searching..." : "No items found."}</ComboboxEmpty>
        )}

        {hasOptions && (
          <ComboboxList
            onScroll={handleScroll}
            onMouseDown={(e: React.MouseEvent<HTMLDivElement>) => e.preventDefault()}
          >
            {(item) => (
              <ComboboxItem key={item.value} value={item}>
                {renderItem ? (
                  renderItem(item as T)
                ) : (
                  <div className="flex flex-col text-sm">
                    <span>{item.label}</span>
                    {item.code && (
                      <span className="text-xs text-muted-foreground">{item.code}</span>
                    )}
                  </div>
                )}
              </ComboboxItem>
            )}
          </ComboboxList>
        )}

        {hasOptions && (isFetchingNextPage || isFetching) && (
          <div className="p-2 text-center text-xs text-muted-foreground">Loading...</div>
        )}
      </ComboboxContent>
    </Combobox>
  );
}
