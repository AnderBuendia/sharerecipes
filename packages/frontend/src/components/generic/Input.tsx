import type { FC } from 'react';
import { FieldError, UseFormRegisterReturn } from 'react-hook-form';
import { createHtmlTag } from '@Lib/utils/create-html-tag.utils';

export type InputProps = {
  label: string;
  type: string;
  placeholder: string;
  error?: FieldError;
  register: UseFormRegisterReturn;
};

const Input: FC<InputProps> = (props) => {
  const { label, type, placeholder, error, register } = props;
  const className = ['mb-4'];

  return (
    <div className={className.join(' ')}>
      <label
        htmlFor={createHtmlTag(label)}
        className="block font-body font-bold mb-2"
      >
        <span>{label}</span>
      </label>
      <input
        className="bg-white font-body shadow appearance-none border rounded w-full py-2 px-3 
        text-gray-800 leading-tight focus:outline-none focus:shadow-outline"
        type={type}
        placeholder={placeholder}
        {...register}
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
