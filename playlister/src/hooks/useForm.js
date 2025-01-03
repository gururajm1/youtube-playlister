import { useState, useCallback } from 'react';

const useForm = (initialState) => {
  const [values, setValues] = useState(initialState);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setValues((prevValues) => ({ ...prevValues, [name]: value }));
  }, []);

  const reset = useCallback(() => {
    setValues(initialState);
  }, [initialState]);

  return [values, handleChange, reset];
};

export default useForm;
