import * as React from 'react';
import { Comment } from '../../types/Comment';
import UserDetails from '../post/PostUserDetail';

type Props = Comment;

const commentMarkup: React.SFC<Props> = ({
  comment,
  created_by,
  created_on
}) => {
  return (
    <React.Fragment>
      <div className="ui-comment-card">
        <div>
          <UserDetails createdBy={created_by} createdOn={created_on} />
        </div>
        <div className="ui-comment-text pt-4">{comment}</div>
      </div>
    </React.Fragment>
  );
};

export default commentMarkup;
