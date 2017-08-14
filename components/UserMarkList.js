import React from 'react';
import { graphql } from 'react-apollo';
import PropTypes from 'prop-types';

import ArticleCellMark from './ArticleCellMark';
import { userMarksQuery } from '../graphql/querys';

const UserMarkList = ({ user, data }) => {
  let articleElem = <div />;
  if (data.loading) return <div className='user-articles'>loading</div>;
  if (data.error) return <div className='user-articles'>{data.error.message}</div>;
  const { marks } = data.user;
  articleElem = (marks && marks.length > 0) ? marks.map(({ article }) => {
    const articleId = article._id;
    return (
      <ArticleCellMark
        key={articleId}
        {...article}
        author={user}
      />
    );
  }) : <div>暂无mark</div>;
  return (
    <div className='user-articles user-mark'>
      {articleElem}
    </div>
  );
};

UserMarkList.propTypes = {
  data: PropTypes.object.isRequired,
  // isSelf: PropTypes.bool.isRequired,
  user: PropTypes.object.isRequired,
};

const UserMarkListWithQuery = graphql(userMarksQuery, {
  options: (props) => {
    const variables = { userId: props.user._id };
    return { variables };
  },
})(UserMarkList);

export default UserMarkListWithQuery;
