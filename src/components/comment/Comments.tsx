import * as React from 'react';
import { Button } from '@material-ui/core';

import Auth from '../../common/AuthService';
import { Comment } from '../../types/Comment';
import Http from '../../common/http/Comment';
import CommentItem from './Comment';
import Form, { ErrorType, FormState } from '../../common/form/Form';

import Fields from './Fields.json';
import Schema from './Schema';

interface Props {
  id: string;
}

interface Data {
  comment: string;
}

interface Errors {
  comment: ErrorType;
}

interface StateProps {
  list: Comment[] | null;
}

type State = FormState<Data, Errors, StateProps>;

class Comments extends Form<Props> {
  state: State = {
    data: {
      comment: ''
    },
    errors: {
      comment: null
    },
    props: {
      list: null
    }
  };

  fields = Fields;
  schema = Schema;

  async doSubmit() {
    const { comment } = this.state.data;
    const { id } = this.props;

    const response = await Http.post({
      comment,
      postId: id,
      created_by: Auth.user?._id
    });

    console.log(response);
    //
  }

  async componentDidMount() {
    const { id } = this.props;
    try {
      const list = await Http.getById(id);
      this.setState({
        props: {
          list
        }
      });
    } catch (ex) {
      console.log(ex);
    }
  }

  getForm() {
    return (
      <React.Fragment>
        <div className="ui-comment-card ui-comment-add">
          <form onSubmit={this.handelSubmit.bind(this)}>
            {this.input(this.state.data.comment, this.fields[0])}
            <div className="ui-comment-add">
              <Button
                disableElevation={true}
                size="small"
                type="submit"
                variant="contained"
                color="primary"
                disabled={!this.isFormValid}
              >
                Add Comment
              </Button>
            </div>
          </form>
        </div>
      </React.Fragment>
    );
  }

  render() {
    const { list } = this.state.props!;
    return (
      <React.Fragment>
        <div className="ui-comment">
          <h4>
            <span className="font-weight-lighter">Total </span> {list?.length}
            <span className="font-weight-lighter">
              {' '}
              Comment{list && list?.length > 1 ? 's' : ''}
            </span>
          </h4>
          {Auth.user ? (
            this.getForm()
          ) : (
            <div className="ui-comment-card">
              <i className="fa fa-comment-o" />{' '}
              <span className="small">Login to Write a comment...</span>
            </div>
          )}

          {list &&
            (list! as Comment[]).map((comment) => (
              <CommentItem key="comment._id" {...comment} />
            ))}
        </div>
      </React.Fragment>
    );
  }
}

export default Comments;
