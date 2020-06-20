import * as React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { Button } from '@material-ui/core';

import Auth from '../../common/AuthService';
import Http from '../../common/http/User';
import Form, { FormState, ErrorType } from '../../common/form/Form';
import Fields from './Fields.json';
import Schema from './Schema';
import { AppStore } from '../../store/Store';
import { User } from '../../types/User';
import Snackbar, { CustomSnackbarProps } from '../../common/Snackbar';

const connector = connect((state: AppStore) => ({
  user: state.user.details
}));

type Props = ConnectedProps<typeof connector>;

interface Data {
  oldPasswd: string;
  passwd: string;
  confirmPasswd: string;
}

interface Errors {
  oldPasswd: ErrorType;
  passwd: ErrorType;
  confirmPasswd: ErrorType;
}

type StateProps = {
  snackbar: CustomSnackbarProps | null;
};

type State = FormState<Data, Errors, StateProps>;

class ChangePassword extends Form<Props> {
  state: State = {
    data: {
      oldPasswd: '',
      passwd: '',
      confirmPasswd: ''
    },
    errors: {
      oldPasswd: null,
      passwd: null,
      confirmPasswd: null
    },
    props: {
      snackbar: null
    }
  };

  fields = Fields;
  schema = Schema;

  async doSubmit() {
    this.setState({
      props: {
        snackbar: null
      }
    });
    const { _id: id } = Auth.user as User;
    const response = await Http.password({
      id,
      ...this.state.data
    });

    if (!response) {
      return;
    }

    const { success, errors } = response;

    if (success) {
      this.setState({
        props: {
          snackbar: {
            severity: 'success',
            message: 'Profile updated successfully.'
          }
        }
      });
    } else if (errors) {
      this.setState({
        props: {
          snackbar: {
            horizontal: 'center',
            autoHideDuration: null,
            severity: 'error',
            message: errors.msg || errors || 'Something went wrong!'
          }
        }
      });
    }
  }

  componentDidMount() {
    document.body.classList.toggle('darkClass');
  }

  componentWillUnmount() {
    document.body.classList.remove('darkClass');
  }

  render() {
    const { snackbar } = this.state.props as StateProps;
    return (
      <React.Fragment>
        {snackbar && <Snackbar {...snackbar} />}
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
                Change Password
              </Button>
            </form>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default connector(ChangePassword);
