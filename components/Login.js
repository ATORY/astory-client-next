import React from 'react';
import Link from 'next/link';
import Router from 'next/router';
import { graphql } from 'react-apollo';
import PropTypes from 'prop-types';

import { authQuery } from '../graphql/querys';
import { userLoginMutation } from '../graphql/mutations';
import { hidenLoginMask } from '../utils';

class Login extends React.Component {
  static propTypes = {
    mutate: PropTypes.func.isRequired,
    pathname: PropTypes.string.isRequired,
  };

  constructor() {
    super();
    this.state = {
      email: '',
      password: '',
      err: '',
      redEmail: false,
      redPWD: false,
    };
  }

  closeLogin = (evt) => {
    evt.persist();
    hidenLoginMask();
    if (this.props.pathname === '/write') {
      Router.push('/');
    }
  }

  loginRequest = () => {
    const { email, password } = this.state;
    const { mutate } = this.props;
    const emailReg = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (!emailReg.test(email)) { this.setState({ redEmail: true, err: '请使用合法的邮箱地址' }); return; }
    if (password.length < 6) { this.setState({ redPWD: true, err: '密码长度不得小于6位' }); return; }
    mutate({
      variables: { user: { email, password } },
      refetchQueries: [{ query: authQuery }],
    }).then(({ data: { user } }) => {
      if (user && user.msg) {
        this.setState({ err: user.msg });
        return;
      }
      this.setState({ email: '', password: '' });
      hidenLoginMask();
    }).catch(err => console.log('err', err.message));
  }

  login = (evt) => {
    evt.persist();
    evt.preventDefault();
    evt.stopPropagation();
    this.loginRequest();
  }

  render() {
    // const { url } = this.props;
    const { email, password, err, redPWD, redEmail } = this.state;
    // const isWrite = url.path === '/write';
    // console.log(url, isWrite);
    return (
      <div className='login mask' id='login-mask'>
        <i className='material-icons close' onClick={this.closeLogin} role='presentation'>close</i>
        <div className='mask-box' id='login-mask-box'>
          <div className='mask-box-head'>
            ATORY
          </div>
          <form onSubmit={this.login} className='login-form'>
            <div>
              <input
                style={{ borderBottomColor: redEmail ? 'red' : '' }}
                type='text'
                value={email}
                onChange={evt => this.setState({ email: evt.target.value, err: '', redEmail: false })}
              />
              <i className='material-icons'>person</i>
            </div>
            <div>
              <input
                style={{ borderBottomColor: redPWD ? 'red' : '' }}
                type='password'
                value={password}
                onChange={evt => this.setState({ password: evt.target.value, err: '', redPWD: false })}
              />
              <i className='material-icons'>lock_outline</i>
            </div>
            <div
              className='error-tint'
              style={{
                visibility: err ? 'initial' : 'hidden',
              }}
            >{err}</div>
            <div className='btns'>
              <button>登录</button>
            </div>
            <div className='tint'>
              提示：使用email可直接登录
              <Link href='/findpwd'><a>找回密码?</a></Link>
            </div>

          </form>
        </div>
      </div>
    );
  }
}

const LoginWithMutation = graphql(
  userLoginMutation,
)(Login);

export default LoginWithMutation;
