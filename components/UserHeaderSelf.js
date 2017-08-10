import React from 'react';
import PropTypes from 'prop-types';

class UserHeaderSelf extends React.Component {
  constructor(props) {
    super(props);
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

  editIntro = () => {
    this.setState({ edit: true });
  }

  cancelEdit = () => {
    this.setState({ edit: false });
  }

  render() {
    const { edit } = this.state;
    const { email, username, userAvatar } = this.props;
    return (
      <div className='user'>
        <div className='intro'>
          <h2 id='username' contentEditable={edit} ref={(r) => { this.username = r; }}>
            {email}-{username}
          </h2>
          <p id='userintro'>UserHeaderSelf</p>
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
            <button onClick={this.editIntro}>Edit</button>
            <button>Save</button>
          </div> :
          <div>
            <button onClick={this.cancelEdit}>Cancel</button>
          </div>
        }
      </div>
    );
  }
}

UserHeaderSelf.propTypes = {
  email: PropTypes.string.isRequired,
  username: PropTypes.string.isRequired,
  userAvatar: PropTypes.string.isRequired,
};

export default UserHeaderSelf;
