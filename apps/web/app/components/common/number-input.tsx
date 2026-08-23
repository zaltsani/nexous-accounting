import { Input } from '@nexous/ui';
import React, { useEffect, useState } from 'react';
import { formatInputNumber, formatRawInputString, parseInputNumberToFloat } from '~/libs/utils/input-utils';

interface NumberInputProps
  extends Omit<React.ComponentProps<typeof Input>, 'value' | 'onChange'> {
  value: number | null | undefined;
  onChange: (value: number | null) => void;
  maxDecimals?: number;
  max?: number;
}

export const NumberInput = ({
  value,
  onChange,
  maxDecimals = 0,
  max,
  ...props
}: NumberInputProps) => {
  const [displayValue, setDisplayValue] = useState<string>('');

  useEffect(() => {
    if (value === null || value === undefined) {
      setDisplayValue('');
    } else {
      const currentParsed = parseInputNumberToFloat(displayValue, maxDecimals);
      if (currentParsed !== value) {
        const safeValue = max !== undefined && value > max ? max : value;
        setDisplayValue(formatInputNumber(safeValue, maxDecimals));
      }
    }
  }, [value, maxDecimals, max]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawInput = e.target.value;

    let formatted = formatRawInputString(rawInput, maxDecimals);
    let parsedNumber = parseInputNumberToFloat(formatted, maxDecimals);

    if (max !== undefined && parsedNumber !== null && parsedNumber > max) {
      parsedNumber = max;
      formatted = formatInputNumber(max, maxDecimals);
    }

    setDisplayValue(formatted);
    onChange(parsedNumber);
  };

  return (
    <Input
      {...props}
      value={displayValue}
      onChange={handleChange}
      inputMode="decimal"
    />
  );
};