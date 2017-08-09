import React from 'react';
import { graphql } from 'react-apollo';
import PropTypes from 'prop-types';

import ArticleCell from './ArticleCell';
import { articlesQuery } from '../graphql/querys';

const ArticleList = ({ data: { loading, error, articles } }) => {
  let elem = <div />;
  if (loading) {
    elem = <div>Loading...</div>;
  } else if (error) {
    elem = <div>{error.message}</div>;
  } else {
    elem = articles.map(article => <ArticleCell key={article._id} {...article} />);
  }
  return (
    <div className='maxWidth articles' id='articles'>
      {elem}
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
