import * as React from 'react';
import Joi from 'joi-browser';
import { InputField } from '../../types/FormInputField';
import InputMarkup from './InputViewMarkup';
import Input from './Input';
import Textarea from './Textarea';
import Select from './Select';
import Editor from './Editor';

export type ErrorType = string | null;

export interface FormState<T, E, O = any> {
  data: T;
  errors: E;
  props?: O;
}

abstract class Form<P = any> extends React.Component<P, FormState<any, any>> {
  abstract fields: InputField[];
  abstract schema: any;
  abstract doSubmit(): void;

  get isFormValid() {
    return this.validateAll();
  }

  handelSubmit(event: React.FormEvent) {
    event.preventDefault();
    const isValid = this.validateAll(true);

    if (!isValid) {
      return;
    }

    this.doSubmit();
  }

  handelOnChange({ currentTarget }: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = currentTarget;
    let { errors } = this.state;

    if (this.schema && this.schema[name]) {
      errors = this.validate(name, value);
    }

    this.setState({
      errors,
      data: {
        ...this.state.data,
        [name]: value
      }
    });
  }

  validateAll(updateState?: boolean) {
    if (!this.schema) {
      return true;
    }

    const data: any = {};

    for (const key of Object.keys(this.schema)) {
      data[key] = this.state.data[key];
    }

    const { error } = Joi.validate(data, this.schema, {
      abortEarly: false
    });

    if (!error) {
      return true;
    }

    const errors: any = {};
    for (const item of error.details) {
      // tslint:disable-next-line: no-unused-expression
      !errors[item.path[0]] && (errors[item.path[0]] = item.message);
    }

    if (updateState) {
      this.setState({
        ...this.state,
        errors: {
          ...this.state.errors,
          ...errors
        }
      });
    }

    return false;
  }

  validate(name: string, value: any) {
    const { errors: prevErrors } = this.state;
    let errors: ReturnType<typeof prevErrors>;
    const schema = { [name]: this.schema[name] };
    const { error } = Joi.validate(
      {
        [name]: value
      },
      schema
    );

    const errorMsg = error ? error.details[0].message : null;

    errors = {
      ...prevErrors,
      [name]: errorMsg
    };

    return errors;
  }

  input(value: any, props: InputField) {
    const { type } = props;

    switch (type) {
      case 'textarea':
        return (
          <Textarea
            onChange={this.handelOnChange.bind(this)}
            value={value}
            {...props}
          />
        );
      case 'select':
        return (
          <Select
            onChange={this.handelOnChange.bind(this)}
            value={value}
            {...props}
          />
        );
      case 'tinymce':
        return (
          <Editor
            onChange={this.handelOnChange.bind(this)}
            value={value}
            {...props}
          />
        );

      default:
        return (
          <Input
            onChange={this.handelOnChange.bind(this)}
            value={value}
            {...props}
          />
        );
    }
  }

  renderAllFields(fields = this.fields) {
    const { data, errors } = this.state;
    return fields.map((field) => {
      const { name, label, helperText } = field;
      const value = data[name];
      const error = errors[name];

      return (
        <InputMarkup
          key={name}
          label={label}
          name={name}
          error={error}
          helperText={helperText}
        >
          {this.input(value, field)}
        </InputMarkup>
      );
    });
  }
}

export default Form;
