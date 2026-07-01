import * as React from "react";
import PhoneInputLib from "react-phone-number-input";
import type { Value, Country } from "react-phone-number-input";
import "react-phone-number-input/style.css";
import { cn } from "@/lib/utils";

export type PhoneValue = Value;
export type { Country };

// Borderless inner input — the outer container provides the border/ring
const InnerInput = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className, ...props }, ref) => (
  <input
    ref={ref}
    className={cn(
      "min-w-0 flex-1 bg-transparent text-sm outline-none",
      "placeholder:text-muted-foreground disabled:cursor-not-allowed",
      className,
    )}
    {...props}
  />
));
InnerInput.displayName = "InnerInput";

export interface PhoneInputProps {
  value: PhoneValue | undefined;
  onChange: (value: PhoneValue | undefined) => void;
  defaultCountry?: Country;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

export function PhoneInput({
  value,
  onChange,
  defaultCountry = "UG",
  placeholder = "Enter phone number",
  disabled,
  className,
}: PhoneInputProps) {
  return (
    <div
      className={cn(
        "flex h-9 w-full items-center gap-2 rounded-md border border-input bg-transparent px-3 py-1",
        "shadow-sm transition-colors focus-within:outline-none focus-within:ring-1 focus-within:ring-ring",
        disabled && "cursor-not-allowed opacity-50",
        className,
      )}
    >
      <PhoneInputLib
        value={value}
        onChange={onChange}
        defaultCountry={defaultCountry}
        placeholder={placeholder}
        disabled={disabled}
        inputComponent={InnerInput}
        className="flex w-full items-center gap-2"
      />
    </div>
  );
}
