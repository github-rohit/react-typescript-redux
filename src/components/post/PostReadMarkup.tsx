import * as React from 'react';
import { Post } from '../../types/Post';
import UserDetails from './PostUserDetail';
import Category from './Category';

type PostProps = { post: Post };

const postReadMarkup: React.SFC<PostProps> = (props) => {
  const { title, description, image, category, created_on, created_by } =
    props.post || {};

  return props.post ? (
    <React.Fragment>
      <div className="ui-post-page">
        <div className="mb-3">
          <UserDetails createdOn={created_on} createdBy={created_by} />
        </div>
        <h1 className="post-title">{title}</h1>
        <div className="mb-3">
          <Category list={category} />
        </div>
        <hr />
        {image && (
          <div className="description">
            <img src={image} alt="" />
          </div>
        )}
        <div
          className="description"
          dangerouslySetInnerHTML={{ __html: description }}
        />
      </div>
    </React.Fragment>
  ) : (
    <span />
  );
};

export default postReadMarkup;
