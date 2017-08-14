import Link from 'next/link';
import React from 'react';
import PropTypes from 'prop-types';

const UserHead = ({ user: { _id, username, userAvatar } }) => (
  <div className='user-head floatRight'>
    <div><Link href='/write'><a>Write</a></Link></div>
    <div className='user-head-info'>
      <Link as={`/@/${_id}`} href={`/user?userId=${_id}`}>
        <a>
          <span>{username}</span>
          <img src={userAvatar || '/static/svg/account_circle.svg'} alt='' />
        </a>
      </Link>
    </div>
  </div>
);

UserHead.propTypes = {
  user: PropTypes.shape({
    _id: PropTypes.string,
    email: PropTypes.string,
    userAvatar: PropTypes.string,
  }).isRequired,
};

export default UserHead;
