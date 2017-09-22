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
  convertToRaw,
} from 'draft-js';
// import 'draft-js-emoji-plugin/lib/plugin.css';

import BlockStyleControls from './BlockStyleControls';
import InlineStyleControls from './InlineStyleControls';
import ColorControls, { colorStyleMap } from './ColorControls';
import PrismDecorator from './PrismDraftDecorator';
import createColorBlockPlugin from './ColorBlockPlugin';
import ImageAdd from './ImageAdd';
import profileAPI from '../../utils/profileUpload';

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

const initialState = {"entityMap":{"0":{"type":"emoji","mutability":"IMMUTABLE","data":{"emojiUnicode":"😋"}},"1":{"type":"image","mutability":"IMMUTABLE","data":{"src":"http://localhost:9090/59c1ef29c531d24a169e91c1/e31d2415d0d052332700a7bb762c2a3a.jpeg","alignment":"center"}}},"blocks":[{"key":"ahue4","text":"fdsafs","type":"unstyled","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}},{"key":"pj9b","text":"fdas","type":"unstyled","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}},{"key":"51k2a","text":"f","type":"unstyled","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}},{"key":"ca6fk","text":"asf","type":"unstyled","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}},{"key":"4cruv","text":"fasdfasfasdfsdafsaf","type":"header-one","depth":0,"inlineStyleRanges":[{"offset":0,"length":19,"style":"red"},{"offset":11,"length":8,"style":"ITALIC"}],"entityRanges":[],"data":{}},{"key":"fa4mj","text":"fafasdfas","type":"header-one","depth":0,"inlineStyleRanges":[{"offset":0,"length":9,"style":"red"},{"offset":0,"length":9,"style":"ITALIC"}],"entityRanges":[],"data":{}},{"key":"h2r7","text":"😋 ","type":"header-one","depth":0,"inlineStyleRanges":[],"entityRanges":[{"offset":0,"length":1,"key":0}],"data":{}},{"key":"diced","text":" ","type":"atomic","depth":0,"inlineStyleRanges":[],"entityRanges":[{"offset":0,"length":1,"key":1}],"data":{}},{"key":"6fts3","text":"","type":"unstyled","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}},{"key":"5ojnh","text":"fasfadsfadsfadsfasdfsadfasfasfdasfasdfasdfsf","type":"unstyled","depth":0,"inlineStyleRanges":[{"offset":11,"length":33,"style":"BOLD"},{"offset":29,"length":15,"style":"UNDERLINE"}],"entityRanges":[],"data":{}},{"key":"812nf","text":"","type":"unstyled","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}},{"key":"e6hck","text":"var a = 'a';","type":"code-block","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}}]}

class DraftEditor extends React.Component {
  constructor(props) {
    super(props);
    this.editor = null;
    this.titleFocus = false;
    this.state = {
      banner: '',
      title: '',
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
    if (this.titleFocus) return;
    if (this.editor) this.editor.focus();
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

  uploadImage = (evt) => {
    const files = evt.target.files;
    const filesLen = files.length;
    for (let i = 0; i < filesLen; i += 1) {
      const fileItem = files[i];
      const formData = new FormData();
      formData.append('file', fileItem);
      profileAPI(formData).then((res) => {
        if (res.status >= 400) throw new Error(`${res.status}`);
        return res.json();
      }).then((fileObj) => {
        const fileUrl = fileObj.fileURL;
        // this.addImage(fileUrl);
        this.setState({
          banner: fileUrl,
        })
        evt.target.value = '';
      }).catch((err) => {
        console.log(err);
      });
    }
  }

  saveToServer = () => {
    const { editorState } = this.state;
    const contentState = editorState.getCurrentContent();
    // const html = stateToHTML(contentState);
    // console.log(html);
    const html = convertToRaw(contentState);
    console.log(JSON.stringify(html));
    // const state = convertFromRaw(html);
    // this.setState({
    //   editorState: EditorState.createWithContent(convertFromRaw(state), prismDecorator),
    // });
  }

  render() {
    const { editorState, banner } = this.state;
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
                <div className='save-container'>
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
                <div className='banner-container'>
                  <input
                    id='uploadbanner'
                    type='file'
                    hidden
                    onChange={this.uploadImage}
                  />
                  {
                    banner ? <img src={banner} alt="" style={{width: '100%'}}/> :
                    <label htmlFor='uploadbanner'
                      style={{
                        cursor: 'pointer',
                        display: 'inline-block',
                        margin: '0 auto',
                        height: '80px',
                        paddingTop: '20px',
                        color: '#7f7f7f',
                      }}
                    >
                      <i
                        className='material-icons'
                        onClick={this.collectOpt}
                        role='presentation'
                      >add_a_photo</i>
                      <span style={{verticalAlign: 'middle'}}>添加图片</span>
                    </label>
                  }
                  
                </div>
                <div className='title-container' onClick={() => this.titleFocus = true}>
                  <input
                    type="text"
                    placeholder='标题'
                    value={this.state.title}
                    onChange={(e) => this.setState({
                      title: e.target.value,
                    })}
                  />
                </div>
                <div onClick={() => this.titleFocus = false}>
                  <Editor
                    blockStyleFn={getBlockStyle}
                    customStyleMap={styleMap}
                    editorState={editorState}
                    handleKeyCommand={this.handleKeyCommand}
                    onChange={this.onChange}
                    onTab={this.onTab}
                    placeholder='正文。。。'
                    ref={(r) => { this.editor = r; }}
                    spellCheck
                    plugins={plugins}
                  />
                  <AlignmentTool />
                </div>
              </div>
            </div> :
            null
        }
      </div>
    );
  }
}

export default DraftEditor;
