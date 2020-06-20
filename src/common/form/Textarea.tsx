import * as React from 'react';
import { InputField } from '../../types/FormInputField';

const textarea: React.SFC<InputField> = (props) => {
  const { helperText, classess = '', ...rests } = props;
  return <textarea className={`form-control ${classess}`} {...rests} />;
};

export default textarea;
