import * as React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { RouteComponentProps } from 'react-router-dom';
import Form, { ErrorType, FormState } from '../../common/form/Form';
import Http from '../../common/http/Post';
import Schema from './Schema';
import Fields from './Fields.json';
import Buttons from './Buttons';
import { PostStatus } from '../post/Post';
import { AppStore } from '../../store/Store';
import Snackbar, { CustomSnackbarProps } from '../../common/Snackbar';
import Util from '../../common/Util';

const connector = connect((state: AppStore) => ({
  posts: state.posts.posts,
  user: state.user.details
}));

type Props = ConnectedProps<typeof connector> &
  RouteComponentProps<{
    type: string;
    id: string;
  }>;

interface Data {
  id: string;
  title: string;
  description: string;
  image: string;
  category: string;
  tags: any;
  status: PostStatus;
}

interface Errors {
  title: ErrorType;
  description: ErrorType;
}

type StateProps = {
  snackbar: CustomSnackbarProps | null;
  error: boolean;
};

type State = FormState<Data, Errors, StateProps>;

class Create extends Form<Props> {
  state: State = {
    data: {
      id: '',
      title: '',
      description: '',
      image: '',
      category: 'Uncategorized',
      tags: '',
      status: 'draft'
    },
    errors: {
      title: null,
      description: null
    },
    props: {
      snackbar: null,
      error: false
    }
  };

  fields = Fields as any;
  schema = Schema;

  handelOnClickPublish(event: React.MouseEvent<HTMLButtonElement>) {
    event.stopPropagation();
    this.setState({
      data: {
        ...this.state.data,
        status: 'published'
      }
    });
  }

  handelKeyDown(event: React.KeyboardEvent<HTMLElement>) {
    if (event.key === 'Enter') event.preventDefault();
  }

  handelKeyup(event: React.KeyboardEvent<HTMLElement>) {
    if (event.key === 'Enter') event.preventDefault();
    const { currentTarget: el } = event;
    el.style.height = `0`;
    el.style.height = `${el.scrollHeight}px`;
  }

  async doSubmit() {
    this.setState({
      props: {
        snackbar: null
      }
    });
    const { data } = this.state;
    const { status } = data;
    const { type, id } = this.props.match.params;
    const reqData = {
      ...data,
      status: status.toUpperCase(),
      created_by: this.props.user?._id
    };

    let response;

    if (type === 'edit') {
      response = await Http.patch(id, reqData);
    } else {
      response = await Http.post(reqData);
    }

    if (!response) {
      this.setState({
        props: {
          snackbar: {
            message: 'Faild to save post.',
            severity: 'error'
          }
        }
      });
      return;
    }

    const { success, post } = response;

    if (success) {
      if (status.toLowerCase() === 'draft') {
        this.setState({
          props: {
            snackbar: {
              message: 'Post updated successfully.',
              severity: 'success'
            }
          }
        });
      } else {
        this.props.history.replace(
          `/post/${post._id}/${Util.getEncodeURI(post.title)}`
        );
      }
    }
  }

  async fillFormData() {
    const { id } = this.props.match.params;
    if (id) {
      const { posts } = this.props;
      let post = posts.filter(({ _id }) => _id === id)[0];

      if (!post) {
        post = await Http.getById(id);
      }

      if (!post) {
        this.setState({
          props: {
            error: true
          }
        });
        return;
      }

      const { title, description, image, category, tags, status } = post;

      this.setState({
        data: {
          ...this.state.data,
          title,
          description,
          image,
          category,
          tags,
          status
        }
      });
    }
  }

  componentDidMount() {
    this.fillFormData();

    this.fields[0] = {
      ...this.fields[0],
      onKeyDown: this.handelKeyDown,
      onKeyUp: this.handelKeyup
    };

    document.body.classList.toggle('create');
  }

  componentWillUnmount() {
    document.body.classList.remove('create');
  }

  form() {
    const { snackbar, error } = this.state.props as StateProps;
    return (
      <React.Fragment>
        {error && <h3>Someting went wrong.</h3>}
        {snackbar && <Snackbar {...snackbar} />}
        <form onSubmit={this.handelSubmit.bind(this)}>
          <div className="row">
            <div className="col-md-9 ui-new-post pt-4">
              {this.renderAllFields([this.fields[0], this.fields[1]])}
            </div>
            <div className="col-md-3">
              <div className="sub-field-container">
                {this.renderAllFields([...this.fields].slice(2))}
              </div>
            </div>
          </div>

          <Buttons
            onClick={this.handelOnClickPublish.bind(this)}
            disabled={!this.isFormValid}
          />
        </form>
      </React.Fragment>
    );
  }

  render() {
    const { id } = this.props.match.params;
    const { title } = this.state.data;
    return id ? title && this.form() : this.form();
  }
}

export default connector(Create);
