import * as React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { RouteComponentProps } from 'react-router-dom';
import Button from '@material-ui/core/Button';
import Http from '../../common/http/User';
import Auth from '../../common/AuthService';
import { AppStore } from '../../store/Store';
import { set } from '../../store/User';
import Form, { FormState, ErrorType } from '../../common/form/Form';
import Snackbar, { CustomSnackbarProps } from '../../common/Snackbar';
import Fields from './Fields.json';
import Schema from './Schema';

const connector = connect((state: AppStore) => ({
  user: state.user
}));

type Props = ConnectedProps<typeof connector> & RouteComponentProps;

interface Data {
  email: string;
  passwd: string;
}

interface Errors {
  email: ErrorType;
  passwd: ErrorType;
}

type StateProps = {
  snackbar: CustomSnackbarProps | null;
};

type State = FormState<Data, Errors, StateProps>;

class Login extends Form<Props> {
  state: State = {
    data: {
      email: '',
      passwd: ''
    },
    errors: {
      email: null,
      passwd: null
    },
    props: {
      snackbar: null
    }
  };

  fields = Fields;
  schema = Schema;

  updateUserInfo(token: string) {
    Auth.token = token;

    const { user } = Auth;

    this.props.dispatch(set(user));

    this.props.history.replace('/my/posts/published');
  }

  async doSubmit() {
    this.setState({
      props: {
        snackbar: null
      }
    });
    const { data } = this.state;
    const { success, errors, token } = await Http.login(data);

    console.log(errors);
    if (errors) {
      this.setState({
        props: {
          snackbar: {
            message: errors.msg,
            horizontal: 'center',
            autoHideDuration: null,
            severity: 'error'
          }
        }
      });
      return;
    }

    if (success) {
      this.updateUserInfo(token);
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
                Login
              </Button>
            </form>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default connector(Login);
