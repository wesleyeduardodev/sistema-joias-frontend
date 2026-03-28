import { forwardRef, type ChangeEvent } from 'react';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface CurrencyInputProps
  extends Omit<React.ComponentProps<'input'>, 'onChange' | 'value'> {
  value: number;
  onChange: (value: number) => void;
  prefix?: string;
}

export const CurrencyInput = forwardRef<HTMLInputElement, CurrencyInputProps>(
  ({ value, onChange, prefix = 'R$', className, ...props }, ref) => {
    function formatDisplay(val: number): string {
      return val.toLocaleString('pt-BR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
    }

    function handleChange(e: ChangeEvent<HTMLInputElement>) {
      const raw = e.target.value.replace(/[^\d]/g, '');
      const numeric = parseInt(raw || '0', 10) / 100;
      onChange(numeric);
    }

    return (
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 font-mono text-sm text-muted-foreground">
          {prefix}
        </span>
        <Input
          ref={ref}
          type="text"
          inputMode="numeric"
          value={formatDisplay(value)}
          onChange={handleChange}
          className={cn('pl-10 text-right font-mono', className)}
          {...props}
        />
      </div>
    );
  }
);

CurrencyInput.displayName = 'CurrencyInput';
