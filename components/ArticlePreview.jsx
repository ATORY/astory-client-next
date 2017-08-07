import React from 'react';
import { graphql } from 'react-apollo';
import PropTypes from 'prop-types';

import { articlePreviewQuery } from '../graphql/querys';
import AuthorPreview from './AuthorPreview';

const ArticlePreview = ({ data: { article } }) => {
  const { author, publishDate } = article;
  return (
    <article>
      <AuthorPreview
        _id={author._id}
        email={author.email}
        userAvatar={author.userAvatar}
        publishDate={publishDate}
      />
      <div>
        <h1>{article && article.title}</h1>
      </div>
      <div>Loading....</div>
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
