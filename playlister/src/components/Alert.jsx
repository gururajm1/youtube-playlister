import React from 'react';

export function Alert({ type, message }) {
  const bgColor = type === 'error' ? 'bg-red-500/10' : 'bg-green-500/10';
  const textColor = type === 'error' ? 'text-red-500' : 'text-green-500';
  const borderColor = type === 'error' ? 'border-red-500/20' : 'border-green-500/20';

  return (
    <div className={`${bgColor} ${textColor} ${borderColor} border rounded-lg p-4 text-sm`}>
      {message}
    </div>
  );
}

