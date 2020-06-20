/* eslint-disable jsx-a11y/anchor-is-valid */
import * as React from 'react';
import { Link, RouteComponentProps } from 'react-router-dom';
import { connect, ConnectedProps } from 'react-redux';
import { Button } from '@material-ui/core';
import { Email, Language, LocationOn } from '@material-ui/icons';

import userImage from '../../images/user.png';

import Auth from '../../common/AuthService';
import Http from '../../common/http/User';
import { set } from '../../store/User';
import { AppStore } from '../../store/Store';
import { User } from '../../types/User';
import Logout from '../logout/Logout';

const connector = connect((state: AppStore) => ({
  user: state.user.details
}));

type Props = ConnectedProps<typeof connector> & RouteComponentProps;

class View extends React.Component<Props> {
  socialClasses = {
    facebook: 'facebook-f',
    twitter: 'twitter',
    google_plus: 'google-plus',
    linkedIn: 'linkedin',
    instagram: 'instagram',
    tumblr: 'tumblr',
    pinterest: 'pinterest-p'
  };

  getSocialLink(key: string, clsName: string) {
    const value = (this.props.user as any)[key];

    return (
      <p key={key}>
        {value ? (
          <a rel="noopener noreferrer" href={value} target="_blank">
            <i className={`fa fa-${clsName}`} />
            {value}
          </a>
        ) : (
          <React.Fragment>
            <a>
              <i className={`fa fa-${clsName}`} /> -
            </a>
          </React.Fragment>
        )}
      </p>
    );
  }

  getSocialLinks() {
    const socialLinks: JSX.Element[] = [];

    for (const [key, clsName] of Object.entries(this.socialClasses)) {
      socialLinks.push(this.getSocialLink(key, clsName));
    }

    return socialLinks;
  }

  async componentDidMount() {
    const { _id } = Auth.user as User;
    const response = await Http.getById(_id);

    if (!response) {
      return;
    }

    this.props.dispatch(set(response));
  }

  render() {
    const { name, email, aboutme, website, country } = this.props.user || {};

    if (!name) {
      return '';
    }

    return (
      <div className="profile-container pt-5">
        <div className="profile-avatar">
          <img className="img-fluid" src={userImage} alt="user" />
        </div>
        <div className="profile-base-info">
          <h2>{name}</h2>
          {email && (
            <p title="email">
              <Email fontSize="small" color="action" /> {email}
            </p>
          )}
          {website && (
            <p title="Website">
              <Language fontSize="small" color="action" />
              &nbsp;
              <a href={website} rel="noopener noreferrer" target="_blank">
                {website}
              </a>
            </p>
          )}
          {country && (
            <p title="Location">
              <LocationOn fontSize="small" color="action" /> {country}
            </p>
          )}
        </div>
        <div className="profile-action-btn">
          <Button
            className="w-100 mb-3"
            variant="outlined"
            color="primary"
            component={Link}
            to="/my/profile/edit"
          >
            Edit Profile
          </Button>
          <Button
            className="w-100 mb-3"
            variant="outlined"
            color="primary"
            component={Link}
            to="/my/profile/change-password"
          >
            Change Password
          </Button>
          <Logout />
        </div>
        <div className="profile-aboutme">
          <h4>ABOUT ME</h4>
          <p>{aboutme ? aboutme : '-'}</p>
        </div>
        <div className="profile-social-media">
          <h4>SOCIAL MEDIA</h4>
          {this.getSocialLinks()}
        </div>
      </div>
    );
  }
}

export default connector(View);
