import { useEffect } from 'react';
import Select from 'react-select';

const ReactSelect = ({
  instance,
  label = null,
  style,
  placeholder = null,
  options,
  handleChange,
  value,
  name = null,
}) => {
  // useEffect(() => {
  //   if (register && name) register({ name });
  // }, []);

  return (
    <>
      {label && (
        <label
          htmlFor={value}
          className="block text-black font-body font-bold mb-2"
        >
          {label}
        </label>
      )}

      <Select
        instanceId={instance}
        className={style}
        name={name}
        placeholder={placeholder}
        options={options}
        onChange={handleChange}
        value={value}
      />
    </>
  );
};

export default ReactSelect;
