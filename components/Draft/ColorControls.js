import React from 'react';
import PropTypes from 'prop-types';
// import {Editor, EditorState, RichUtils} from 'draft-js';

import StyleButton from './StyleButton';

const COLORS = [
  { label: 'Black', style: 'black', material: 'format_color_text' },
  { label: 'Red', style: 'red', material: 'format_color_text' },
  { label: 'Orange', style: 'orange', material: 'format_color_text' },
  // { label: 'Yellow', style: 'yellow' },
  // { label: 'Green', style: 'green' },
  // { label: 'Blue', style: 'blue' },
  // { label: 'Indigo', style: 'indigo' },
  // { label: 'Violet', style: 'violet' },
];

export const colorStyleMap = {
  black: {
    color: 'rgba(0, 0, 0, 1.0)',
  },
  red: {
    color: 'rgba(255, 0, 0, 1.0)',
  },
  orange: {
    color: 'rgba(255, 127, 0, 1.0)',
  },
  yellow: {
    color: 'rgba(180, 180, 0, 1.0)',
  },
  green: {
    color: 'rgba(0, 180, 0, 1.0)',
  },
  blue: {
    color: 'rgba(0, 0, 255, 1.0)',
  },
  indigo: {
    color: 'rgba(75, 0, 130, 1.0)',
  },
  violet: {
    color: 'rgba(127, 0, 255, 1.0)',
  },
};

class ColorControls extends React.Component {
  static propTypes = {
    onToggle: PropTypes.func.isRequired,
    editorState: PropTypes.object.isRequired,
  };
  constructor(props) {
    super(props);
    this.timer = null;
    this.state = {
      showColors: false,
    };
  }
  selectColor = () => {
    this.setState({
      showColors: !this.state.showColors,
    });
  }
  render() {
    const currentStyle = this.props.editorState.getCurrentInlineStyle();
    // console.log('currentStyle', currentStyle, currentStyle.first());
    const style = {
      color: currentStyle.first() || 'black',
      cursor: 'pointer',
    };
    return (
      <div
        className='RichEditor-controls'
        style={{
          position: 'relative',
        }}
      >
        <i
          role='presentation'
          className='material-icons'
          style={style}
          onClick={this.selectColor}
        >format_color_text</i>
        <div
          role='presentation'
          className='colorblockcontainer'
          style={{
            display: this.state.showColors ? 'block' : 'none',
          }}
          onClick={() => {
            this.setState({ showColors: false });
          }}
          onMouseLeave={() => {
            this.timer = setTimeout(() => {
              this.setState({ showColors: false });
              this.timer = null;
            }, 2000);
          }}
          onMouseEnter={() => {
            if (this.timer) {
              clearTimeout(this.timer);
            }
            this.setState({ showColors: true });
          }}
        >
          {
            COLORS.map(type => (
              <StyleButton
                key={type.label}
                active={currentStyle.has(type.style)}
                label={type.label}
                onToggle={this.props.onToggle}
                style={type.style}
                material={type.material}
                color={type.style}
              />
            ))
          }
        </div>
      </div>
    );
  }
}

export default ColorControls;
