import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default class ImageAdd extends Component {
  static propTypes = {
    editorState: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired,
    modifier: PropTypes.func.isRequired,
  }
  constructor(props) {
    super(props);
    this.state = {
      url: 'https://imgs.atory.cc/599a826076bd800761359d45/85b4ffa6e628da2b52afd9dd072326ce.png',
      open: false,
    };
  }

  // When the popover is open and users click anywhere on the page,
  // the popover should close
  componentDidMount() {
    document.addEventListener('click', this.closePopover);
  }

  componentWillUnmount() {
    document.removeEventListener('click', this.closePopover);
  }

  // Note: make sure whenever a click happens within the popover it is not closed
  onPopoverClick = () => {
    this.preventNextClose = true;
  }

  openPopover = () => {
    if (!this.state.open) {
      this.preventNextClose = true;
      this.setState({
        open: true,
      });
    }
  };

  closePopover = () => {
    if (!this.preventNextClose && this.state.open) {
      this.setState({
        open: false,
      });
    }

    this.preventNextClose = false;
  };

  addImage = () => {
    const { editorState, onChange } = this.props;
    onChange(this.props.modifier(editorState, this.state.url));
  };

  changeUrl = (evt) => {
    this.setState({ url: evt.target.value });
  }

  render() {
    const popoverClassName = this.state.open ? 'addImagePopover' : 'addImageClosedPopover';
    const buttonClassName = this.state.open ? 'addImagePressedButton' : 'addImageButton';

    return (
      <div className='addImage'>
        <button
          className={buttonClassName}
          onMouseUp={this.openPopover}
          type='button'
        >
          +
        </button>
        <div role='presentation' className={popoverClassName} onClick={this.onPopoverClick} >
          <input
            type='text'
            placeholder='Paste the image url …'
            className='addImageInput'
            onChange={this.changeUrl}
            value={this.state.url}
          />
          <button
            className='addImageConfirmButton'
            type='button'
            onClick={this.addImage}
          >
            Add
          </button>
        </div>
      </div>
    );
  }
}
