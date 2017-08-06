import React from 'react';
import { graphql } from 'react-apollo';
import dynamic from 'next/dynamic';

import { authQuery } from '../graphql/querys';
import Header from '../components/Header';
// import Writer from '../components/Writer';
import withData from '../lib/withData';
import { showLoginMask } from '../utils';

const DynamicComponentWithNoSSR = dynamic(
  import('../components/Writer'),
  { 
    ssr: false ,
    loading: () => <div className="write write-wrapper">初始化编辑器。。。</div>
  }
)


class Write extends React.Component {

  componentDidMount() {
    const { data: { user }} = this.props;
    if(!user || !user._id) {
      showLoginMask();
    }
  }

  render() {
    const { url, data: { user } } = this.props;
    return (
      <div>
        <div className='header-shadow' />
        <Header pathname={url.pathname} title='writer'/>
        {user && user._id && <DynamicComponentWithNoSSR />}
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