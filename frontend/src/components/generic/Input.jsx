import React from 'react';

const Input = (props) => {
  const { label, name, type, placeholder, error, childRef, initialValue } =
    props;

  const className = ['mb-4'];

  return (
    <div className={className.join(' ')}>
      <label className="block font-body font-bold mb-2">
        <span>{label}</span>
      </label>
      <input
        className="bg-white font-body shadow appearance-none border rounded w-full py-2 px-3 
                text-gray-800 leading-tight focus:outline-none focus:shadow-outline"
        name={name}
        type={type}
        placeholder={placeholder}
        defaultValue={initialValue}
        ref={childRef}
      />

      {error && (
        <div className="my-3 bg-red-200 border-l-4 border-red-700 text-red-700 p-2">
          <p>{error.message}</p>
        </div>
      )}
    </div>
  );
};

export default Input;
