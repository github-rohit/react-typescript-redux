import * as React from 'react';
import { Link } from 'react-router-dom';
import { connect, ConnectedProps } from 'react-redux';
import { Button } from '@material-ui/core';
import { Email, VpnKey } from '@material-ui/icons';

import userImage from '../../images/user.png';

import Http from '../../common/http/User';
import Auth from '../../common/AuthService';
import { AppStore } from '../../store/Store';
import Form, { FormState, ErrorType } from '../../common/form/Form';
import { set } from '../../store/User';
import { User } from '../../types/User';
import Snackbar, { CustomSnackbarProps } from '../../common/Snackbar';

import Fields from './Fields.json';
import Schema from './Schema';

const connector = connect((state: AppStore) => ({
  user: state.user.details
}));

type Props = ConnectedProps<typeof connector>;

type Data = User;

interface Errors {
  name: ErrorType;
}

type StateProps = {
  snackbar: CustomSnackbarProps | null;
};

type State = FormState<Data, Errors, StateProps>;

class Edit extends Form<Props> {
  state: State = {
    data: {
      _id: '',
      email: '',
      name: ''
    },
    errors: {
      name: null
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
    const { _id } = Auth.user as User;
    const { data } = this.state;
    const response = await Http.patch(_id, data);

    const { success } = response;
    if (success) {
      this.setState({
        props: {
          snackbar: {
            message: 'Profile updated successfully.',
            severity: 'success'
          }
        }
      });
    }
  }

  setData(response: User) {
    this.setState({
      data: {
        ...response
      }
    });
  }

  async componentDidMount() {
    const { user } = this.props;

    if (user) {
      this.setData(user);
      return;
    }

    const { _id } = Auth.user as User;
    const response = await Http.getById(_id);

    if (!response) {
      return;
    }

    this.setData(response);

    this.props.dispatch(set(response));
  }

  render() {
    if (!this.state.data._id) {
      return '';
    }
    const { snackbar } = this.state.props as StateProps;
    const { name, email } = this.state.data!;
    return (
      <React.Fragment>
        {snackbar && <Snackbar {...snackbar} />}
        <form onSubmit={this.handelSubmit.bind(this)}>
          <div className="profile-container pt-5">
            <div className="profile-avatar">
              <img className="img-fluid" src={userImage} alt="user" />
              <p className="pt-3">
                <Button
                  className="w-100"
                  size="small"
                  color="primary"
                  component={Link}
                  to="/my/profile/change-password"
                  startIcon={<VpnKey />}
                >
                  Change Password
                </Button>
              </p>
            </div>
            <div className="profile-base-info">
              <h2>{name}</h2>
              <p title="email">
                <Email fontSize="small" color="action" /> {email}
              </p>
              {this.renderAllFields([...this.fields].slice(0, 5))}
            </div>
            <div className="profile-social-media">
              <h4>SOCIAL MEDIA</h4>
              {this.renderAllFields([...this.fields].slice(5))}
            </div>
          </div>

          <div className="fixed-wrapper-btns">
            <div className="profile-container container text-left">
              <div />
              <div>
                <Button
                  type="submit"
                  variant="outlined"
                  color="primary"
                  disabled={!this.isFormValid}
                >
                  Update profile
                </Button>
              </div>
            </div>
          </div>
        </form>
      </React.Fragment>
    );
  }
}

export default connector(Edit);
