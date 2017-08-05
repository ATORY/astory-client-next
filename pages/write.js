import React from 'react';
import { graphql } from 'react-apollo';

import { authQuery } from '../graphql/querys';
import Header from '../components/Header';
import withData from '../lib/withData';
import { showLoginMask } from '../utils';

class Write extends React.Component {

  componentDidMount() {
    const { data: { user }} = this.props;
    if(!user || !user._id) {
      showLoginMask();
    }
  }

  render() {
    const { url } = this.props;
    return (
      <div>
        <Header pathname={url.pathname} />
        Write
      </div>      
    )
  }
}

// const Write = withData((props) => (
//   <div>
//     <Header pathname={props.url.pathname} />
//     Write
//   </div>
// ));
export default withData(graphql(authQuery)(Write));