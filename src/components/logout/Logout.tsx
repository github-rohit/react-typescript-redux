import * as React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import {} from 'react-router-dom';
import Button from '@material-ui/core/Button';

import Auth from '../../common/AuthService';
import Http from '../../common/http/User';
import { AppStore } from '../../store/Store';
import { set } from '../../store/User';

const connector = connect((state: AppStore) => ({
  user: state.user
}));

type Props = ConnectedProps<typeof connector>;

class Logout extends React.Component<Props> {
  handelOnClick() {
    Auth.logout();
    this.props.dispatch(set(null));
    this.logout();
  }

  async logout() {
    await Http.logout();
    (window as any).location = '/';
  }

  render() {
    return (
      <Button
        className="w-100"
        type="submit"
        variant="outlined"
        color="primary"
        onClick={this.handelOnClick.bind(this)}
      >
        Logout
      </Button>
    );
  }
}

export default connector(Logout);
