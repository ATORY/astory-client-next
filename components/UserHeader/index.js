import React from 'react';
import PropTypes from 'prop-types';

import UserHeaderSelf from './Self';
import Nav from './Nav';
import Follow from './Follow';

const UserHeader = ({ url, isSelf, _id, email, username,
  userIntro, userAvatar, followed, followedNum }) => {
  if (!isSelf) {
    return (
      <div className='user-header'>
        <div className='user'>
          <div className='intro'>
            <h2 id='username'>{username}</h2>
            <p id='userintro'>{userIntro}</p>
          </div>
          <img src={userAvatar} alt='' />
          <div className='intro-other'>
            <Follow {...{ _id, followed, followedNum }} />({followedNum})
          </div>
        </div>
        <Nav {...{ url, isSelf }} userId={_id} />
      </div>
    );
  }
  return (
    <div className='user-header'>
      <UserHeaderSelf {...{ _id, email, username, userIntro, userAvatar, followedNum }} />
      <Nav {...{ url, isSelf }} userId={_id} />
    </div>
  );
};

UserHeader.propTypes = {
  url: PropTypes.object.isRequired,
  _id: PropTypes.string.isRequired,
  isSelf: PropTypes.bool.isRequired,
  followed: PropTypes.bool.isRequired,
  followedNum: PropTypes.number.isRequired,
  email: PropTypes.string.isRequired,
  username: PropTypes.string.isRequired,
  userIntro: PropTypes.string.isRequired,
  userAvatar: PropTypes.string.isRequired,
  // mutate: PropTypes.func.isRequired, // apollo mutate
};

export default UserHeader;
