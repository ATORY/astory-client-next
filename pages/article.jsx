import React from 'react';
import PropTypes from 'prop-types';
import { graphql } from 'react-apollo';

import Header from '../components/Header';
import withData from '../lib/withData';
import { articleQuery } from '../graphql/querys';
import ArticlePreview from '../components/ArticlePreview';
import AuthorPreview from '../components/AuthorPreview';

const Article = ({ url, data }) => {
  let elem = <div />;
  const { loading, error, article } = data;
  if (loading) {
    elem = <ArticlePreview articleId={url.query.articleId} />;
  } else if (error) {
    elem = <div>{error.message}</div>;
  } else {
    elem = (
      <article className='ql-container ql-snow'>
        <div className='ql-editor'>
          <AuthorPreview
            _id={article.author._id}
            email={article.author.email}
            userAvatar={article.author.userAvatar}
            publishDate={article.publishDate}
          />
          <div dangerouslySetInnerHTML={{ __html: article.content }} />
        </div>
      </article>
    );
  }
  return (
    <div>
      <div className='header-shadow' />
      <Header pathname={url.pathname} title={article && article.title} />
      {elem}
    </div>
  );
};

Article.propTypes = {
  url: PropTypes.shape({
    pathname: PropTypes.string,
  }).isRequired,
  data: PropTypes.shape({
    loading: PropTypes.bool,
    error: PropTypes.object,
    article: PropTypes.object,
  }).isRequired,
};

export default withData(graphql(articleQuery, {
  options: (props) => {
    const variables = { articleId: props.url.query.articleId };
    return { variables };
  },
})(Article));
