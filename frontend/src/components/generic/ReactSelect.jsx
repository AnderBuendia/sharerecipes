import Select from 'react-select';

const ReactSelect = ({
  instance,
  label,
  placeholder,
  options,
  handleChange,
  value,
}) => {
  return (
    <>
      <label
        htmlFor={value}
        className="block text-black font-body font-bold mb-2"
      >
        {label}
      </label>

      <Select
        instanceId={instance}
        className="text-gray-800 mt-2 mb-4 font-body shadow appearance-none"
        placeholder={placeholder}
        options={options}
        onChange={handleChange}
        value={value}
      />
    </>
  );
};

export default ReactSelect;
