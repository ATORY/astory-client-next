import React from 'react';
import { Editor, EditorState, RichUtils, Modifier, convertFromRaw } from 'draft-js';


import BlockStyleControls from './BlockStyleControls';
import InlineStyleControls from './InlineStyleControls';
import ColorControls, { colorStyleMap } from './ColorControls';
import PrismDecorator from './PrismDraftDecorator';


// console.log('decorator', decorator);
const contentStateP = convertFromRaw({
  entityMap: {},
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
      type: 'code-block',
      text: 'var message = "This is awesome!";',
    },
  ],
});

function getBlockStyle(block) {
  switch (block.getType()) {
    case 'blockquote': return 'RichEditor-blockquote';
    default: return null;
  }
}

const styleMap = {
  CODE: {
    backgroundColor: 'rgba(29, 31, 33, 1.00)',
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
    const decorator = new PrismDecorator();
    this.state = {
      editorState: EditorState.createWithContent(contentStateP, decorator),
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
                />
              </div>
            </div> :
            null
        }
      </div>
    );
  }
}

export default DraftEditor;
