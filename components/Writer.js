import React from 'react';
import ReactQuill from 'react-quill';


const CustomToolbar = () => (
  <div id="toolbar">
    <select className="ql-header" defaultValue=''>
      <option value="1"></option>
      <option value="2"></option>
      <option value=""></option>
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

    <button className='ql-publish' style={{float: 'right', width: '100px'}}>
      publish
    </button>
    <span style={{float: 'right', width: '50px'}}>Draft</span>
  </div>
)

class Writer extends React.Component {
  constructor(props) {
    super(props);
    this.writer = null;
    this.fileInput = null;
    this.modules = {
      toolbar: {
        container: "#toolbar",
        handlers: {
          "publish": this.publish,
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
    this.state = { text: '' };
    this.handleChange = this.handleChange.bind(this);
  }

  publish = () => {
    console.log('publish')
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
    return (
      <div className="write write-wrapper">
         <input  type="file" hidden 
                ref={ fileInput => { this.fileInput = fileInput; }}
                onChange={this.uploadImage}/>
        <CustomToolbar />
        <ReactQuill ref={(quill) => { this.writer = quill; }}
                    theme="snow" 
                    placeholder='a story'
                    modules={this.modules}
                    formats={this.formats}
                    value={this.state.text}
                    onChange={this.handleChange} /> 
      </div>
    )
  }
}

export default Writer;