import React, { Component } from 'react';
import PropTypes from 'prop-types';

import profileAPI from '../../utils/profileUpload';

export default class ImageAdd extends Component {
  static propTypes = {
    editorState: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired,
    modifier: PropTypes.func.isRequired,
  }
  constructor(props) {
    super(props);
    this.fileInput = null;
  }

  addImage = (url) => {
    const { editorState, onChange } = this.props;
    onChange(this.props.modifier(editorState, url));
  };

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
        this.addImage(fileUrl);
        this.fileInput.value = '';
      }).catch((err) => {
        console.log(err);
      });
    }
  }

  render() {
    return (
      <div className='addImage RichEditor-controls'>
        <input
          id='uploadfile'
          type='file'
          hidden
          ref={(fileInput) => { this.fileInput = fileInput; }}
          onChange={this.uploadImage}
        />
        <label htmlFor='uploadfile'>
          <i
            role='presentation'
            className='material-icons'
            style={{
              cursor: 'pointer',
            }}
          >photo</i>
        </label>
      </div>
    );
  }
}
