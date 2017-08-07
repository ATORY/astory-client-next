import React from 'react';
import moment from 'moment';

const AuthorPreview = ({ _id, email, userAvatar, publishDate }) => {
  return (
    <div className='author-intro'>
      <img src={userAvatar} /> 
      <div>
        <div className='user-name'>
          <label>{email}</label>
          <span>关注</span>
        </div>
        <div className='user-intro'>
          作者介绍
        </div>
        <p className='pub-time'>
          {moment(publishDate).fromNow()}
        </p> 
      </div>
    </div>
  )
}

export default AuthorPreview;