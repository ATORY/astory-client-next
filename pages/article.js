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
          <article className='ql-container ql-snow'>
            <div className='ql-editor'>
            <div>author</div>
            {/* <div>{article.title}</div> */}
            <div dangerouslySetInnerHTML={{ __html: article.content}} />
            </div>
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