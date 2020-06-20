import * as React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { Redirect, RouteComponentProps } from 'react-router-dom';
import Post, { PostStatus } from '../../components/post/Post';
import SideNav from './SideNav';
import { AppStore } from '../../store/Store';
import { User } from '../../types/User';

const PUBLISHED = 'published';
const DRAFT = 'draft';

const connector = connect((state: AppStore) => ({
  user: state.user.details
}));

type Props = RouteComponentProps<{
  status: PostStatus;
}> &
  ConnectedProps<typeof connector>;

interface State {
  status: PostStatus;
}

class MyPosts extends React.Component<Props, State> {
  state: State = {
    status: PUBLISHED
  };

  static getDerivedStateFromProps(props: Props, state: State) {
    const { status } = props.match.params;
    const { status: oldStaus } = state;

    if (status !== oldStaus) {
      return {
        status
      };
    }

    return null;
  }

  get statuse() {
    const { status } = this.props.match.params;
    return status === PUBLISHED || status === DRAFT || false;
  }

  componentDidMount() {
    const { status } = this.props.match.params;
    this.setState({
      status
    });
  }

  render() {
    if (!this.statuse) {
      return <Redirect to="/not-found" />;
    }
    const { _id } = (this.props.user as User) || {};

    return (
      <React.Fragment>
        <div className="row">
          <div className="col-md-9">
            {_id ? (
              <Post
                createdBy={_id}
                status={this.state.status}
                {...this.props}
              />
            ) : (
              'loading'
            )}
          </div>
          <div className="col-md-3">
            <div className="mt-4">
              <div className="aside">
                <SideNav />
              </div>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default connector(MyPosts);
