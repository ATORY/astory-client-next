import React from 'react';
import PropTypes from 'prop-types';
import { graphql } from 'react-apollo';

import { AticleUserCell } from '../ArticleCell';
import { userArticlesQuery } from '../../graphql/querys';

const Articles = ({ isSelf, user, data }) => {
  let articleElem = <div />;
  if (data.loading) return <div className='user-articles'>loading</div>;
  if (data.error) return <div className='user-articles'>{data.error.message}</div>;
  const { articles } = data.user;
  articleElem = articles.length > 0 ? articles.map((article) => {
    const articleId = article._id;
    return (
      <AticleUserCell
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

Articles.propTypes = {
  data: PropTypes.object.isRequired,
  isSelf: PropTypes.bool.isRequired,
  user: PropTypes.object.isRequired,
};

const ArticlesWithQuery = graphql(userArticlesQuery, {
  options: (props) => {
    const variables = { userId: props.user._id };
    return { variables };
  },
})(Articles);

export default ArticlesWithQuery;
