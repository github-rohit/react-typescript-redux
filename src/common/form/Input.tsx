import * as React from 'react';
import { InputField } from '../../types/FormInputField';

const TEXT: string = 'text';
const EMAIL: string = 'emal';
const PASSWORD: string = 'password';

interface InputProps extends InputField {
  type: typeof TEXT | typeof EMAIL | typeof PASSWORD;
}

const input: React.SFC<InputProps> = (props) => {
  const { helperText, classess = '', ...rests } = props;
  return <input className={`form-control ${classess}`} {...rests} />;
};

export default input;
