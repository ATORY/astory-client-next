import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import Editor, { composeDecorators } from 'draft-js-plugins-editor';
import {
  // Editor,
  EditorState,
  convertFromRaw,
} from 'draft-js';

import createEmojiPlugin from 'draft-js-emoji-plugin';
import createImagePlugin from 'draft-js-image-plugin';
import createResizeablePlugin from 'draft-js-resizeable-plugin';
import createAlignmentPlugin from 'draft-js-alignment-plugin';

import { colorStyleMap } from '../Draft/ColorControls';

const emojiPlugin = createEmojiPlugin();
const resizeablePlugin = createResizeablePlugin();
// const focusPlugin = createFocusPlugin();
const alignmentPlugin = createAlignmentPlugin();
// const { AlignmentTool } = alignmentPlugin;
// const { EmojiSuggestions, EmojiSelect } = emojiPlugin;
const decorator = composeDecorators(
  resizeablePlugin.decorator,
  // focusPlugin.decorator,
  alignmentPlugin.decorator,
);
const imagePlugin = createImagePlugin({ decorator });

// const colorBlockPlugin = createColorBlockPlugin({ decorator });
const plugins = [
  alignmentPlugin, resizeablePlugin,
  emojiPlugin, imagePlugin,
];

function getBlockStyle(block) {
  switch (block.getType()) {
    case 'blockquote': return 'RichEditor-blockquote';
    default: return null;
  }
}

const styleMap = {
  CODE: {
    // backgroundColor: 'rgba(29, 31, 33, 1.00)',
    backgroundColor: '#272822',
    fontFamily: '"Inconsolata", "Menlo", "Consolas", monospace',
    fontSize: 16,
    padding: 2,
  },
  ...colorStyleMap,
};

moment.locale('zh-cn');

const CommentCell = ({ _id, content, createDate, user }) => {
  const { userAvatar, username } = user;
  const isTmp = (typeof _id) === 'number';
  const initContent = JSON.parse(content);
  const editorState = EditorState.createWithContent(convertFromRaw(initContent));
  return (
    <div className={`comment-cell ${isTmp ? 'tmp' : ''}`}>
      <div className='user-intro'>
        <img src={userAvatar} alt='' />
        <div>
          <p>{username}</p>
          <span>{moment(createDate).fromNow()}</span>
        </div>
      </div>
      <div className='comment-content'>
        <Editor
          editorKey={_id}
          blockStyleFn={getBlockStyle}
          customStyleMap={styleMap}
          editorState={editorState}
          onChange={() => {}}
          spellCheck
          readOnly
          plugins={plugins}
        />
      </div>

    </div>
  );
};

CommentCell.propTypes = {
  _id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  content: PropTypes.string.isRequired,
  createDate: PropTypes.string.isRequired,
  user: PropTypes.shape({
    email: PropTypes.string,
  }).isRequired,
};


export default CommentCell;
