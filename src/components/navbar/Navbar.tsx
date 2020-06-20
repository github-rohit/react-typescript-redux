/* eslint-disable no-script-url */
/* eslint-disable jsx-a11y/anchor-is-valid */
import * as React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { NavLink, Link } from 'react-router-dom';
import { Button, Menu } from '@material-ui/core';
import { PostAddOutlined } from '@material-ui/icons';
import { AppStore } from '../../store/Store';
import Util from '../../common/Util';
import logo from '../../logo.svg';
import Logout from '../logout/Logout';

const connector = connect((state: AppStore) => ({
  user: state.user.details
}));

export type NavbarProps = ConnectedProps<typeof connector>;

class Navbar extends React.Component<NavbarProps> {
  state = { user: '', anchorEl: null, mobileMenuOpen: false };
  element = React.createRef<HTMLElement>();

  userAvatarText(name: string) {
    console.log(this.props);
    let text = '';

    if (name.length) {
      const arr: string[] = name.split(' ');
      text += arr[0].charAt(0);
      text += arr.length > 1 ? (arr as any).pop().charAt(0) : '';
    }

    return text;
  }

  handleClick(event: React.MouseEvent) {
    console.log('');
    this.setState({ anchorEl: event.currentTarget });
  }

  handleClose = () => {
    this.setState({ anchorEl: null });
  };

  componentDidMount() {
    Util.watchBodyScroll(this.element);
  }

  render() {
    const { anchorEl } = this.state;
    const { user } = this.props;
    return (
      <header ref={this.element} className="navbar mb-4">
        <nav className="container">
          <div className="navbar-header">
            <NavLink className="navbar-brand" to="/">
              <img height="40" src={logo} alt="nirmalrohit.com" />
            </NavLink>
          </div>
          <ul className="navbar-nav mr-auto navbar-nav-left">
            <li>
              <NavLink to="/" exact={true} activeClassName="active">
                HOME
              </NavLink>
            </li>
            {user && (
              <li>
                <NavLink to="/my/posts/published" activeClassName="active">
                  MY POSTS
                </NavLink>
              </li>
            )}
          </ul>
          {user ? (
            <React.Fragment>
              <Button
                className="menu-write-btn"
                variant="outlined"
                color="primary"
                size="small"
                component={Link}
                to="/my/post/new"
                startIcon={<PostAddOutlined />}
              >
                Write
              </Button>
              <ul className="nav navbar-nav navbar-right mobile-hide">
                <li>
                  <a
                    className="user-avatar rounded-circle"
                    aria-owns={anchorEl ? 'simple-menu' : undefined}
                    // tslint:disable-next-line: jsx-no-lambda
                    onClick={this.handleClick.bind(this)}
                  >
                    <span>{this.userAvatarText(user.name)}</span>
                  </a>
                </li>
              </ul>
              <Menu
                className="user-dropdown"
                id="simple-menu"
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={this.handleClose.bind(this)}
              >
                <li>
                  <NavLink
                    onClick={this.handleClose.bind(this)}
                    to={`/my/profile/view`}
                    className="d-flex"
                  >
                    <div className="user-avatar rounded-circle align-self-center col">
                      <span>{this.userAvatarText(user.name)}</span>
                    </div>
                    <div className="col">
                      <div className="uname">{user.name}</div>
                      <div className="email small">{user.email}</div>
                    </div>
                  </NavLink>
                </li>
                <li>
                  <Logout />
                </li>
              </Menu>
            </React.Fragment>
          ) : (
            <React.Fragment>
              <ul className="nav navbar-nav navbar-right">
                <li>
                  <NavLink to="/login" activeClassName="active">
                    LOGIN
                  </NavLink>
                </li>
              </ul>
              <Button
                variant="outlined"
                color="primary"
                size="small"
                component={Link}
                to="/sign-up"
              >
                SIGNUP
              </Button>
            </React.Fragment>
          )}
        </nav>
      </header>
    );
  }
}

export default connector(Navbar);
