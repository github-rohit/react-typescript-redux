import * as React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import Aside from '../aside/Aside';
import http from '../../common/http/Post';
import PostReadMarkup from './PostReadMarkup';
import { Post } from '../../types/Post';
import Comments from '../comment/Comments';
import Placeholder from './PlaceholderRead';

type TParams = {
  id: string;
  title: string;
};

type PostReadProps = RouteComponentProps<TParams>;
type PostReadState = {
  post: Post | null;
  loading: boolean;
  errors: boolean;
};

class PostRead extends React.Component<PostReadProps, PostReadState> {
  state: PostReadState = {
    post: null,
    loading: true,
    errors: false
  };

  async componentDidMount() {
    const { id } = this.props.match.params;
    try {
      const post = await http.getById(id);

      if (post.errors) {
        this.setState({
          errors: true,
          loading: false
        });
      } else {
        this.setState({
          post,
          loading: false
        });
      }
    } catch (ex) {
      this.setState({
        errors: true,
        loading: false
      });
    }
  }

  errorText() {
    return <h3 className="text-danger">Something went wrong!</h3>;
  }

  render() {
    const { post, loading, errors } = this.state;

    return (
      <React.Fragment>
        <div className="row">
          <div className="col-md-9 pt-5">
            {loading ? (
              <Placeholder />
            ) : errors ? (
              this.errorText()
            ) : (
              <PostReadMarkup post={post!} />
            )}
            {post && <Comments id={(post! as Post)._id} />}
          </div>
          <div className="col-md-3 pt-5">
            {!loading && <Aside {...this.props} />}
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default PostRead;
