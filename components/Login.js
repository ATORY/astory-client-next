import React from 'react';
// import Link from 'next/link';
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
    mutate({
      variables: { user: { email, password } },
      refetchQueries: [{ query: authQuery }],
      // update: (store, {data: {_id, email, userAvatar}} ) => {
      //   const data = store.readQuery({query: authQuery });
      //   data.user = {_id, email, userAvatar};
      //   store.writeQuery({ query: authQuery, data });
      // }
    }).then(() => {
      this.setState({ email: '', password: '' });
      hidenLoginMask();
    }).catch(err => console.log('err', err));
  }

  login = (evt) => {
    evt.persist();
    evt.preventDefault();
    evt.stopPropagation();
    this.loginRequest();
  }

  render() {
    // const { url } = this.props;
    const { email, password } = this.state;
    // const isWrite = url.path === '/write';
    // console.log(url, isWrite);
    return (
      <div className='login mask' id='login-mask'>
        <i className='material-icons close' onClick={this.closeLogin} role='presentation'>close</i>
        <div className='mask-box' id='login-mask-box'>
          <div className='mask-box-head'>
            SHARED
          </div>
          <form onSubmit={this.login} className='login-form'>
            <div>
              <input
                type='text'
                value={email}
                onChange={evt => this.setState({ email: evt.target.value })}
              />
              <i className='material-icons'>person</i>
            </div>
            <div>
              <input
                type='text'
                value={password}
                onChange={evt => this.setState({ password: evt.target.value })}
              />
              <i className='material-icons'>lock_outline</i>
            </div>
            <div className='error-tint'>err</div>
            <div className='btns'>
              <button>登录</button>
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
