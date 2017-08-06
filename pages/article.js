import React from 'react';
import moment from 'moment';
import { gql, graphql } from 'react-apollo';

import Header from '../components/Header';
import withData from '../lib/withData';
import { articleQuery } from '../graphql/querys';
import ArticlePreview from '../components/ArticlePreview';
import AuthorPreview from '../components/AuthorPreview';

class Article extends React.Component {
  render() {
    const { url, data } = this.props;
    const { loading, error, article } = data;
    return (
      <div>
        <div className='header-shadow' />
        <Header pathname={url.pathname} title={article && article.title}/>
        {
          loading ? <ArticlePreview articleId={url.query.articleId} /> :
          error ? <div>{error.message}</div> :
          <article className='ql-container ql-snow'>
            <div className='ql-editor'>
            <AuthorPreview _id={article.author._id} 
                           email={article.author.email} 
                           userAvatar={article.author.userAvatar}
                           publishDate={article.publishDate}/>
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