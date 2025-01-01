import React from 'react';
import PropTypes from 'prop-types';

const Button = ({ type, onClick, disabled, children }) => (
  <button
    type={type}
    onClick={onClick}
    disabled={disabled}
    className="w-full bg-blue-500 hover:bg-blue-600 text-white rounded-lg px-6 py-3 flex items-center justify-center space-x-2 transition-colors disabled:opacity-50"
  >
    {children}
  </button>
);

Button.propTypes = {
  type: PropTypes.string,
  onClick: PropTypes.func,
  disabled: PropTypes.bool,
  children: PropTypes.node.isRequired
};

export default Button;

