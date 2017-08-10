import React from 'react';
import PropTypes from 'prop-types';

const UserHeader = ({ email, username, userAvatar }) => (
  <div className='user'>
    <div className='intro'>
      <h3>{email}-{username}</h3>
      <p>intro</p>
    </div>
    <img src={userAvatar} alt='' />
  </div>
);

UserHeader.propTypes = {
  email: PropTypes.string.isRequired,
  username: PropTypes.string.isRequired,
  userAvatar: PropTypes.string.isRequired,
};

export default UserHeader;
