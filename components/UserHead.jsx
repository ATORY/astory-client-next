import Link from 'next/link';
import React from 'react';
import PropTypes from 'prop-types';


const UserHead = ({ user: { email, userAvatar } }) => (
  <div className='user-head floatRight'>
    <div><Link href='/write'><a>Write</a></Link></div>
    <div className='user-head-info'>
      <span>{email}</span>
      <img src={userAvatar || '/static/svg/account_circle.svg'} alt='' />
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
