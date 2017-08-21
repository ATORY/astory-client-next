import React from 'react';
import PropTypes from 'prop-types';
// import Router from 'next/router';

import Header from '../components/Header';
import withData from '../lib/withData';
import { submitEmailAPI, submitNewPWDAPI } from '../utils';


function readCookie(name) {
  const nameEQ = `${name}=`;
  const ca = document.cookie.split(';');
  for (let i = 0; i < ca.length; i += 1) {
    let c = ca[i];
    while (c.charAt(0) === ' ') c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
  }
  return '';
}

class FindBackPwd extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      stepOne: true,
      stepTwo: false,
      stepThree: false,
      email: '',
      checkCode: '',
      password: '',
      err: '',
    };
  }

  stepOne = (e) => {
    e.preventDefault();
    this.setState({ err: '' });
    const { email } = this.state;
    const emailReg = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (!emailReg.test(email)) {
      this.setState({ err: '请输入合法的email' });
      return;
    }
    submitEmailAPI(email).then(res => res.json()).then((data) => {
      if (data.msg) {
        this.setState({ err: data.msg });
      } else {
        this.setState({ stepOne: false, stepTwo: true, stepThree: false });
      }
    }).catch(err => console.log(err));
  }

  submitPWD = (e) => {
    e.preventDefault();
    this.setState({ err: '' });
    const { email, checkCode, password } = this.state;
    submitNewPWDAPI(email, checkCode, password).then(res => res.json()).then((data) => {
      if (data.msg) {
        this.setState({ err: data.msg });
      } else {
        this.setState({ stepOne: false, stepTwo: false, stepThree: true });
      }
    }).catch(err => console.log(err));
  }

  backUp = (e) => {
    e.preventDefault();
    const backUrl = readCookie('backUrl') || '/';
    document.cookie = '';
    window.location.href = backUrl;
  }

  render() {
    let elem = <div />;
    const { url } = this.props;
    const { stepOne, stepTwo, stepThree, err, email } = this.state;
    if (stepOne) {
      elem = (
        <form id='stepone' onSubmit={this.stepOne}>
          <input
            placeholder='email'
            value={this.state.email}
            onChange={e => this.setState({
              email: e.target.value,
              err: '',
            })}
          />
          <div className='btns'>
            <button>下一步</button>
          </div>
        </form>
      );
    }
    if (stepTwo) {
      elem = (
        <form id='stepone' onSubmit={this.submitPWD}>
          <input value={email} disabled />
          <input
            placeholder='checkcode'
            value={this.state.checkCode}
            onChange={e => this.setState({
              checkCode: e.target.value,
              err: '',
            })}
          />
          <input
            placeholder='password'
            value={this.state.password}
            onChange={e => this.setState({
              password: e.target.value,
              err: '',
            })}
          />
          <div className='btns'>
            <button
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                this.setState(
                  { stepOne: true, stepTwo: false, err: '', checkCode: '', password: '' },
                );
              }}
            >上一步</button>
            <button>下一步</button>
          </div>
        </form>
      );
    }
    if (stepThree) {
      elem = (
        <div>
          <p>密码找回成功</p>
          <button onClick={this.backUp}>返回</button>
        </div>
      );
    }
    return (
      <div>
        <div className='header-shadow' />
        <Header pathname={url.pathname} title='FindBackPwd' />
        <div className='pwd-container'>
          <div>
            <h3>密码找回</h3>
          </div>
          <ul className='nav'>
            <li className={stepOne ? 'active' : ''}>one</li>
            <li className={stepTwo ? 'active' : ''}>two</li>
            <li className={stepThree ? 'active' : ''}>three</li>
          </ul>
          <div>
            {elem}
          </div>
          <div className='pwd-container-err'>{err}</div>
        </div>
      </div>
    );
  }
}

FindBackPwd.propTypes = {
  url: PropTypes.shape({
    pathname: PropTypes.string.isRequired,
  }).isRequired,
};

export default withData(FindBackPwd);

