import React from 'react';
import { gql, graphql } from 'react-apollo';

import Header from '../components/Header';
import withData from '../lib/withData';
import { articleQuery } from '../graphql/querys';
import ArticlePreview from '../components/ArticlePreview';

class Article extends React.Component {
  render() {
    const { url, data } = this.props;
    const { loading, error, article } = data;
    return (
      <div>
        <Header pathname={url.pathname} title={article && article.title}/>
        {
          loading ? <ArticlePreview articleId={url.query.articleId} /> :
          error ? <div>{error.message}</div> :
          <article>
            <div>{article.title}</div>
            <div>{article.content}</div>
          </article>
        }
      </div>
    )
  }
}

export default withData(graphql(articleQuery, {
  options: (props) => ({
    variables: { articleId: props.url.query.articleId },
  }),
})(Article));