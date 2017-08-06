import React from 'react';
import { graphql } from 'react-apollo';

import { articlePreviewQuery } from '../graphql/querys';
import AuthorPreview from './AuthorPreview';

const ArticlePreview = ({data: { loading, error, article }}) => {
  return (
    <article>
      <AuthorPreview _id={article.author._id}
                     email={article.author.email}
                     userAvatar={article.author.userAvatar}
                     publishDate={article.publishDate} />
      <div>
        <h1>{article && article.title}</h1>
      </div>
      <div>Loading....</div>
    </article>
  )
}

export default (graphql(articlePreviewQuery, {
  options: (props) => ({
    variables: { articleId: props.articleId },
  }),
})(ArticlePreview));