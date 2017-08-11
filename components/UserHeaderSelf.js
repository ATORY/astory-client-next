import React from 'react';
import PropTypes from 'prop-types';
import fetch from 'isomorphic-fetch';

/**
 * profileAPI: avatar上传
 * @param {*form} formData form包装file
 * @param {*} cb 
 * return: Promise<Response> 
 */
function profileAPI(formData) {
  const profilePath = 'http://localhost:4000/profile/avatar';
  return fetch(profilePath, {
    body: formData,
    // credentials: 'same-origin',
    credentials: 'include',
    method: 'PUT',
  });
}


class UserHeaderSelf extends React.Component {
  constructor(props) {
    super(props);
    this.node = null;
    this.fileInput = null;
    this.username = null;
    this.state = {
      edit: false,
    };
  }

  componentDidUpdate() {
    this.username.focus();
  }

  uploadAvatar = () => {
  }

  saveEdit = () => {
    const username = document.getElementById('username').innerText;
    const userIntro = document.getElementById('userintro').innerText;
    console.log(username, userIntro);
  }

  editIntro = () => {
    this.setState({ edit: true });
  }

  cancelEdit = () => {
    this.setState({ edit: false });
  }

  render() {
    const { edit } = this.state;
    const { username, userAvatar } = this.props;
    return (
      <div className='user' ref={(r) => { this.node = r; }}>
        <div className='intro'>
          <h2 id='username' contentEditable={edit} ref={(r) => { this.username = r; }}>
            {username}
          </h2>
          <p id='userintro' contentEditable={edit}>UserHeaderSelf</p>
        </div>
        <input
          id='userAvatar'
          type='file'
          hidden
          ref={(fileInput) => { this.fileInput = fileInput; }}
          onChange={this.uploadAvatar}
        />
        <label
          htmlFor='userAvatar'
          className='user-avatar'
          style={{ display: edit ? 'inline-block' : 'none' }}
        >
          <i className='material-icons close'>photo_camera</i>
        </label>
        <img src={userAvatar} alt='' />
        { edit ?
          <div>
            <button onClick={this.saveEdit}>Save</button>
            <button onClick={this.cancelEdit}>Cancel</button>
          </div> :
          <div>
            <button onClick={this.editIntro}>Edit</button>
          </div>
        }
      </div>
    );
  }
}

UserHeaderSelf.propTypes = {
  // email: PropTypes.string.isRequired,
  username: PropTypes.string.isRequired,
  userAvatar: PropTypes.string.isRequired,
};

export default UserHeaderSelf;
