/* eslint-disable @typescript-eslint/no-explicit-any */
import Image from 'next/image';
import {
    Control,
    Controller,
    ControllerFieldState,
    ControllerRenderProps,
    FieldPath,
    FieldValues,
    Path,
} from 'react-hook-form';
import { toast } from 'sonner';

import { Field, FieldError, FieldLabel } from '@/components/ui/field'; // Adjust path if necessary
import { Input, InputProps } from '@/components/ui/input'; // Import InputProps for type safety
import { UploadButton } from '@/lib/uploadthing';

import { USER_ROLES } from '@/lib/constants';
import { Card, CardContent } from './ui/card';
import { Checkbox } from './ui/checkbox';
import { RadioGroup, RadioGroupItem, RadioGroupProps } from './ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Textarea } from './ui/textarea';

// Define the props for the common component.
// It will take the RHF specific props (name, control)
// and common props for the input (label, placeholder, type, etc.)
// for standard text-like inputs
interface TextInputProps<TFieldValues extends FieldValues> extends Omit<
    InputProps,
    'name' | 'defaultValue'
> {
    type?:
        | 'text'
        | 'email'
        | 'password'
        | 'number'
        | 'tel'
        | 'url'
        | 'textarea'
        | 'image'
        | 'checkbox'
        | 'select';
    label: string;
    placeholder?: string;
}

// For radio group inputs
export interface RadioGroupOption {
    label: string;
    value: string;
    disabled?: boolean;
}

interface RadioInputProps<TFieldValues extends FieldValues> extends Omit<
    RadioGroupProps,
    'name' | 'defaultValue' | 'value' | 'onValueChange' | 'onChange'
> {
    type: 'radio'; // This "discriminates" this interface
    label: string; // Overall label for the radio group
    options: RadioGroupOption[];
    // Any other props specific to RadioGroup can go here
    onValueChangeCustom?: (value: string) => void;
}

// --- Create the Discriminated Union for FormInputProps ---
type FormInputProps<TFieldValues extends FieldValues> = {
    name: Path<TFieldValues>;
    control: Control<TFieldValues>;
} & (TextInputProps<TFieldValues> | RadioInputProps<TFieldValues>);
// Notice the intersection with the common `name` and `control` props

function FormInput<TFieldValues extends FieldValues>(props: FormInputProps<TFieldValues>) {
    const { name, control, label, type = 'text', ...rest } = props;
    let remainingProps:
        | Omit<InputProps, 'name' | 'defaultValue'>
        | Omit<RadioGroupProps, 'name' | 'defaultValue' | 'value' | 'onValueChange' | 'onChange'>;
    let customOnValueChange: ((value: string) => void) | undefined;

    if (type === 'radio') {
        const { onValueChangeCustom, ...radioRest } = props as RadioInputProps<TFieldValues>;
        customOnValueChange = onValueChangeCustom;
        remainingProps = radioRest;
    }

    const renderInput = (
        field: ControllerRenderProps<TFieldValues, FieldPath<TFieldValues>>,
        fieldState: ControllerFieldState,
    ) => {
        let inputComponent = null;
        switch (type) {
            case 'radio':
                inputComponent = (
                    <div>
                        {' '}
                        <FieldLabel>{label}</FieldLabel> {/* Label for the entire radio group */}
                        <RadioGroup
                            {...field} // field.value and field.onChange will connect to RadioGroup's value and onValueChange
                            {...(remainingProps as Omit<
                                RadioGroupProps,
                                'name' | 'defaultValue' | 'value' | 'onValueChange' | 'onChange'
                            >)}
                            id={name as string}
                            onValueChange={(value) => {
                                field.onChange(value);
                                customOnValueChange?.(value);
                            }}
                            value={field.value} // Explicitly map RHF value to RadioGroup's value
                        >
                            <div className="flex flex-col space-y-2">
                                {(rest as RadioInputProps<TFieldValues>).options.map((option) => (
                                    <div
                                        key={option.value}
                                        className="flex items-center space-x-2"
                                    >
                                        <RadioGroupItem
                                            value={option.value}
                                            id={`${name as string}-${option.value}`}
                                            disabled={option.disabled}
                                        />
                                        <FieldLabel htmlFor={`${name as string}-${option.value}`}>
                                            {option.label}
                                        </FieldLabel>
                                    </div>
                                ))}
                            </div>
                        </RadioGroup>
                    </div>
                );
                break;
            case 'textarea':
                inputComponent = (
                    <Textarea
                        {...field}
                        {...(rest as any)}
                        className="resize-none"
                        rows={5}
                    />
                );
            case 'email':
            case 'password':
            case 'number':
            case 'text':
                inputComponent = (
                    <Input
                        {...field} // Spreads onChange, onBlur, value, and ref
                        {...(rest as Omit<InputProps, 'name' | 'defaultValue'>)} // Cast rest for type safety
                        id={name as string}
                        type={type || 'text'} // Default to 'text' if type is undefined
                        placeholder={(rest as TextInputProps<TFieldValues>).placeholder || label}
                        aria-invalid={fieldState.invalid}
                    />
                );
                break;
            case 'image':
                const currentImages: string[] = (field.value || []) as string[];
                inputComponent = (
                    <Card>
                        <CardContent className="space-y-2 mt-2 min-h-48">
                            <div className="flex-start space-x-2">
                                {currentImages.map((image: string) => (
                                    <Image
                                        key={image}
                                        src={image}
                                        alt="product image"
                                        className="w-20 h-20 object-cover object-center rounded-sm"
                                        width={100}
                                        height={100}
                                    />
                                ))}
                                <UploadButton
                                    endpoint="imageUploader"
                                    onClientUploadComplete={(res: { url: string }[]) => {
                                        field.onChange([...currentImages, res[0].url]);
                                    }}
                                    onUploadError={(error: Error) => {
                                        toast.error(error.message, {
                                            position: 'top-right',
                                        });
                                    }}
                                />
                            </div>
                        </CardContent>
                    </Card>
                );
                break;
            case 'checkbox':
                inputComponent = (
                    <div className="flex flex-row gap-3">
                        <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                        />
                        <FieldLabel>{label}</FieldLabel>
                    </div>
                );
                break;
            case 'select':
                inputComponent = (
                    <div className="w-full">
                        <Select
                            onValueChange={field.onChange}
                            value={field.value.toString()}
                        >
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select a value" />
                            </SelectTrigger>
                            <SelectContent className="w-full">
                                {USER_ROLES.map((ur) => (
                                    <SelectItem
                                        key={ur}
                                        value={ur}
                                    >
                                        {ur.charAt(0).toUpperCase() + ur.slice(1)}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                );
                break;
        }
        return inputComponent;
    };

    return (
        <div className="flex flex-row md:flex-col gap-5">
            <Controller
                name={name}
                control={control}
                render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                        {type !== 'radio' && ( // Only render FieldLabel directly for non-radio types
                            <FieldLabel htmlFor={name as string}>{label}</FieldLabel>
                        )}
                        {renderInput(field, fieldState)}

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
