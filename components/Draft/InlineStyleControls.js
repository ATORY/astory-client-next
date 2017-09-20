import React from 'react';
import PropTypes from 'prop-types';
// import {Editor, EditorState, RichUtils} from 'draft-js';

import StyleButton from './StyleButton';

const INLINE_STYLES = [
  { label: 'Bold', style: 'BOLD', material: 'format_bold' },
  { label: 'Italic', style: 'ITALIC', material: 'format_italic' },
  { label: 'Underline', style: 'UNDERLINE', material: 'format_underlined' },
  // { label: 'Monospace', style: 'CODE' },
];

const InlineStyleControls = (props) => {
  const currentStyle = props.editorState.getCurrentInlineStyle();
  return (
    <div className='RichEditor-controls'>
      {INLINE_STYLES.map(type => (
        <StyleButton
          key={type.label}
          active={currentStyle.has(type.style)}
          label={type.label}
          onToggle={props.onToggle}
          style={type.style}
          material={type.material}
        />
      ))}
    </div>
  );
};

InlineStyleControls.propTypes = {
  onToggle: PropTypes.func.isRequired,
  editorState: PropTypes.object.isRequired,
};

export default InlineStyleControls;
