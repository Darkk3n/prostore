/* eslint-disable @typescript-eslint/no-explicit-any */
import { UploadButton } from '@/lib/uploadthing';
import Image from 'next/image';
import React from 'react';
import {
    Control, // Make sure Path is imported
    Controller,
    ControllerFieldState,
    ControllerRenderProps,
    FieldValues,
    Path,
} from 'react-hook-form';
import { toast } from 'sonner';
import { Card, CardContent } from './ui/card';
import { Field, FieldError, FieldLabel } from './ui/field';
import { Input } from './ui/input';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Textarea } from './ui/textarea';

// --- Type Definitions ---
export type SelectOption = {
    key: string;
    value: string;
    customDisplay?: React.ReactNode;
    disabled?: boolean; // Added disabled to SelectOption for consistency
};

// Props specific to standard text-like inputs
interface StandardInputSpecificProps {
    placeholder?: string;
    // Add any other props truly unique to text/email/password/number/tel/url inputs here
}

// Props specific to the RadioGroup component
interface RadioInputSpecificProps {
    options: { value: string; label: string; disabled?: boolean }[];
    // Add other props specific to your RadioGroup component if needed
}

// Props specific to the Select component
interface SelectInputSpecificProps {
    selectOptions: SelectOption[];
    placeholder?: string; // For SelectValue's placeholder
    // Add any other props specific to your Select component
}

// Props specific to the Image Uploader
interface ImageUploaderSpecificProps {
    endpoint: string; // From your UploadButton
}

// Main FormInputProps discriminated union
export type FormInputProps<TFieldValues extends FieldValues> = {
    name: Path<TFieldValues>;
    control: Control<TFieldValues>;
    label: string; // 'label' is common to all or most fields
    customOnValueChange?: (value: any) => void; // Common callback if applicable
} &
    // Case for generic text-like inputs (type can be one of these or undefined/default 'text')
    (| ({
              type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url';
          } & Omit<React.ComponentPropsWithoutRef<'input'>, 'name' | 'defaultValue' | 'type'> &
              StandardInputSpecificProps)
        // Case for 'radio' type
        | ({ type: 'radio' } & RadioInputSpecificProps)
        // Case for 'select' type
        | ({ type: 'select' } & SelectInputSpecificProps)
        // Case for 'textarea' type
        | ({ type: 'textarea' } & Omit<React.ComponentPropsWithoutRef<'textarea'>, 'name'>)
        // Case for 'imageUploader' type
        | ({ type: 'image' } & ImageUploaderSpecificProps)
        // Case for 'checkbox' type
        | ({ type: 'checkbox' } & Omit<
              React.ComponentPropsWithoutRef<'input'>,
              'name' | 'defaultValue' | 'type'
          >)
    );

// --- FormInput Component ---
function FormInput<TFieldValues extends FieldValues>(props: FormInputProps<TFieldValues>) {
    const { name, control, label, type = 'text', customOnValueChange, ...rest } = props;

    const renderInputComponent = (
        field: ControllerRenderProps<TFieldValues, Path<TFieldValues>>,
        fieldState: ControllerFieldState,
    ) => {
        let inputComponent: React.ReactNode = null;

        switch (type) {
            case 'radio':
                const radioRest = rest as RadioInputSpecificProps;
                inputComponent = (
                    <div>
                        <FieldLabel>{label}</FieldLabel>
                        <RadioGroup
                            {...field}
                            id={name as string}
                            onValueChange={(value: string) => {
                                // Ensure onValueChange matches component's expected type
                                field.onChange(value);
                                customOnValueChange?.(value);
                            }}
                            value={field.value}
                        >
                            <div className="flex flex-col space-y-2">
                                {radioRest.options.map((option) => (
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

            case 'select':
                const selectRest = rest as SelectInputSpecificProps;
                inputComponent = (
                    <div className="w-full">
                        <Select
                            onValueChange={(value: string) => {
                                // Ensure onValueChange matches component's expected type
                                field.onChange(value);
                                customOnValueChange?.(value);
                            }}
                            value={field.value?.toString() || ''} // Handle potential null/undefined field.value
                        >
                            <SelectTrigger className="w-full">
                                <SelectValue
                                    placeholder={selectRest.placeholder || 'Select a value'}
                                />
                            </SelectTrigger>
                            <SelectContent className="w-full">
                                {selectRest.selectOptions?.map((option) => (
                                    <SelectItem
                                        key={option.key || option.value} // Use key from SelectOption if available, fallback to value
                                        value={option.value}
                                        disabled={option.disabled}
                                    >
                                        {option.customDisplay || option.value}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                );
                break;

            case 'textarea':
                inputComponent = (
                    <Textarea
                        className="resize-none"
                        {...field}
                        id={name as string}
                        {...(rest as Omit<React.ComponentPropsWithoutRef<'textarea'>, 'name'>)}
                    />
                );
                break;

            case 'image':
                const currentImages: string[] = (field.value || []) as string[];

                inputComponent = (
                    <div className="w-full">
                        <FieldLabel
                            htmlFor={name as string}
                            className="mb-2"
                        >
                            Images
                        </FieldLabel>
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
                    </div>
                );
                break;

            case 'checkbox':
                inputComponent = (
                    <div className="flex items-center space-x-2">
                        <input
                            type="checkbox"
                            {...field}
                            checked={!!field.value} // Ensure boolean for checked prop
                            id={name as string}
                            {...(rest as Omit<
                                React.ComponentPropsWithoutRef<'input'>,
                                'name' | 'defaultValue' | 'type'
                            >)}
                        />
                        <FieldLabel htmlFor={name as string}>{label}</FieldLabel>
                    </div>
                );
                break;

            case 'text':
            case 'email':
            case 'password':
            case 'number':
            case 'tel':
            case 'url':
            default: // Catches text, email, etc. and also if type is undefined (defaults to 'text')
                const standardInputRest = rest as StandardInputSpecificProps;
                inputComponent = (
                    <Input
                        {...field}
                        id={name as string}
                        type={type || 'text'}
                        placeholder={standardInputRest.placeholder || label}
                        aria-invalid={fieldState.invalid}
                        {...(rest as Omit<
                            React.ComponentPropsWithoutRef<'input'>,
                            'name' | 'defaultValue' | 'type'
                        >)}
                    />
                );
                break;
        }
        return inputComponent;
    };

    return (
        <Controller
            name={name}
            control={control}
            render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                    {/* Conditional rendering for label based on type
              - Radio and Checkbox render their label alongside the input.
              - ImageUploader renders its label within its specific block.
              - All other types get the external FieldLabel.
          */}
                    {type !== 'radio' && type !== 'image' && type !== 'checkbox' && (
                        <FieldLabel htmlFor={name as string}>{label}</FieldLabel>
                    )}

                    {renderInputComponent(field, fieldState)}

                    {fieldState.invalid && fieldState.error && (
                        <FieldError>{fieldState.error.message}</FieldError>
                    )}
                </Field>
            )}
        />
    );
}

export default FormInput;
