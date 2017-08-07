import React from 'react';
import PropTypes from 'prop-types';

class CustomToolbar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      saveDone: false,
    };
    this.timer = null;
  }

  componentWillReceiveProps(nextProps) {
    const { saveing } = nextProps;
    if (saveing === true) {
      this.setState({ saveDone: true });
      this.setTimer();
    }
  }

  setTimer() {
    this.timer = setTimeout(() => {
      this.setState({
        saveDone: false,
      });
      this.clearTime();
    }, 1000);
  }

  clearTime() {
    if (this.timer) {
      clearTimeout(this.timer);
    }
  }

  render() {
    let tintElem = <i />;
    const customBtnCSS = {
      width: 'inherit',
      float: 'right',
    };
    const { saveDone } = this.state;
    const { saveing, published } = this.props;
    if (saveDone) {
      tintElem = <i className='material-icons' style={{ float: 'right' }}>check</i>;
    } else {
      tintElem = (
        <i className={`material-icons ${saveing && 'circle'}`} style={{ float: 'right' }}>cached</i>
      );
    }
    return (
      <div id='toolbar'>
        <select className='ql-header' defaultValue=''>
          <option value='1'>Title</option>
          <option value='3'>小标题</option>
          <option value=''>正文</option>
        </select>
        <button className='ql-bold' />
        <button className='ql-italic' />
        <select className='ql-color' defaultValue=''>
          <option value='' />
          <option value='red' />
          <option value='green' />
          <option value='blue' />
          <option value='orange' />
          <option value='violet' />
          <option value='#d0d1d2' />
        </select>
        <button className='ql-image' />
        <button className='ql-code-block' type='button' />

        <button className='ql-publish' style={customBtnCSS}>
          发布
          {published && <i className='material-icons'>check</i>}
        </button>
        <button className='ql-draft' style={customBtnCSS}>
          存草稿
        </button>
        {tintElem}
      </div>
    );
  }
}

CustomToolbar.propTypes = {
  published: PropTypes.bool.isRequired,
  saveing: PropTypes.bool.isRequired,
};

export default CustomToolbar;
