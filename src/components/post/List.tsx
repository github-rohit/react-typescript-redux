import * as React from 'react';
import { Button } from '@material-ui/core';
import { Post } from '../../types/Post';
import { Link } from 'react-router-dom';
import Util from '../../common/Util';
import UserDetails from './PostUserDetail';
import Category from './Category';
import imagePlaceholde from '../../images/post-placeholde.svg';

export interface PostListsProps {
  createdBy?: string;
  status?: string;
  onDelete?: any;
  onError: any;
  posts: Post[];
}

function getActionButtons(status: string, id: string, onDelete: any) {
  const buttons: any[] = [];
  if (status) {
    buttons.push(
      <Button
        key="delete"
        className="mr-3"
        color="primary"
        size="small"
        variant="outlined"
        // tslint:disable-next-line: jsx-no-lambda
        onClick={() => {
          onDelete(id);
        }}
      >
        Delete
      </Button>
    );

    if (status === 'draft') {
      buttons.push(
        <Button
          key="edit"
          className="mr-3"
          color="primary"
          variant="outlined"
          size="small"
          component={Link}
          to={`/my/post/edit/${id}`}
        >
          edit
        </Button>
      );
    }
  }

  return buttons;
}

const postLists: React.SFC<PostListsProps> = (props) => {
  const { posts, createdBy, status, onDelete } = props;
  return (
    <ul className="list-unstyled">
      {posts.map(({ _id, title, image, category, created_on, created_by }) => (
        <li key={_id}>
          <article className="ui-post">
            {!createdBy && (
              <div className="row mb-3">
                <div className="col">
                  <UserDetails createdBy={created_by} createdOn={created_on} />
                </div>
              </div>
            )}
            <div className="row mb-3">
              <div className="col image-placeholder">
                <div className="image-placeholder-fill">
                  <img
                    className={image ? `` : `placeholder-image`}
                    src={image || imagePlaceholde}
                    alt=""
                  />
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col mb-2 d-flex">
                <h4
                  className=" ui-post-title flex-grow-1"
                  dangerouslySetInnerHTML={{ __html: title }}
                />
                <div>
                  <Category list={category} />
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col">
                {status && getActionButtons(status, _id, onDelete)}
                <Link
                  to={`/post/${_id}/${Util.getEncodeURI(title)}`}
                  className="read-more"
                >
                  Read more...
                </Link>
              </div>
            </div>
          </article>
        </li>
      ))}
    </ul>
  );
};

export default postLists;
