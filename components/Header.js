import Link from 'next/link';
import Head from 'next/head';
import React from 'react';
import { graphql } from 'react-apollo';
import PropTypes from 'prop-types';

import { authQuery } from '../graphql/querys';
import LoginWithMutation from './Login';
import { showLoginMask } from '../utils';
import UserHead from './UserHead';

const Header = ({ title, children, data, pathname }) => {
  let elem = <div />;
  // const slogen = 'Everyone has a story';
  const slogen = 'A';
  if (data.loading) {
    elem = <div>authing...</div>;
  } else if (data.error) {
    elem = <div>{data.error.message}</div>;
  } else if (data.user && data.user._id) {
    elem = <UserHead user={data.user} />;
  } else {
    elem = (
      <div className='signs floatRight'>
        <div><Link href='/write'><a>Write</a></Link></div>
        <div className='btns'>
          <button onClick={showLoginMask}>登录</button>
        </div>
      </div>
    );
  }

  return (
    <header>
      <Head>
        <title>{title || 'AStory'}</title>
        <meta name='viewport' content='initial-scale=1.0, width=device-width' />
        <link rel='stylesheet' href='https://necolas.github.io/normalize.css/7.0.0/normalize.css' />
        <link rel='stylesheet' href='https://cdnjs.cloudflare.com/ajax/libs/material-design-icons/3.0.1/iconfont/material-icons.min.css' />
        <link rel='stylesheet' href='https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.12.0/styles/atom-one-dark.min.css' />
        <link rel='stylesheet' href='//cdn.quilljs.com/1.2.6/quill.snow.css' />
        <script src='https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.12.0/highlight.min.js' />
        <link rel='stylesheet' href='/static/css/index.css' />
      </Head>
      <LoginWithMutation pathname={pathname} />
      <div className='maxWidth header-bar'>
        <div className='logos'>
          <Link href='/'><img src='/static/logo.svg' className='logo' alt='' /></Link>
          <p className='slogen'>{slogen}</p>
        </div>
        {elem}
      </div>
      {children}
    </header>
  );
};


Header.propTypes = {
  title: PropTypes.string,
  children: PropTypes.element,
  data: PropTypes.shape(
  ).isRequired,
  pathname: PropTypes.string.isRequired,
};

Header.defaultProps = {
  title: 'a story',
  children: <div />,
};

export default graphql(authQuery)(Header);
