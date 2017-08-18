import React from 'react';
import { graphql } from 'react-apollo';
import PropTypes from 'prop-types';

import { authQuery } from '../graphql/querys';
import Header from '../components/Header';
import withData from '../lib/withData';
import { showLoginMask } from '../utils';
import Writer from '../components/Writer';

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
        {user && user._id && <Writer />}
      </div>
    );
  }
}

export default withData(graphql(authQuery)(Write));
