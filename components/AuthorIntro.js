import React from 'react';
import PropTypes from 'prop-types';

class AuthorIntro extends React.Component {
  static propTypes = {
    userId: PropTypes.string,
    // show: PropTypes.bool,
  }
  static defaultProps = {
    userId: '',
    // show: false,
  }
  constructor(props) {
    super(props);
    this.node = null;
    this.state = {
      show: false,
      rect: {
        left: 0,
        top: 0,
      },
      user: {},
    };
  }

  componentDidMount() {
    this.node.addEventListener('authorIntro', (evt) => {
      const { detail } = evt;
      const { show, rect } = detail;
      this.setState({
        show, rect,
      });
    });
  }

  loadInfo() {
    this.setState();
  }
  render() {
    const { show, rect } = this.state;
    const { left, top } = rect;
    console.log(rect);
    const style = {
      display: show ? 'block' : 'none',
      left,
      top: top + 30,
    };

    return (
      <div style={style} id='author-intro' ref={(node) => { this.node = node; }}>
        AuthorIntro
      </div>
    );
  }
}

export default AuthorIntro;
