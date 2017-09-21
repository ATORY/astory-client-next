import React from 'react';
import Editor, { composeDecorators } from 'draft-js-plugins-editor'; // eslint-disable-line import/no-unresolved
import createEmojiPlugin from 'draft-js-emoji-plugin';
import createImagePlugin from 'draft-js-image-plugin';
import createResizeablePlugin from 'draft-js-resizeable-plugin';
import createAlignmentPlugin from 'draft-js-alignment-plugin';
import createFocusPlugin from 'draft-js-focus-plugin';
import {
  // Editor,
  EditorState, RichUtils, Modifier,
  convertFromRaw,
} from 'draft-js';
// import 'draft-js-emoji-plugin/lib/plugin.css';

import BlockStyleControls from './BlockStyleControls';
import InlineStyleControls from './InlineStyleControls';
import ColorControls, { colorStyleMap } from './ColorControls';
import PrismDecorator from './PrismDraftDecorator';
import createColorBlockPlugin from './ColorBlockPlugin';


// // console.log('decorator', decorator);
const initialState = {
  entityMap: {
    0: {
      type: 'colorBlock',
      mutability: 'IMMUTABLE',
      data: {},
    },
  },
  blocks: [
    {
      type: 'header-one',
      text: 'Demo for draft-js-prism',
    },
    {
      type: 'unstyled',
      text: 'Type some JavaScript below:',
    },
    {
      "key": "ov7r",
      "text": " ",
      "type": "atomic",
      "depth": 0,
      "inlineStyleRanges": [],
      "entityRanges": [{
          "offset": 0,
          "length": 1,
          "key": 0
      }],
      "data": {}
    },
    {
      type: 'code-block',
      text: 'var message = "This is awesome!";',
    },
  ],
};
// const initialState = {
//   "entityMap": {
//       "0": {
//           "type": "colorBlock",
//           "mutability": "IMMUTABLE",
//           "data": {}
//       }
//   },
//   "blocks": [{
//       "key": "9gm3s",
//       "text": "This is a simple example. Focus the block by clicking on it and change alignment via the toolbar.",
//       "type": "unstyled",
//       "depth": 0,
//       "inlineStyleRanges": [],
//       "entityRanges": [],
//       "data": {}
//   }, {
//       "key": "ov7r",
//       "text": " ",
//       "type": "atomic",
//       "depth": 0,
//       "inlineStyleRanges": [],
//       "entityRanges": [{
//           "offset": 0,
//           "length": 1,
//           "key": 0
//       }],
//       "data": {}
//   }, {
//       "key": "e23a8",
//       "text": "More text here to demonstrate how inline left/right alignment works …",
//       "type": "unstyled",
//       "depth": 0,
//       "inlineStyleRanges": [],
//       "entityRanges": [],
//       "data": {}
//   }]
// };

const emojiPlugin = createEmojiPlugin();
const resizeablePlugin = createResizeablePlugin();
const focusPlugin = createFocusPlugin();
const alignmentPlugin = createAlignmentPlugin();
const { AlignmentTool } = alignmentPlugin;
const { EmojiSuggestions, EmojiSelect } = emojiPlugin;
const decorator = composeDecorators(
  resizeablePlugin.decorator,
  focusPlugin.decorator,
  alignmentPlugin.decorator,
);

const colorBlockPlugin = createColorBlockPlugin({ decorator });
const plugins = [focusPlugin, alignmentPlugin, resizeablePlugin, colorBlockPlugin, emojiPlugin];

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

class DraftEditor extends React.Component {
  constructor(props) {
    super(props);
    this.editor = null;
    const prismDecorator = new PrismDecorator();
    this.state = {
      editorState: EditorState.createWithContent(convertFromRaw(initialState), prismDecorator),
      // editorState: EditorState.createEmpty(prismDecorator),
      editor: false,
    };
  }

  componentDidMount() {
    this.setState({
      editor: true,
    });
  }
  componentDidUpdate() {
    if (this.editor) {
      this.editor.focus();
    }
  }

  onTab = (e) => {
    const maxDepth = 4;
    this.onChange(RichUtils.onTab(e, this.state.editorState, maxDepth));
  }

  onChange = (editorState) => {
    this.setState({
      editorState,
    });
  }

  toggleBlockType = (blockType) => {
    this.onChange(
      RichUtils.toggleBlockType(
        this.state.editorState,
        blockType,
      ),
    );
  }

  toggleInlineStyle = (inlineStyle) => {
    this.onChange(
      RichUtils.toggleInlineStyle(
        this.state.editorState,
        inlineStyle,
      ),
    );
  }

  toggleColor = (toggledColor) => {
    const { editorState } = this.state;
    const selection = editorState.getSelection();

    // Let's just allow one color at a time. Turn off all active colors.
    const nextContentState = Object.keys(colorStyleMap).reduce(
      (contentState, color) => Modifier.removeInlineStyle(contentState, selection, color),
      editorState.getCurrentContent(),
    );

    let nextEditorState = EditorState.push(
      editorState,
      nextContentState,
      'change-inline-style',
    );

    const currentStyle = editorState.getCurrentInlineStyle();

    // Unset style override for current color.
    if (selection.isCollapsed()) {
      nextEditorState = currentStyle.reduce(
        (state, color) => RichUtils.toggleInlineStyle(state, color),
        nextEditorState,
      );
    }

    // If the color is being toggled on, apply it.
    if (!currentStyle.has(toggledColor)) {
      nextEditorState = RichUtils.toggleInlineStyle(
        nextEditorState,
        toggledColor,
      );
    }

    this.onChange(nextEditorState);
  }

  render() {
    const { editorState } = this.state;

    // If the user changes block type before entering any text, we can
    // either style the placeholder or hide it. Let's just hide it now.
    let className = 'RichEditor-editor';
    const contentState = editorState.getCurrentContent();

    if (!contentState.hasText()) {
      if (contentState.getBlockMap().first().getType() !== 'unstyled') {
        className += ' RichEditor-hidePlaceholder';
      }
    }
    return (
      <div className='draft-editor'>
        {
          this.state.editor ?
            <div className='RichEditor-root'>
              <div className='RichEditor-controls-container'>
                <BlockStyleControls
                  editorState={editorState}
                  onToggle={this.toggleBlockType}
                />
                <InlineStyleControls
                  editorState={editorState}
                  onToggle={this.toggleInlineStyle}
                />
                <ColorControls
                  editorState={editorState}
                  onToggle={this.toggleColor}
                />
                <EmojiSuggestions />
                <EmojiSelect />
              </div>
              <div role='presentation' className={className} onClick={this.focus}>
                <Editor
                  blockStyleFn={getBlockStyle}
                  customStyleMap={styleMap}
                  editorState={editorState}
                  handleKeyCommand={this.handleKeyCommand}
                  onChange={this.onChange}
                  onTab={this.onTab}
                  placeholder='Tell a story...'
                  ref={(r) => { this.editor = r; }}
                  spellCheck
                  plugins={plugins}
                />
                <AlignmentTool />
              </div>
            </div> :
            null
        }
      </div>
    );
  }
}

export default DraftEditor;
