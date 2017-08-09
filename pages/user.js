import React from 'react';
import PropTypes from 'prop-types';
import {} from 'react-apollo';

import Header from '../components/Header';
import withData from '../lib/withData';

const User = ({ url }) => (
  <div>
    <div className='header-shadow' />
    <Header pathname={url.pathname} title='user' />
    <div className='user'>
      user
    </div>
  </div>
);

User.propTypes = {
  url: PropTypes.shape({
    pathname: PropTypes.string.isRequired,
  }).isRequired,
};


export default withData(User);
