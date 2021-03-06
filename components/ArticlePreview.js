import React from 'react';
import { graphql } from 'react-apollo';
import PropTypes from 'prop-types';

import { articlePreviewQuery } from '../graphql/querys';
import AuthorPreview from './AuthorPreview';

const ArticlePreview = ({ data: { loading, error, article } }) => {
  if (loading) {
    return (
      <article className='ql-container ql-snow'>
        <div className='ql-editor'>
          loading
        </div>
      </article>
    );
  }
  if (error) {
    return (
      <article className='ql-container ql-snow'>
        <div className='ql-editor'>
          {error.message}
        </div>
      </article>
    );
  }
  const { _id, readNumber, publishDate, author } = article;
  return (
    <article className='ql-container ql-snow'>
      <div className='ql-editor'>
        <AuthorPreview articleId={_id} {...{ publishDate, readNumber }} {...author} />
        <div>
          <h1>{article && article.title}</h1>
        </div>
        <div>Loading....</div>
      </div>
    </article>
  );
};

ArticlePreview.propTypes = {
  data: PropTypes.shape({
    loading: PropTypes.bool,
    error: PropTypes.object,
    article: PropTypes.object,
  }).isRequired,
};

const ArticlePreviewWithData = graphql(articlePreviewQuery, {
  options: (props) => {
    const variables = { articleId: props.articleId };
    return {
      variables,
    };
  },
})(ArticlePreview);

export default ArticlePreviewWithData;
