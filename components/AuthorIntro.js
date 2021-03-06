import React from 'react';
import PropTypes from 'prop-types';
import { withApollo } from 'react-apollo';

import { authorInfoQuery } from '../graphql/querys';

class AuthorIntro extends React.Component {
  static propTypes = {
    client: PropTypes.object,
    // show: PropTypes.bool,
  }
  static defaultProps = {
    client: null,
    // show: false,
  }
  constructor(props) {
    super(props);
    this.userId = '';
    this.node = null;
    this.state = {
      onHover: false,
      selfHeight: 0,
      show: false,
      eventShow: false,
      rect: {
        left: 0,
        top: 0,
      },
      user: {},
    };
  }


  componentDidMount() {
    this.setSelfHeight();
    this.node.addEventListener('authorIntro', this.setPostion);
  }

  componentDidUpdate() {
    const selfHeight = this.node.clientHeight;
    if (selfHeight !== this.state.selfHeight) {
      this.setSelfHeight();
    }
  }

  componentWillUnmount() {
    this.node.removeEventListener('authorIntro', this.setPostion);
  }


  setPostion = (evt) => {
    const { detail } = evt;
    const { show, rect, userId } = detail;
    if (userId && (this.userId !== userId)) {
      this.userId = userId;
      this.loadInfo();
    }
    this.eventShow = show;
    this.setState({
      show: this.state.onHover ? true : show,
      rect,
    });
  }


  setSelfHeight = () => {
    const selfHeight = this.node.clientHeight;
    if (this.node && selfHeight) {
      this.setState({
        selfHeight,
      });
    }
  }

  hover = () => {
    if (this.node) {
      this.setState({
        onHover: true,
        show: true,
      });
    }
  }

  hoverOver = () => {
    this.setState({ onHover: false });
    const timer = setTimeout(() => {
      if (this.eventShow) {
        clearTimeout(timer);
        return;
      }
      this.setState({ show: false, user: {} });
    }, 700);
  }

  loadInfo = () => {
    if (this.userId) {
      this.props.client.query({
        query: authorInfoQuery,
        variables: { userId: this.userId },
      }).then(({ data: { user } }) => {
        this.setState({ user });
      });
    }
    // this.setState();
  }
  render() {
    const { show, rect, selfHeight, user } = this.state;
    // console.log(selfHeight);
    const { userAvatar = '', username = '', userIntro = '',
      followed = false, isSelf = false } = user;
    const topHeight = selfHeight ? selfHeight + 15 : 30;
    const { left, top } = rect;
    const style = {
      display: show ? 'block' : 'none',
      left: `${left - 140}px`,
      top: `${top - topHeight}px`,
    };

    const topOrBottom = 'popover-top';
    let elem = <div>Loading...</div>;
    if (username) {
      elem = (
        <div>
          <div className='info'>
            <div>
              <h3>{username}</h3>
              <p>{userIntro}</p>
            </div>
            <img src={userAvatar} alt='' />
          </div>
          <div className='focus'>
            {!isSelf && <button>{followed ? '已关注' : '关注' }</button>}
          </div>
        </div>
      );
    }
    return (
      <div
        onMouseLeave={this.hoverOver}
        onMouseMove={this.hover}
        style={style}
        className={topOrBottom}
        id='author-intro'
        ref={(node) => { this.node = node; }}
      >
        {elem}
      </div>
    );
  }
}

export default withApollo(AuthorIntro);
