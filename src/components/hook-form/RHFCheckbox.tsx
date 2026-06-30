import { useFormContext } from "react-hook-form";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";

interface RHFCheckboxProps {
  name: string;
  label?: string;
  helperText?: string;
  disabled?: boolean;
}

export function RHFCheckbox({ name, label, helperText, disabled }: RHFCheckboxProps) {
  const { control } = useFormContext();

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
          <FormControl>
            <Checkbox
              checked={field.value}
              onCheckedChange={field.onChange}
              disabled={disabled}
            />
          </FormControl>
          {(label || helperText) && (
            <div className="space-y-1 leading-none">
              {label && <FormLabel>{label}</FormLabel>}
              {helperText && <FormDescription>{helperText}</FormDescription>}
            </div>
          )}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
