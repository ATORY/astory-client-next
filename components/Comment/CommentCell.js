import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

moment.locale('zh-cn');

const CommentCell = ({ _id, content, createDate, user }) => {
  const { email, userAvatar } = user;
  const isTmp = (typeof _id) === 'number';
  return (
    <div className={`ql-container ql-snow comment-cell ${isTmp ? 'tmp' : ''}`}>
      <div className='user-intro'>
        <img src={userAvatar} alt='' />
        <div>
          <p>{email}</p>
          <span>{moment(createDate).fromNow()}</span>
        </div>
      </div>
      <div
        className='comment-content ql-editor'
        dangerouslySetInnerHTML={{ __html: content }}
      />
    </div>
  );
};

CommentCell.propTypes = {
  _id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  content: PropTypes.string.isRequired,
  createDate: PropTypes.string.isRequired,
  user: PropTypes.shape({
    email: PropTypes.string,
  }).isRequired,
};


export default CommentCell;
