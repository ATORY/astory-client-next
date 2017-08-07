import React from 'react';
import ReactQuill from 'react-quill';
import { graphql } from 'react-apollo';
import PropTypes from 'prop-types';

import { newArticleMutation } from '../graphql/mutations';
import CustomToolbar from './CustomToolbar';

class Writer extends React.Component {
  constructor(props) {
    super(props);
    this.node = null;
    this.writer = null;
    this.fileInput = null;
    this.modules = {
      syntax: true, // Include syntax module
      // toolbar: [['code-block']],
      toolbar: {
        container: '#toolbar',
        handlers: {
          publish: this.publish,
          draft: this.draft,
          image: this.imageHandler,
        },
        // [{ 'header': [1, 2, false] }],
        // ['bold', 'italic', 'underline','strike', 'blockquote'],
        // [{'list': 'ordered'}, {'list': 'bullet'}, {'indent': '-1'}, {'indent': '+1'}],
        // ['link', 'image'],
        // ['code-block'],
        // [{ 'color': [] }, { 'background': [] }],

      },
    };

    this.formats = [
      'header', 'color', 'background',
      'bold', 'italic', 'underline', 'strike', 'blockquote', 'code-block',
      'list', 'bullet', 'indent',
      'link', 'image',
    ];
    this.state = {
      text: '',
      _id: '',
      draft: false,
      saveing: false,
      published: false,
    };
    this.handleChange = this.handleChange.bind(this);
  }

  componentDidMount() {
    if (this.writer) {
      this.writer.focus();
      this.quillRef = this.writer.getEditor();
    }
  }

  getTitle = () => {
    let title = '';
    const titles = this.node.getElementsByTagName('h1');
    if (titles.length > 0) {
      title = titles[0].innerText;
    }
    return title;
  }

  getImg = () => {
    let imgSrc = 'https://imgs.atory.cc/banner/58ef759fcba90a17dc10cf0b.png';
    const imgs = this.node.getElementsByTagName('img');
    if (imgs.length > 0) {
      imgSrc = imgs[0].src;
    }
    return imgSrc;
  }

  publish = () => {
    this.saveToServer(false);
  }

  draft = () => {
    // console.log('draft');
    this.saveToServer(true);
  }

  saveToServer = (draft) => {
    const title = this.getTitle();
    if (!title) {
      // alert('没有设置标题');
      return;
    }
    const shareImg = this.getImg();
    this.setState({ saveing: true });
    const { mutate } = this.props;
    const newArticle = {
      _id: this.state._id,
      title,
      shareImg,
      content: this.state.text,
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

  handleChange = (value) => {
    this.setState({ text: value });
  }

  // imageHandler(image, callback) {
  imageHandler = () => {
    this.fileInput.click();
  }

  insertImage = (value) => {
    const range = this.writer.getEditor().getSelection();
    // var value = prompt('What is the image URL');
    if (value) {
      this.writer.getEditor().insertEmbed(range.index, 'image', value, 'user');
    }
  }

  uploadImage = (evt) => {
    const files = evt.target.files;
    console.log(files);
    setTimeout(() => {
      this.insertImage('https://imgs.atory.cc/58ef759fcba90a17dc10cf0b/6c0e65f1e1fb13613efe8945fef75f44.jpeg');
      this.fileInput.value = '';
    }, 2000);
  }

  render() {
    const { published, saveing } = this.state;
    return (
      <div className='write write-wrapper' ref={(node) => { this.node = node; }}>
        <input
          type='file'
          hidden
          ref={(fileInput) => { this.fileInput = fileInput; }}
          onChange={this.uploadImage}
        />
        <div className='toolbar-container'>
          <CustomToolbar {...{ saveing, published }} />
        </div>
        <ReactQuill
          ref={(quill) => { this.writer = quill; }}
          theme='snow'
          placeholder='留下你的故事'
          modules={this.modules}
          formats={this.formats}
          value={this.state.text}
          onChange={this.handleChange}
        />
      </div>
    );
  }
}

Writer.propTypes = {
  mutate: PropTypes.func.isRequired,
};

const WriterWithMutation = graphql(newArticleMutation)(Writer);

export default WriterWithMutation;
