import { Field, FieldError, FieldLabel } from '@/components/ui/field'; // Adjust path if necessary
import { Input, InputProps } from '@/components/ui/input'; // Import InputProps for type safety
import { Control, Controller, FieldValues, Path } from 'react-hook-form';

// Define the props for your common component.
// It will take the RHF specific props (name, control)
// and common props for the input (label, placeholder, type, etc.)
interface FormInputProps<TFieldValues extends FieldValues> extends Omit<
    InputProps,
    'name' | 'defaultValue'
> {
    // Inherit InputProps but omit 'name' and 'defaultValue'
    name: Path<TFieldValues>;
    control: Control<TFieldValues>;
    label: string;
    placeholder?: string;
}

function FormInput<TFieldValues extends FieldValues>({
    name,
    control,
    label,
    placeholder,
    type = 'text', // Default type to text if not provided
    ...rest // Capture any other props meant for the Shadcn Input component
}: FormInputProps<TFieldValues>) {
    return (
        <div className="flex flex-row md:flex-col gap-5">
            <Controller
                name={name}
                control={control}
                render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor={name as string}>{label}</FieldLabel>{' '}
                        {/* htmlFor expects string */}
                        <Input
                            {...field} // Spreads onChange, onBlur, value, and ref
                            {...rest} // Spreads any additional props like disabled, className, etc.
                            id={name as string} // id expects string
                            type={type}
                            placeholder={placeholder} // Use label as a fallback for placeholder
                            aria-invalid={fieldState.invalid}
                        />
                        {fieldState.invalid && fieldState.error && (
                            <FieldError>{fieldState.error.message}</FieldError>
                        )}
                    </Field>
                )}
            />
        </div>
    );
}

export default FormInput;
