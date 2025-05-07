import { ChangeEvent, useEffect, useState } from "react";

// This interface defines the shape of the props that the useForm hook accepts
// T is a generic type, so it can be any object (like { email: '', password: '' })
interface UseFormProps<T> {
  initialValue: T; // The initial values for the form fields
  validate: (values: T) => Record<keyof T, string>; // A function to validate the form values
}

// This is a custom React hook for managing form state and validation
// T is a generic type for the form values
function useForm<T>({ initialValue, validate }: UseFormProps<T>) {
  // State to store the current values of the form fields
  const [values, setValues] = useState(initialValue);
  // State to track which fields have been touched (focused and then blurred)
  const [touched, setTouched] = useState<Record<string, boolean>>();
  // State to store validation error messages for each field
  const [errors, setErrors] = useState<Record<string, string>>();

  // This function updates the value of a specific field
  // name: the field name (like 'email' or 'password')
  // text: the new value for the field
  const handleChange = (name: keyof T, text: string) => {
    setValues({
        ...values, // Keep the other field values unchanged
        [name]: text, // Update the value for the given field
    });
  };

  // This function marks a field as 'touched' (user has interacted with it)
  const handleBlur = (name: keyof T) => {
    setTouched( {
      ...touched, // Keep the other touched states unchanged
      [name]: true, // Mark this field as touched
    });
  };
   
  // This function returns props to connect an input field to the form state
  // It provides value, onChange, and onBlur handlers
  const getInputProps = (name: keyof T) => {
    const value = values[name]; // The current value for this field
    // When the input changes, call handleChange
    const onChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      handleChange(name, e.target.value);
    // When the input loses focus, call handleBlur
    const onBlur = () => handleBlur(name);
    // Return the props to spread into an input element
    return {value, onChange, onBlur};
  };

  // Whenever the form values change, run the validation function
  // and update the errors state
  useEffect(() => {
    const newErrors: Record<keyof T, string> = validate(values); // Validate the current values
    setErrors(newErrors); // Update the errors state
  }, [ValidityState, values]); // Run this effect when values change

  // Return the form state and helper functions
  return {values, errors, touched, getInputProps};
}

// Export the useForm hook so it can be used in other files
export default useForm;