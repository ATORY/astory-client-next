import React from 'react';
import PropTypes from 'prop-types';

import CommentCell from './CommentCell';
import CommentWriter from './CommentWriter';

const Comment = ({ articleId, comments }) => {
  const commentList = comments.map(comment =>
    <CommentCell key={comment._id} {...comment} />,
  );
  return (
    <div>
      <CommentWriter articleId={articleId} />
      {commentList}
    </div>
  );
};

Comment.propTypes = {
  articleId: PropTypes.string.isRequired,
  comments: PropTypes.array.isRequired,
};

export default Comment;
