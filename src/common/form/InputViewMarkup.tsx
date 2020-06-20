import * as React from 'react';

export interface InputViewProps {
  label: string;
  name: string;
  error?: string | null;
  helperText?: string;
}

const inputView: React.SFC<InputViewProps> = (props) => {
  const { label, name, error, helperText } = props;
  return (
    <div className={`form-group ${error ? 'is-invalid' : ''}`}>
      <label htmlFor={name}>{label}</label>
      {props.children}
      {error && <div className="invalid-feedback">{error}</div>}
      <span className="form-text">{helperText}</span>
    </div>
  );
};

export default inputView;
