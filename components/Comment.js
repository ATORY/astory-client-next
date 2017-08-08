import React from 'react';
import PropTypes from 'prop-types';
import dynamic from 'next/dynamic';

import CommentCell from './CommentCell';

const DynamicComponentWithNoSSR = dynamic(
  import('./CommentWriter'),
  {
    ssr: false,
    loading: () => <div>初始化编辑器。。。</div>,
  },
);

const Comment = ({ articleId, comments }) => {
  const commentList = comments.map(comment =>
    <CommentCell key={comment._id} {...comment} />,
  );
  return (
    <div>
      <DynamicComponentWithNoSSR articleId={articleId} />
      {commentList}
    </div>
  );
};

Comment.propTypes = {
  articleId: PropTypes.string.isRequired,
  comments: PropTypes.array.isRequired,
};

export default Comment;
