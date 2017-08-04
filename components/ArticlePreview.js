import React from 'react';
import { graphql } from 'react-apollo';

import { articlePreviewQuery } from '../graphql/querys';

const ArticlePreview = ({data: { loading, error, article }}) => {
  return (
    <article>
      <div>{article && article.title}</div>
      <div>Loading....</div>
    </article>
  )
}

export default (graphql(articlePreviewQuery, {
  options: (props) => ({
    variables: { articleId: props.articleId },
  }),
})(ArticlePreview));