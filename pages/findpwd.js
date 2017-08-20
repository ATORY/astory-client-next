import React from 'react';
import PropTypes from 'prop-types';

import Header from '../components/Header';
import withData from '../lib/withData';
import { submitEmailAPI, submitNewPWDAPI } from '../utils';

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
        this.setState({ stepTwo: true });
      }
    }).catch(err => console.log(err));
  }

  submitPWD = (e) => {
    e.preventDefault();
    const { email, checkCode, password } = this.state;
    submitNewPWDAPI(email, checkCode, password).then(res => res.json()).then((data) => {
      if (data.msg) {
        this.setState({ err: data.msg });
      } else {
        this.setState({ stepThree: true });
      }
    }).catch(err => console.log(err));
  }

  render() {
    let elem = <div />;
    const { url } = this.props;
    const { stepOne, stepTwo, err } = this.state;
    if (stepOne) {
      elem = (
        <form id='stepone' onSubmit={this.stepOne}>
          <input
            value={this.state.email}
            onChange={e => this.setState({
              email: e.target.value,
            })}
          />
          <button>确定</button>
        </form>
      );
    }
    if (stepTwo) {
      elem = (
        <form id='stepone' onSubmit={this.submitPWD}>
          <input
            value={this.state.checkCode}
            onChange={e => this.setState({
              checkCode: e.target.value,
            })}
          />
          <input
            value={this.state.password}
            onChange={e => this.setState({
              password: e.target.value,
            })}
          />
          <button>确定</button>
        </form>
      );
    }
    return (
      <div>
        <div className='header-shadow' />
        <Header pathname={url.pathname} title='FindBackPwd' />
        <div>
          {elem}
          <div>{err}</div>
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
