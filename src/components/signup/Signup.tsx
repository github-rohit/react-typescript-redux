import * as React from 'react';
import Button from '@material-ui/core/Button';
import Http from '../../common/http/User';
import Form, { FormState, ErrorType } from '../../common/form/Form';
import Fields from './Fields.json';
import Schema from './Schema';

interface Data {
  email: string;
  name: string;
  passwd: string;
  confirmPasswd: string;
}

interface Errors {
  email: ErrorType;
  name: ErrorType;
  passwd: ErrorType;
  confirmPasswd: ErrorType;
}

interface StateProps {
  success: boolean;
}

class Signup extends Form {
  state: FormState<Data, Errors, StateProps> = {
    data: {
      email: '',
      name: '',
      passwd: '',
      confirmPasswd: ''
    },
    errors: {
      email: null,
      name: null,
      passwd: null,
      confirmPasswd: null
    },
    props: {
      success: false
    }
  };

  fields = Fields;
  schema = Schema;

  async doSubmit() {
    try {
      const { data, props } = this.state;
      const response = await Http.post(data);
      const { success = false, errors = {} } = response.data;

      if (response.status === 403) {
        errors.email = errors.msg;
      }

      this.setState({
        ...this.state,
        errors,
        props: {
          ...props,
          success
        }
      });
    } catch (ex) {
      console.log(ex);
    }
  }

  componentDidMount() {
    document.body.classList.toggle('darkClass');
  }

  componentWillUnmount() {
    document.body.classList.remove('darkClass');
  }

  render() {
    return (
      <div className="form-card">
        <div className="form-card__body">
          <form onSubmit={this.handelSubmit.bind(this)}>
            {this.renderAllFields()}
            <Button
              className="w-100"
              type="submit"
              variant="contained"
              color="primary"
              disabled={!this.isFormValid}
            >
              Signup
            </Button>
          </form>
        </div>
      </div>
    );
  }
}

export default Signup;
