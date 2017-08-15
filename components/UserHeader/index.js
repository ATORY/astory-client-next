import React from 'react';
import PropTypes from 'prop-types';

import UserHeaderSelf from './Self';
import Nav from './Nav';

const UserHeader = ({ url, isSelf, _id, email, username, userAvatar }) => {
  if (!isSelf) {
    return (
      <div className='user-header'>
        <div className='user'>
          <div className='intro'>
            <h3>{email}-{username}</h3>
            <p>intro</p>
          </div>
          <img src={userAvatar} alt='' />
        </div>
        <Nav {...{ url, isSelf }} userId={_id} />
      </div>
    );
  }
  return (
    <div className='user-header'>
      <UserHeaderSelf {...{ _id, email, username, userAvatar }} />;
      <Nav {...{ url, isSelf }} userId={_id} />
    </div>
  );
};

UserHeader.propTypes = {
  url: PropTypes.object.isRequired,
  _id: PropTypes.string.isRequired,
  isSelf: PropTypes.bool.isRequired,
  email: PropTypes.string.isRequired,
  username: PropTypes.string.isRequired,
  userAvatar: PropTypes.string.isRequired,
};

export default UserHeader;
