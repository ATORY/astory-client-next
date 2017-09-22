import React from 'react';
import Editor, { composeDecorators } from 'draft-js-plugins-editor'; // eslint-disable-line import/no-unresolved
import createEmojiPlugin from 'draft-js-emoji-plugin';
import createImagePlugin from 'draft-js-image-plugin';
import createResizeablePlugin from 'draft-js-resizeable-plugin';
import createAlignmentPlugin from 'draft-js-alignment-plugin';
import createFocusPlugin from 'draft-js-focus-plugin';
import { stateToHTML } from 'draft-js-export-html';
import {
  // Editor,
  EditorState, RichUtils, Modifier,
  convertFromRaw,
  convertToRaw,
} from 'draft-js';
// import 'draft-js-emoji-plugin/lib/plugin.css';

import BlockStyleControls from './BlockStyleControls';
import InlineStyleControls from './InlineStyleControls';
import ColorControls, { colorStyleMap } from './ColorControls';
import PrismDecorator from './PrismDraftDecorator';
import createColorBlockPlugin from './ColorBlockPlugin';
import ImageAdd from './ImageAdd';

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
const imagePlugin = createImagePlugin({ decorator });

const colorBlockPlugin = createColorBlockPlugin({ decorator });
const plugins = [
  focusPlugin, alignmentPlugin, resizeablePlugin,
  colorBlockPlugin, emojiPlugin, imagePlugin,
];
const prismDecorator = new PrismDecorator();

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
    this.state = {
      // editorState: EditorState.createWithContent(convertFromRaw(initialState), prismDecorator),
      editorState: EditorState.createEmpty(prismDecorator),
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

  saveToServer = () => {
    const { editorState } = this.state;
    const contentState = editorState.getCurrentContent();
    // const html = stateToHTML(contentState);
    // console.log(html);
    // const html = convertToRaw(contentState);
    // console.log(html);
    // const state = convertFromRaw(html);
    // this.setState({
    //   editorState: EditorState.createWithContent(convertFromRaw(state), prismDecorator),
    // });
  }

  render() {
    const { editorState } = this.state;
    const contentState = editorState.getCurrentContent();
    let className = 'RichEditor-editor';
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
                <ImageAdd
                  editorState={this.state.editorState}
                  onChange={this.onChange}
                  modifier={imagePlugin.addImage}
                />
                <ColorControls
                  editorState={editorState}
                  onToggle={this.toggleColor}
                />
                <EmojiSuggestions />
                <EmojiSelect />
                <div>
                  <button
                    onClick={this.saveToServer}
                    style={{
                      width: 'inherit',
                      float: 'right',
                    }}
                  >存草稿</button>
                </div>
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
