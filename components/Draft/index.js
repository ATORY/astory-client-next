import React from 'react';
import PropTypes from 'prop-types';
import { graphql } from 'react-apollo';
import Editor, { composeDecorators } from 'draft-js-plugins-editor'; // eslint-disable-line import/no-unresolved
import createEmojiPlugin from 'draft-js-emoji-plugin';
import createImagePlugin from 'draft-js-image-plugin';
import createResizeablePlugin from 'draft-js-resizeable-plugin';
import createAlignmentPlugin from 'draft-js-alignment-plugin';
import createFocusPlugin from 'draft-js-focus-plugin';
import Prism from 'prismjs';
import createPrismPlugin from 'draft-js-prism-plugin';
import { Map } from 'immutable';
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
// import PrismDecorator from './PrismDraftDecorator';
import createColorBlockPlugin from './ColorBlockPlugin';
import ImageAdd from './ImageAdd';
import profileAPI from '../../utils/profileUpload';
import { newArticleMutation } from '../../graphql/mutations';

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
const prismPlugin = createPrismPlugin({
  // Provide your own instance of PrismJS
  prism: Prism,
});
const colorBlockPlugin = createColorBlockPlugin({ decorator });
const plugins = [
  focusPlugin, alignmentPlugin, resizeablePlugin, prismPlugin,
  colorBlockPlugin, emojiPlugin, imagePlugin,
];
// const prismDecorator = new PrismDecorator();

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
  static propTypes = {
    _id: PropTypes.string,
    mutate: PropTypes.func.isRequired,
    text: PropTypes.string,
    title: PropTypes.string,
    banner: PropTypes.string,
  }
  static defaultProps = {
    _id: '',
    text: '',
    title: '',
    banner: '',
  }
  constructor(props) {
    super(props);
    this.editor = null;
    this.titleFocus = false;
    const content = props.text;
    let initContent = '';
    let editorState = EditorState.createEmpty();
    if (content) {
      initContent = JSON.parse(content);
      editorState = EditorState.createWithContent(convertFromRaw(initContent));
    }
    this.state = {
      _id: props._id,
      banner: props.banner,
      title: props.title,
      // editorState: EditorState.createWithContent(convertFromRaw(content || {}), prismDecorator),
      editorState,
      editor: false,
    };
  }

  componentDidMount() {
    this.setState({
      editor: true,
    });
  }

  // componentDidUpdate() {
  //   if (this.titleFocus) return;
  //   if (this.editor) this.editor.focus();
  // }

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
    if (blockType === 'code-block') {
      const { editorState } = this.state;
      const selection = editorState.getSelection();
      const contentState = editorState.getCurrentContent();
      const nextContentState = Modifier.setBlockData(
        contentState,
        selection,
        Map({ language: 'javascript' }),
      );
      const nextEditorState = EditorState.push(
        editorState,
        nextContentState,
        'change-block-data',
      );

      this.onChange(
        RichUtils.toggleCode(
          nextEditorState,
        ),
      );
    } else {
      this.onChange(
        RichUtils.toggleBlockType(
          this.state.editorState,
          blockType,
        ),
      );
    }
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
    evt.persist();
    const target = evt.target;
    const files = target.files;
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
        });
        target.value = '';
      }).catch((err) => {
        console.log(err);
      });
    }
  }

  saveToServer = (e, draft = true) => {
    e.persist();
    const { editorState, banner, title } = this.state;
    if (!title) {
      alert('没有设置标题');
      return;
    }
    const contentState = editorState.getCurrentContent();
    const html = convertToRaw(contentState);
    const content = JSON.stringify(html);
    this.setState({ saveing: true });
    const { mutate } = this.props;
    console.log(content);
    const newArticle = {
      _id: this.state._id,
      title,
      shareImg: banner,
      description: 'description',
      content,
      draft,
    };
    mutate({
      variables: { newArticle },
    }).then(({ data: { article } }) => {
      const { _id } = article;
      this.setState({
        saveing: false,
        _id,
        draft,
        published: !article.draft,
      });
    }).catch(err => console.log('err', err));
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
                    onClick={e => this.saveToServer(e)}
                    style={{
                      width: 'inherit',
                      margin: '0 10px',
                    }}
                  >存草稿</button>
                  <button onClick={e => this.saveToServer(e, false)}>
                    发布
                  </button>
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
                    banner ?
                      <img src={banner} alt='' style={{ width: '100%' }} /> :
                      <label
                        htmlFor='uploadbanner'
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
                        <span style={{ verticalAlign: 'middle' }}>添加图片</span>
                      </label>
                  }
                </div>
                <div
                  role='presentation'
                  className='title-container'
                >
                  <input
                    placeholder='标题'
                    value={this.state.title}
                    onChange={e => this.setState({
                      title: e.target.value,
                    })}
                  />
                </div>
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
            </div> :
            null
        }
      </div>
    );
  }
}

const DraftWithMutation = graphql(newArticleMutation)(DraftEditor);

export default DraftWithMutation;

