import React from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';

const UserHeaderNav = ({ userId, url: { pathname } }) => (
  <ul className='user-nav'>
    <li className={pathname === '/user' && 'active'}>
      <Link as={`/@/${userId}`} href={`/user?userId=${userId}`}>
        <a>文章</a>
      </Link>
    </li>
    <li className={pathname === '/user/draft' && 'active'}>
      <Link as={`/@/${userId}/draft`} href={`/user/draft?userId=${userId}`}>
        <a>草稿</a>
      </Link>
    </li>
  </ul>
);


UserHeaderNav.propTypes = {
  userId: PropTypes.string.isRequired,
  url: PropTypes.shape({
    pathname: PropTypes.string,
  }).isRequired,
};

export default UserHeaderNav;
