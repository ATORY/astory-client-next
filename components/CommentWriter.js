import React from 'react';
import PropTypes from 'prop-types';
import { graphql, compose, withApollo } from 'react-apollo';
import ReactQuill from 'react-quill';

import { articleQuery, authQuery } from '../graphql/querys';
import { newCommentMutation } from '../graphql/mutations';
import { showLoginMask } from '../utils';

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
    this.modules = {
      syntax: true, // Include syntax module
      // toolbar: [['code-block']],
      toolbar: [
        ['bold', 'italic', 'underline', 'strike', 'blockquote'],
        // [{ 'list': 'ordered'}, {'list': 'bullet'}, {'indent': '-1'}, {'indent': '+1'}],
        // ['link', 'image'],
        ['code-block'],
        // [{ 'color': [] }, { 'background': [] }],
      ],
    };

    this.formats = [
      'header', 'color', 'background',
      'bold', 'italic', 'underline', 'strike', 'blockquote', 'code-block',
      'list', 'bullet', 'indent',
      'link', 'image',
    ];
    this.state = {
      text: '',
    };
  }
  handleChange = (value) => {
    this.setState({ text: value });
  }
  submitComment = () => {
    const { articleId } = this.props;
    if (!articleId) {
      console.log('articleId is null');
      return;
    }
    const content = this.state.text;
    this.props.client.query({
      query: authQuery,
    }).then(({ data: { user } }) => {
      if (!user._id) {
        showLoginMask();
        return;
      }
      this.props.mutate({
        variables: { articleId, content, originId: '' },
        optimisticResponse: {
          __typename: 'Mutation',
          newArticleComment: {
            __typename: 'Comment',
            createDate: new Date().toISOString(),
          },
        },
        update: (store, { data: { newArticleComment } }) => {
          // this.setState({ mark: markArticle.mark });
          const data = store.readQuery({
            query: articleQuery,
            variables: { articleId },
          });
          console.log(user);
          // return;
          data.article.comments.unshift({
            __typename: 'Comment',
            _id: Math.ceil(Math.random() * 1000000),
            content,
            createDate: newArticleComment.createDate,
            user,
          });
          store.writeQuery({
            query: articleQuery,
            variables: { articleId },
            data,
          });
        },
      }).catch(err => console.log(err));
    }).catch(err => console.log(err));
  }
  render() {
    return (
      <div className='comment-writer'>
        <ReactQuill
          ref={(quill) => { this.writer = quill; }}
          theme='snow'
          placeholder='评论'
          modules={this.modules}
          formats={this.formats}
          value={this.state.text}
          onChange={this.handleChange}
        />
        <div className='comment-submit'>
          <button onClick={this.submitComment}>OK</button>
        </div>
      </div>
    );
  }
}

const CommentWriterWithMutation = compose(
  withApollo,
  graphql(newCommentMutation),
)(CommentWriter);

export default CommentWriterWithMutation;
