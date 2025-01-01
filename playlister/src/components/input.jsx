import React from 'react';
import PropTypes from 'prop-types';

const Input = ({ type, name, value, onChange, placeholder, required }) => (
  <input
    type={type}
    name={name} // Add the name prop for proper state mapping
    value={value}
    onChange={onChange}
    placeholder={placeholder}
    required={required}
    className="w-full bg-[#22242a] border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500 transition-colors"
  />
);

Input.propTypes = {
  type: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired, // Include name as a required prop
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  required: PropTypes.bool,
};

export default Input;
