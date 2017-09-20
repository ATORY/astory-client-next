import React from 'react';
import PropTypes from 'prop-types';

class StyleButton extends React.Component {
  static defaultProps = {
    material: '',
    color: '',
  }
  static propTypes = {
    style: PropTypes.string.isRequired,
    onToggle: PropTypes.func.isRequired,
    active: PropTypes.bool.isRequired,
    label: PropTypes.string.isRequired,
    material: PropTypes.string,
    // color: PropTypes.string,
  }
  constructor(props) {
    super(props);
    this.onToggle = (e) => {
      e.preventDefault();
      this.props.onToggle(this.props.style);
    };
  }

  render() {
    let className = 'RichEditor-styleButton';
    let materialIcon = 'material-icons stylebtn';
    if (this.props.active) {
      className += ' RichEditor-activeButton';
      materialIcon += ' active';
    }
    const { material, color } = this.props;
    if (!material) {
      return (
        <span role='presentation' className={className} onClick={this.onToggle}>
          {this.props.label}
        </span>
      );
    }
    if (color) {
      return (
        <span
          role='presentation'
          className='colorblock'
          onClick={this.onToggle}
          style={{
            backgroundColor: this.props.label,
          }}
        />
      );
    }
    return (
      <i role='presentation' className={materialIcon} onClick={this.onToggle}>
        {material}
      </i>
    );
  }
}

export default StyleButton;
