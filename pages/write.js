import React from 'react';
import { graphql } from 'react-apollo';
import dynamic from 'next/dynamic';
import PropTypes from 'prop-types';

import { authQuery } from '../graphql/querys';
import Header from '../components/Header';
import withData from '../lib/withData';
import { showLoginMask } from '../utils';

const DynamicComponentWithNoSSR = dynamic(
  import('../components/Writer'),
  {
    ssr: false,
    loading: () => <div className='write write-wrapper'>初始化编辑器。。。</div>,
  },
);


class Write extends React.Component {
  static propTypes = {
    data: PropTypes.shape({
      user: PropTypes.object,
    }).isRequired,
    url: PropTypes.shape({
      pathname: PropTypes.string,
    }).isRequired,
  }
  componentDidMount() {
    const { data: { user } } = this.props;
    if (!user || !user._id) {
      showLoginMask();
    }
  }

  render() {
    const { url, data: { user } } = this.props;
    return (
      <div>
        <div className='header-shadow' />
        <Header pathname={url.pathname} title='writer' />
        {user && user._id && <DynamicComponentWithNoSSR />}
      </div>
    );
  }
}

export default withData(graphql(authQuery)(Write));
