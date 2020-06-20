import * as React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import Post from '../post/Post';
import Aside from '../aside/Aside';

export type HomeProps = RouteComponentProps;

class Home extends React.Component<HomeProps> {
  render() {
    return (
      <div className="row">
        <div className="col-md-9">
          <Post {...this.props} />
        </div>
        <div className="col-md-3">
          <div className="mt-4">
            <Aside {...this.props} />
          </div>
        </div>
      </div>
    );
  }
}

export default Home;
