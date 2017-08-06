import React from 'react';
import { findDOMNode } from 'react-dom';
import ReactQuill from 'react-quill';
import { graphql } from 'react-apollo';

import { newArticleMutation } from '../graphql/mutations';

class CustomToolbar extends React.Component {
  constructor(props) {
    super(props);
    this.state={
      saveDone: false,
    }
    this.timer = null;
  }

  setTimer =()=> {
    this.timer = setTimeout(() => {
      this.setState({
        saveDone: false
      });
      this.clearTime();
    }, 1000)
  }

  clearTime = () => {
    if(this.timer) {
      clearTimeout(this.timer);
    }
  }

  componentWillReceiveProps(nextProps) {
    const { saveing } = this.props;
    if (saveing === true) {
      this.setState({saveDone: true});
      this.setTimer();
    }
  }
  render() {
    const customBtnCSS = {
      width: 'inherit',
      float: 'right'
    }
    const { saveDone } = this.state;
    const { saveing, published } = this.props;
    return (
      <div id="toolbar">
        <select className="ql-header" defaultValue=''>
          <option value="1">Title</option>
          <option value="3">小标题</option>
          <option value="">正文</option>
        </select>
        <button className="ql-bold"></button>
        <button className="ql-italic"></button>
        <select className="ql-color" defaultValue=''>
          <option value=""></option>
          <option value="red"></option>
          <option value="green"></option>
          <option value="blue"></option>
          <option value="orange"></option>
          <option value="violet"></option>
          <option value="#d0d1d2"></option>
        </select>
        <button className="ql-image"></button>
        <button className="ql-code-block" type="button"></button>

        <button className='ql-publish' style={customBtnCSS}>
          发布
          {published && <i className='material-icons'>check</i>}
        </button>
        <button className='ql-draft' style={customBtnCSS}>
          存草稿
        </button>
        {
          saveDone ? 
          <i className='material-icons' style={{float: 'right'}}>check</i>:
          <i className={`material-icons ${saveing && 'circle'}`} style={{float: 'right'}}>cached</i>
        }
      </div>
    )
  }
}

class Writer extends React.Component {
  constructor(props) {
    super(props);
    this.writer = null;
    this.fileInput = null;
    this.modules = {
      syntax: true,              // Include syntax module
      toolbar: [['code-block']],
      toolbar: {
        container: "#toolbar",
        handlers: {
          "publish": this.publish,
          "draft": this.draft,
          "image": this.imageHandler
        }
        // [{ 'header': [1, 2, false] }],
        // ['bold', 'italic', 'underline','strike', 'blockquote'],
        // [{'list': 'ordered'}, {'list': 'bullet'}, {'indent': '-1'}, {'indent': '+1'}],
        // ['link', 'image'],
        // ['code-block'],
        // [{ 'color': [] }, { 'background': [] }],

      }
    };

    this.formats = [
      'header', 'color', 'background',
      'bold', 'italic', 'underline', 'strike', 'blockquote','code-block',
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

  draft = () => {
    // console.log('draft');
    this.saveToServer(true);
  }

  publish = () => {
    this.saveToServer(false);
  }

  getTitle = () => {
    let title = '';
    const titles = findDOMNode(this).getElementsByTagName('h1');
    if(titles.length > 0){
      title = titles[0].innerText;
    }
    return title;
  }

  getImg = () => {
    let imgSrc = 'https://imgs.atory.cc/banner/58ef759fcba90a17dc10cf0b.png';
    const imgs = findDOMNode(this).getElementsByTagName('img');
    if(imgs.length > 0){
      imgSrc = imgs[0].src;
    }
    return imgSrc;
  }

  saveToServer = (draft) => {
    const title = this.getTitle();
    if(!title) {
      alert('没有设置标题');
      return;
    }
    const shareImg = this.getImg();
    this.setState({saveing: true});
    const { mutate } = this.props;
    mutate({ 
      variables: { newArticle: { 
        _id: this.state._id,
        title,
        shareImg,
        content: this.state.text,
        draft,
      }},
    }).then(({data: { article }}) => {
      const { _id, draft } = article;
      this.setState({
        saveing: false,
        _id,
        draft,
        published: !draft
      });
    }).catch(err => {
      console.log('err', err)
    });
  }

  handleChange(value) {
    this.setState({ text: value })
  }

  imageHandler = (image, callback) => {
    this.fileInput.click();
  } 

  insertImage = (value) => {
    const range = this.writer.getEditor().getSelection();
    // var value = prompt('What is the image URL');
    if(value) {
      this.writer.getEditor().insertEmbed(range.index, 'image', value, "user");
    }
  }

  uploadImage = (evt) => {
    const files = evt.target.files;
    // console.log(files)
    setTimeout(() => {
      this.insertImage('https://imgs.atory.cc/58ef759fcba90a17dc10cf0b/6c0e65f1e1fb13613efe8945fef75f44.jpeg')
      this.fileInput.value = '';
    }, 2000);
  }

  componentDidMount() {
    if(this.writer) {
      this.writer.focus();
      this.quillRef = this.writer.getEditor();
    }
  }


  render() {
    const {published, saveing} = this.state;
    return (
      <div className="write write-wrapper">
        <input  type="file" hidden 
                ref={ fileInput => { this.fileInput = fileInput; }}
                onChange={this.uploadImage}/>
        <div className='toolbar-container'>
          <CustomToolbar {...{saveing,  published}}/>
        </div>
        <ReactQuill ref={(quill) => { this.writer = quill; }}
                    theme="snow" 
                    placeholder='留下你的故事'
                    modules={this.modules}
                    formats={this.formats}
                    value={this.state.text}
                    onChange={this.handleChange} /> 
      </div>
    )
  }
}

const WriterWithMutation = graphql(newArticleMutation)(Writer);

export default WriterWithMutation;