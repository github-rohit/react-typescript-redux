import * as React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { RouteComponentProps } from 'react-router-dom';
import { User } from '../../types/User';
import Http from '../../common/http/User';
import Posts from '../../components/post/Post';
import AuthorMarkup from './AuthorMarkup';
import { AppStore } from '../../store/Store';

const connector = connect((state: AppStore) => ({
  posts: state.posts
}));

type AuthorProps = RouteComponentProps<{
  id: string;
  name: string;
}> &
  ConnectedProps<typeof connector>;

export interface AuthorState {
  author: User | null;
}

class Author extends React.Component<AuthorProps, AuthorState> {
  state = {
    author: null
  };

  async componentDidMount() {
    const { id } = this.props.match.params;
    try {
      const author = await Http.getById(id);
      this.setState({
        ...this.state,
        author
      });
    } catch (ex) {}
    //
  }

  render() {
    const { id } = this.props.match.params;
    const { total } = this.props.posts;

    return (
      <React.Fragment>
        <div className="row">
          <div className="col-md-3 ui-author-container">
            <AuthorMarkup total={total} {...this.state.author!} />
          </div>
          <div className="col-md-9 pl-5">
            <Posts createdBy={id} {...this.props} />
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default connector(Author);
