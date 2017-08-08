import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

moment.locale('zh-cn');

const CommentCell = ({ content, createDate, user }) => {
  const { email, userAvatar } = user;
  return (
    <div className='comment-cell'>
      <div className='user-intro'>
        <img src={userAvatar} alt='' />
        <div>
          <p>{email}</p>
          <span>{moment(createDate).fromNow()}</span>
        </div>
      </div>
      <div className='comment-content' dangerouslySetInnerHTML={{ __html: content }} />
    </div>
  );
};

CommentCell.propTypes = {
  content: PropTypes.string.isRequired,
  createDate: PropTypes.string.isRequired,
  user: PropTypes.shape({
    email: PropTypes.string,
  }).isRequired,
};


export default CommentCell;
