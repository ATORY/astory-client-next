import React from 'react';
import {
  gql,
  graphql,
} from 'react-apollo';


const ArticlePreview = ({data: { loading, error, article }}) => {
  return (
    <article>
      <div>{article && article.title}</div>
      <div>Loading....</div>
    </article>
  )
}

export const articleQuery = gql`
  query articleQuery($articleId : ID!) {
    article(_id: $articleId) {
      _id
      title
    }
  }
`;
export default (graphql(articleQuery, {
  options: (props) => ({
    variables: { articleId: props.articleId },
  }),
})(ArticlePreview));