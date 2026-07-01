import { useFormContext } from "react-hook-form";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import {
  PhoneInput,
  type PhoneValue,
  type Country,
} from "@/components/ui/phone-input";

interface RHFPhoneInputProps {
  name: string;
  label?: string;
  helperText?: string;
  defaultCountry?: Country;
  placeholder?: string;
  disabled?: boolean;
}

export function RHFPhoneInput({
  name,
  label,
  helperText,
  defaultCountry,
  placeholder,
  disabled,
}: RHFPhoneInputProps) {
  const { control } = useFormContext();

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          {label && <FormLabel>{label}</FormLabel>}
          <FormControl>
            <PhoneInput
              value={field.value as PhoneValue | undefined}
              onChange={field.onChange}
              defaultCountry={defaultCountry}
              placeholder={placeholder}
              disabled={disabled}
            />
          </FormControl>
          {helperText && <FormDescription>{helperText}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
