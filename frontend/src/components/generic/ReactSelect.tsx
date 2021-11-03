import { FC } from 'react';
import Select, { SingleValue } from 'react-select';
import { SelectOption } from '@Interfaces/select/option.interface';
import { createHtmlTag } from '@Lib/utils/create-html-tag.utils';

export type ReactSelectProps = {
  instance: string;
  label?: string;
  style: string;
  placeholder?: string;
  options: SelectOption[];
  handleChange: (option: SingleValue<SelectOption>) => void;
  value: SelectOption;
  name: string;
};

const ReactSelect: FC<ReactSelectProps> = ({
  instance,
  label,
  style,
  placeholder,
  options,
  handleChange,
  value,
  name,
}) => {
  return (
    <>
      {label && (
        <label
          htmlFor={createHtmlTag(label)}
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
