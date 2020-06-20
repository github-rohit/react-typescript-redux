import * as React from 'react';
import { InputField } from '../../types/FormInputField';

const select: React.SFC<InputField> = ({
  options,
  helperText,
  classess = '',
  value,
  ...props
}) => {
  let selectValue: string;

  if (Array.isArray(value)) {
    selectValue = value[0];
  } else {
    selectValue = value;
  }

  return (
    <select
      className={`form-control ${classess}`}
      value={selectValue}
      {...props}
    >
      <option />
      {options?.map(({ _id, category }) => (
        <option key={_id} value={category}>
          {category}
        </option>
      ))}
    </select>
  );
};

export default select;
