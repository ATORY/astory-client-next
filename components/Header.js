import Link from 'next/link';
import Head from 'next/head';
import React from 'react';
import { 
  graphql, 
} from 'react-apollo';

import { authQuery } from '../graphql/querys';
import LoginWithMutation from './Login';
import {showLoginMask} from '../utils';

const UserHead = ({user: { _id, email, userAvatar }}) => {
  return (
    <div className='user-head floatRight'>
      <div><Link href='/write'><a>Write</a></Link></div>
      <div className='user-head-info'>
        <span>{email}</span>
        <img src={userAvatar || '/static/svg/account_circle.svg'} alt=""/>
      </div>
    </div> 
  )
}

class Header extends React.Component {
  
  loginShow = (evt) => {
    evt.persist()
    showLoginMask();
  }
  render() {
    const { title, children, data, pathname } = this.props;
    const slogen = 'Everyone has a story';
    return (
      <header>
        <Head>
          <title>{title || 'AStory'}</title>
          <meta name="viewport" content="initial-scale=1.0, width=device-width" />
          <link rel="stylesheet" href="https://necolas.github.io/normalize.css/7.0.0/normalize.css" />
          <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/material-design-icons/3.0.1/iconfont/material-icons.min.css" />
          <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.12.0/styles/atom-one-dark.min.css"/>
          <link rel="stylesheet" href="//cdn.quilljs.com/1.2.6/quill.snow.css" />
          <script src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.12.0/highlight.min.js"></script>
          <link rel="stylesheet" href="/static/css/index.css"/>
        </Head>
        <LoginWithMutation pathname={pathname}/>

        <div className="maxWidth header-bar">
          <div className='logos'>
            <Link href='/'><img src='/static/logo.svg' className='logo' alt="" /></Link>
            <p className='slogen'>{slogen}</p>
          </div>
          {
            data.loading ? 'authing...' :
            data.error ? <div>{data.error.message}</div> :
            data.user && data.user._id ? <UserHead user={data.user} /> :
            <div className='signs floatRight'>
              <div><Link href='/write'><a>Write</a></Link></div>
              <div className='btns'>
                <button onClick={this.loginShow}>登录</button>
              </div>
            </div> 
          }
        </div>
        {children}
      </header>
    );
  }
};

export default graphql(authQuery)(Header);
