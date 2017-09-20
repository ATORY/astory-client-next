import React from 'react';
import PropTypes from 'prop-types';
// import {Editor, EditorState, RichUtils} from 'draft-js';

import StyleButton from './StyleButton';

const BLOCK_TYPES = [
  { label: 'H1', style: 'header-one', material: '' },
  { label: 'H2', style: 'header-two', material: '' },
  { label: 'H3', style: 'header-three', material: '' },
  { label: 'H4', style: 'header-four', material: '' },
  { label: 'H5', style: 'header-five', material: '' },
  { label: 'H6', style: 'header-six', material: '' },
  { label: 'Blockquote', style: 'blockquote', material: 'format_quote' },
  { label: 'UL', style: 'unordered-list-item', material: 'format_list_bulleted' },
  { label: 'OL', style: 'ordered-list-item', material: 'format_list_numbered' },
  { label: 'Code Block', style: 'code-block', material: 'code' },
];

const BlockStyleControls = (props) => {
  const { editorState } = props;
  const selection = editorState.getSelection();
  const blockType = editorState
    .getCurrentContent()
    .getBlockForKey(selection.getStartKey())
    .getType();

  return (
    <div className='RichEditor-controls'>
      {BLOCK_TYPES.map(type => (
        <StyleButton
          key={type.label}
          active={type.style === blockType}
          label={type.label}
          onToggle={props.onToggle}
          style={type.style}
          material={type.material}
        />
      ))}
    </div>
  );
};

BlockStyleControls.propTypes = {
  onToggle: PropTypes.func.isRequired,
  editorState: PropTypes.object.isRequired,
};

export default BlockStyleControls;
