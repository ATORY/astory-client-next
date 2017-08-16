import React from 'react';
import PropTypes from 'prop-types';
import { graphql } from 'react-apollo';

import { editUserMutaion } from '../../graphql/mutations';
import { userQuery } from '../../graphql/querys';
import profileAPI from '../../utils/profileUpload';

class UserHeaderSelf extends React.Component {
  static propTypes = {
    // email: PropTypes.string.isRequired,
    _id: PropTypes.string.isRequired,
    userIntro: PropTypes.string,
    username: PropTypes.string.isRequired,
    userAvatar: PropTypes.string.isRequired,
    mutate: PropTypes.func.isRequired,
    followedNum: PropTypes.number.isRequired,
  };

  static defaultProps = {
    userIntro: '',
  }

  constructor(props) {
    super(props);
    this.node = null;
    this.fileInput = null;
    this.username = null;
    this.state = {
      edit: false,
      newUserAvatar: '',
    };
  }

  componentDidUpdate() {
    this.username.focus();
  }

  uploadAvatar = (evt) => {
    const files = evt.target.files;
    // console.log(files);
    // const filesLen = files.length;
    const fileItem = files[0];
    const formData = new FormData();
    formData.append('file', fileItem);
    profileAPI(formData).then((res) => {
      if (res.status >= 400) throw new Error(`${res.status}`);
      return res.json();
    }).then((fileObj) => {
      const fileUrl = fileObj.fileURL;
      // this.insertImage(fileUrl);
      this.setState({
        newUserAvatar: fileUrl,
      });
      this.fileInput.value = '';
    }).catch((err) => {
      console.log(err);
    });
  }

  saveEdit = () => {
    const username = document.getElementById('username').innerText;
    const userIntro = document.getElementById('userintro').innerText;
    const userAvatar = document.getElementById('userImage').src;
    const { _id, mutate } = this.props;
    mutate({
      variables: { username, userIntro, userAvatar },
      optimisticResponse: {
        __typename: 'Mutation',
        editUser: {
          __typename: 'User',
          _id: Math.ceil(Math.random() * 1000000),
          username,
          userIntro,
          userAvatar,
        },
      },
      update: (store, { data: { editUser } }) => {
        const data = store.readQuery({
          query: userQuery,
          variables: { userId: _id },
        });
        data.user.username = editUser.username;
        data.user.userIntro = editUser.userIntro;
        data.user.userAvatar = editUser.userAvatar;
        store.writeQuery({
          query: userQuery,
          variables: { userId: _id },
          data,
        });
        this.cancelEdit();
      },
    }).catch(err => console.log(err));
  }

  editIntro = () => {
    this.setState({ edit: true });
  }

  cancelEdit = () => {
    this.setState({ edit: false });
  }

  render() {
    const { edit, newUserAvatar } = this.state;
    const { username, userAvatar, userIntro, followedNum } = this.props;
    return (
      <div className='user' ref={(r) => { this.node = r; }}>
        <div className='intro'>
          <h2
            id='username'
            suppressContentEditableWarning
            contentEditable={edit}
            ref={(r) => { this.username = r; }}
          >{username}</h2>
          <p
            id='userintro'
            contentEditable={edit}
            suppressContentEditableWarning
          >{userIntro}</p>
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
        <img id='userImage' src={newUserAvatar || userAvatar} alt='' />
        { edit ?
          <div className='intro-other'>
            <button onClick={this.saveEdit}>Save</button>
            <button onClick={this.cancelEdit}>Cancel</button>
            <span>关注：{followedNum}</span>
          </div> :
          <div className='intro-other'>
            <button onClick={this.editIntro}>Edit</button>
            <span>关注：{followedNum}</span>
          </div>
        }
      </div>
    );
  }
}

const UserHeaderSelfWithMutation = graphql(editUserMutaion)(UserHeaderSelf);

export default UserHeaderSelfWithMutation;
