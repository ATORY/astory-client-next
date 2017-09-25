import React from 'react';

import PropTypes from 'prop-types';
import { graphql, compose, withApollo } from 'react-apollo';

import Editor, { composeDecorators } from 'draft-js-plugins-editor';
import {
  // Editor,
  RichUtils,
  EditorState,
  convertToRaw,
} from 'draft-js';

import createEmojiPlugin from 'draft-js-emoji-plugin';
import createImagePlugin from 'draft-js-image-plugin';
import createResizeablePlugin from 'draft-js-resizeable-plugin';
import createAlignmentPlugin from 'draft-js-alignment-plugin';

import BlockStyleControls from '../Draft/BlockStyleControls';
import InlineStyleControls from '../Draft/InlineStyleControls';
import ColorControls, { colorStyleMap } from '../Draft/ColorControls';

import { articleQuery, authQuery } from '../../graphql/querys';
import { newCommentMutation } from '../../graphql/mutations';
import { showLoginMask } from '../../utils';

const emojiPlugin = createEmojiPlugin();
const resizeablePlugin = createResizeablePlugin();
// const focusPlugin = createFocusPlugin();
const alignmentPlugin = createAlignmentPlugin();
// const { AlignmentTool } = alignmentPlugin;
const { EmojiSuggestions, EmojiSelect } = emojiPlugin;
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

class CommentWriter extends React.Component {
  static propTypes = {
    client: PropTypes.object.isRequired,
    mutate: PropTypes.func.isRequired,
    articleId: PropTypes.string,
  }
  static defaultProps = {
    articleId: '',
  }
  constructor(props) {
    super(props);
    this.node = null;
    this.writer = null;
    this.state = {
      editorState: EditorState.createEmpty(),
      editor: false,
    };
  }
  componentDidMount() {
    this.setState({
      editor: true,
    });
  }
  onChange = (editorState) => {
    this.setState({
      editorState,
    });
  }
  submitComment = () => {
    const { articleId } = this.props;
    if (!articleId) {
      console.log('articleId is null');
      return;
    }
    // const content = this.state.text;
    const { editorState } = this.state;
    const contentState = editorState.getCurrentContent();
    const html = convertToRaw(contentState);
    const content = JSON.stringify(html);
    this.props.client.query({
      query: authQuery,
    }).then(({ data: { user } }) => {
      if (!user._id) {
        showLoginMask();
      } else {
        this.props.mutate({
          variables: { articleId, content, originId: '' },
          optimisticResponse: {
            __typename: 'Mutation',
            newArticleComment: {
              __typename: 'Comment',
              _id: Math.ceil(Math.random() * 1000000),
              createDate: new Date().toISOString(),
              content,
              user,
            },
          },
          update: (store, { data: { newArticleComment } }) => {
            const data = store.readQuery({
              query: articleQuery,
              variables: { articleId },
            });
            data.article.comments.unshift(newArticleComment);
            store.writeQuery({
              query: articleQuery,
              variables: { articleId },
              data,
            });
          },
        }).then(() => {
          this.setState({
            text: '',
          });
        }).catch(err => console.log(err));
      }
    }).catch(err => console.log(err));
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
  render() {
    const { editorState } = this.state;
    if (this.state.editor) {
      return (
        <div className='comment-writer'>
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
              <EmojiSuggestions />
              <EmojiSelect />
            </div>
            <div
              className='RichEditor-editor'
              style={{
                paddingTop: '5px',
              }}
            >
              <Editor
                placeholder='your comment...'
                blockStyleFn={getBlockStyle}
                customStyleMap={styleMap}
                editorState={editorState}
                onChange={this.onChange}
                spellCheck
                plugins={plugins}
              />
            </div>
          </div>
          <div className='comment-submit'>
            <button onClick={this.submitComment}>OK</button>
          </div>

        </div>
      );
    }
    return null;
  }
}

const CommentWriterWithMutation = compose(
  withApollo,
  graphql(newCommentMutation),
)(CommentWriter);

export default CommentWriterWithMutation;
