import React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import SearchPost from '../form/SearchPost';
import Category from '../category/Category';

type AsideProps = RouteComponentProps;

class Aside extends React.Component<AsideProps> {
  refelement = React.createRef<HTMLDivElement>();

  componentDidMount() {
    const element = this.refelement.current!;
    const { top } = element.getBoundingClientRect();
    element.style.top = `${top}px`;
  }

  render() {
    return (
      <React.Fragment>
        <div ref={this.refelement} className="aside">
          <SearchPost {...this.props} />
          <Category />
        </div>
      </React.Fragment>
    );
  }
}

export default Aside;
