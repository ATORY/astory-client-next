import React from 'react';
import PropTypes from 'prop-types';
import { graphql } from 'react-apollo';

import Header from '../components/Header';
import withData from '../lib/withData';
import { articleQuery } from '../graphql/querys';
import ArticlePreview from '../components/ArticlePreview';
import AuthorPreview from '../components/AuthorPreview';
import ArticleAttachAside from '../components/ArticleAttachAside';
import ArticleAttachBottom from '../components/ArticleAttachBottom';
import Comment from '../components/Comment';
// import { showLoginMask } from '../utils';


// class Article extends React.Component {
const Article = ({ url, data }) => {
  let elem = <div />;
  let commentElem = <div />;
  const { loading, error, article } = data;
  if (loading) {
    elem = <ArticlePreview articleId={url.query.articleId} />;
  } else if (error) {
    elem = <div>{error.message}</div>;
  } else {
    const { _id, content, collectNumber, readNumber, publishDate, author,
      mark, collect, comments,
    } = article;
    elem = (
      <article className='ql-container ql-snow' id='article'>
        <div className='ql-editor'>
          <AuthorPreview
            _id={author._id}
            email={author.email}
            userAvatar={author.userAvatar}
            {...{ publishDate, readNumber }}
          />
          <div dangerouslySetInnerHTML={{ __html: content }} />
        </div>
        <ArticleAttachBottom {...{ _id, mark, collect, collectNumber }} />
        <ArticleAttachAside {...{ _id, mark, collect, collectNumber }} />
      </article>
    );
    commentElem = (
      <div className='comment'>
        <Comment articleId={_id} comments={comments} />
      </div>
    );
  }
  return (
    <div>
      <div className='header-shadow' />
      <Header pathname={url.pathname} title={article && article.title} />
      {elem}
      {commentElem}
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

const ArticleWithQuery = graphql(articleQuery, {
  options: (props) => {
    const variables = { articleId: props.url.query.articleId };
    return { variables };
  },
})(Article);

export default withData(ArticleWithQuery);
