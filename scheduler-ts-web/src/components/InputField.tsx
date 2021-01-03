import React, { InputHTMLAttributes } from 'react'
import { FormControl, FormErrorMessage, FormLabel, Input } from '@chakra-ui/react';
import {useField} from 'Formik';
 
type InputFieldProps = InputHTMLAttributes<HTMLInputElement> & {
    label: string;
    name: string;
    placeholder: string;
};
 
export const InputField: React.FC<InputFieldProps> = ({label,size: _, ...props}) =>	 {
    const [field, {error}] = useField(props);
    return (
        <FormControl isInvalid={!!error}>
            {/* <FormLabel htmlFor={field.name}>{label}</FormLabel> */}
            <Input 
                {...props}
                {...field}
                id={field.name}
                placeholder={props.placeholder}
                autoComplete='off'
            />
            {error ? <FormErrorMessage>{error}</FormErrorMessage> : null }
        </FormControl>
    );
}