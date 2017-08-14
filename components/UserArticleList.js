import React from 'react';
import PropTypes from 'prop-types';
import { graphql } from 'react-apollo';

import ArticleCellUser from './ArticleCellUser';
import { userArticlesQuery } from '../graphql/querys';

const UserArticleList = ({ isSelf, user, data }) => {
  let articleElem = <div />;
  if (data.loading) return <div>loading</div>;
  if (data.error) return <div>{data.error.message}</div>;
  const { articles } = data.user;
  articleElem = articles.length > 0 ? articles.map((article) => {
    const articleId = article._id;
    return (
      <ArticleCellUser
        key={articleId}
        isSelf={isSelf}
        {...article}
        user={user}
      />
    );
  }) : <div>暂无草稿或无权访问</div>;
  return (
    <div className='user-articles'>
      {articleElem}
    </div>
  );
};

UserArticleList.propTypes = {
  data: PropTypes.object.isRequired,
  isSelf: PropTypes.bool.isRequired,
  user: PropTypes.object.isRequired,
};

const UserArticleListWithQuery = graphql(userArticlesQuery, {
  options: (props) => {
    const variables = { userId: props.user._id };
    return { variables };
  },
})(UserArticleList);

export default UserArticleListWithQuery;
