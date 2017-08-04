import React from 'react';
import { graphql } from 'react-apollo';

import { authQuery } from '../graphql/querys';
import { userLoginMutation } from '../graphql/mutations';

class Login extends React.Component {
  constructor() {
    super();
    this.state = {
      email: '',
      password: '',
    }
  }

  hiden = () => {
    const loginMask = document.getElementById('login-mask');
    loginMask.style.display = 'none';
  }

  closeLogin = (evt, shouldGoBack) => {
    evt.persist();
    this.hiden();
    if (this.props.history.action === 'PUSH' && shouldGoBack ){
      this.props.history.goBack();
    } 
  }

  loginRequest = () => {
    const { email, password } = this.state;
    const { mutate } = this.props;
    mutate({ 
      variables: { user: { email, password }},
      refetchQueries: [ { query: authQuery }]
      // update: (store, {data: {_id, email, userAvatar}} ) => {
      //   const data = store.readQuery({query: authQuery });
      //   data.user = {_id, email, userAvatar};
      //   store.writeQuery({ query: authQuery, data });
      // }
    }).then((res) => {
      // const { email, userAvatar } = user;
      this.hiden();
      this.setState({email: '', password: ''});
    }).catch(err => {
      // show err message
      console.log('err', err)
    });
  }

  login = (evt) => {
    evt.persist();
    evt.preventDefault();
    evt.stopPropagation();
    this.loginRequest()
  }

  render() {
    const { email, password } = this.state;
    // const { match }= this.props
  
    // const shouldGoBack = match.path==='/write';

    return (
      <div className='login mask' id='login-mask'>
        {/*
          shouldGoBack ?
          <i className='close' onClick={(evt) => this.closeLogin(evt, shouldGoBack)}>返回</i> :
          <i className="material-icons close" onClick={this.closeLogin}>close</i>
        */}
        
        <div className='mask-box' id='login-mask-box'>
        login
        <form onSubmit={this.login}>
          <div>email:</div> 
          <input  type="text" value={email} 
                  onChange={(evt) => this.setState({email: evt.target.value})}/>
          <div>password:</div>
          <input  type="text" value={password} 
                  onChange={(evt) => this.setState({password: evt.target.value})}/>
          <button>登录</button>
        </form>
        </div>
      </div>
    )
  }
}

const LoginWithMutation = graphql(
  userLoginMutation,
)(Login);

export default LoginWithMutation;