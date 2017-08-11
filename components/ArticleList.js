import React from 'react';
import { graphql } from 'react-apollo';
import PropTypes from 'prop-types';

import ArticleCell from './ArticleCell';
import { articlesQuery } from '../graphql/querys';

const ArticleList = ({ data: { loading, error, articles } }) => {
  if (loading) {
    return <div>Loading...</div>;
  }
  if (error) {
    return <div>{error.message}</div>;
  }
  return (
    <div className='maxWidth articles' id='articles'>
      {articles.map(article => <ArticleCell key={article._id} {...article} />)}
    </div>
  );
};


ArticleList.propTypes = {
  data: PropTypes.shape({
    loading: PropTypes.bool,
    error: PropTypes.object,
    article: PropTypes.any,
  }).isRequired,
};

const ArticleListWithData = (graphql(articlesQuery)(ArticleList));
export default ArticleListWithData;
