import { useFormContext } from "react-hook-form";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";

interface RHFSwitchProps {
  name: string;
  label?: string;
  helperText?: string;
  disabled?: boolean;
}

export function RHFSwitch({ name, label, helperText, disabled }: RHFSwitchProps) {
  const { control } = useFormContext();

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className="flex flex-row items-center justify-between rounded-lg border border-border p-3">
          {(label || helperText) && (
            <div className="space-y-0.5">
              {label && <FormLabel>{label}</FormLabel>}
              {helperText && <FormDescription>{helperText}</FormDescription>}
            </div>
          )}
          <FormControl>
            <Switch
              checked={field.value}
              onCheckedChange={field.onChange}
              disabled={disabled}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
