import type { ReactNode } from "react";
import { FormProvider as RHFFormProvider, type FieldValues, type UseFormReturn } from "react-hook-form";

interface FormProviderProps<T extends FieldValues> {
  children: ReactNode;
  methods: UseFormReturn<T>;
  onSubmit: (data: T) => void;
}

export function FormProvider<T extends FieldValues>({
  children,
  methods,
  onSubmit,
}: FormProviderProps<T>) {
  return (
    <RHFFormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)} noValidate>
        {children}
      </form>
    </RHFFormProvider>
  );
}
