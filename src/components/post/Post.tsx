import * as React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { RouteComponentProps } from 'react-router-dom';
import Pagination from '@material-ui/lab/Pagination';

import { AppStore } from '../../store/Store';
import Http from '../../common/http/Post';
import { get } from '../../store/Post';
import PostLists from './List';
import Placeholder from './Placeholder';
import Snackbar, { CustomSnackbarProps } from '../../common/Snackbar';

const connector = connect((state: AppStore) => ({
  posts: state.posts
}));

const PUBLISHED = 'published';
const DRAFT = 'draft';

export type PostStatus = typeof PUBLISHED | typeof DRAFT;

export type PostProps = {
  createdBy?: string;
  status?: PostStatus;
} & RouteComponentProps;

type Props = PostProps & ConnectedProps<typeof connector>;

interface State {
  page: number;
  count: number;
  loading: boolean;
  snackbar: CustomSnackbarProps | null;
}

class Posts extends React.Component<Props, State> {
  state: State = {
    page: 1,
    count: 0,
    loading: true,
    snackbar: null
  };

  async getPost() {
    this.setState({
      loading: true
    });
    const { status, createdBy } = this.props;
    try {
      const query = this.getQuery();
      let response;

      if (status === 'draft') {
        response = await Http.getMyPost(createdBy as string, query.toString());
      } else {
        response = await Http.get(query);
      }

      this.props.dispatch(get(response));
      this.setState({
        loading: false
      });
    } catch (ex) {
      console.error(ex);
    }
  }

  getQuery() {
    const { location, createdBy } = this.props;
    const { search } = location;
    const { status } = this.props.match.params as any;
    const query = new URLSearchParams(search);

    if (createdBy) {
      query.set('createdBy', createdBy);
    }

    if (status) {
      query.set('status', status.toUpperCase());
    }

    return query;
  }

  setPage() {
    const { search } = window.location;
    const query = new URLSearchParams(search);
    const page = query.get('page') || '0';
    const count = parseInt(page, 10) || 1;

    this.setState({
      ...this.state,
      page: count
    });
  }

  onError(event: Event) {
    (event as any).target.src = '';
  }

  getCount() {
    const { total } = this.props.posts;
    return Math.ceil(total / 12);
  }

  handleChange(event: React.ChangeEvent<unknown>, page: number) {
    if (this.state.page !== page) {
      this.setState({
        page
      });
      const { search } = window.location;
      const query = new URLSearchParams(search);

      query.set('page', page as any);

      this.props.history.push(`?${query.toString()}`);
    }
  }

  async handelDelete(id: string) {
    const deleteBox = window.confirm('Are you sure you want delete this post.');

    if (deleteBox) {
      this.deleteAction(id);
    }
  }

  async deleteAction(id: string) {
    this.setState({
      snackbar: null
    });
    const response = await Http.delete(id);
    const { success, msg } = response;

    if (success) {
      await this.getPost();
      this.setPage();
      this.setState({
        snackbar: {
          message: msg,
          severity: 'success'
        }
      });
    }
  }

  async componentDidMount() {
    await this.getPost();
    this.setPage();
  }

  async componentDidUpdate(props: PostProps) {
    const {
      location: { search },
      status
    } = this.props;
    const {
      location: { search: oldSearch },
      status: oldStatus
    } = props;

    if (search !== oldSearch || status !== oldStatus) {
      await this.getPost();
      this.setPage();
    }
  }

  noRecord() {
    const { search } = this.props.location;
    const searchParams = new URLSearchParams(search);

    const category = searchParams.get('category');
    const qParam = searchParams.get('q');

    return (
      <div className="text-center col">
        <h1>:( OOPS</h1>
        <h3>
          {category ? (
            <React.Fragment>
              No record found for{' '}
              <span className="text-danger">{category}</span> Category.
            </React.Fragment>
          ) : qParam ? (
            <React.Fragment>
              Your search - <span className="text-danger">{qParam} </span>- did
              not match any documents.
            </React.Fragment>
          ) : (
            'No record found.'
          )}
        </h3>
      </div>
    );
  }

  post() {
    const { posts } = this.props.posts;
    const { createdBy, status } = this.props;
    return (
      <React.Fragment>
        <PostLists
          createdBy={createdBy}
          posts={posts}
          status={status}
          onError={this.onError}
          onDelete={this.handelDelete.bind(this)}
        />
        <div className="ui-pagination">
          {this.getCount() ? (
            <Pagination
              page={this.state.page}
              count={this.getCount()}
              showFirstButton={true}
              showLastButton={true}
              onChange={this.handleChange.bind(this)}
            />
          ) : (
            ''
          )}
        </div>
      </React.Fragment>
    );
  }

  render() {
    const { loading, snackbar } = this.state;
    const { posts } = this.props.posts;

    return (
      <React.Fragment>
        {snackbar && <Snackbar {...(snackbar as CustomSnackbarProps)} />}
        {loading ? (
          <Placeholder />
        ) : posts && posts.length ? (
          this.post()
        ) : (
          this.noRecord()
        )}
      </React.Fragment>
    );
  }
}

export default connector(Posts);
