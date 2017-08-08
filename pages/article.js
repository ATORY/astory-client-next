import React from 'react';
import PropTypes from 'prop-types';
import { graphql, compose, withApollo } from 'react-apollo';

import Header from '../components/Header';
import withData from '../lib/withData';
import { articleQuery, authQuery } from '../graphql/querys';
import { markMutation, collectMutation } from '../graphql/mutations';
import ArticlePreview from '../components/ArticlePreview';
import AuthorPreview from '../components/AuthorPreview';
import Comment from '../components/Comment';
import { showLoginMask } from '../utils';

class Article extends React.Component {
  markOpt = () => {
    this.props.client.query({
      query: authQuery,
    }).then(({ data: { user } }) => {
      if (!user || !user._id) {
        return showLoginMask();
      }
      const { data: { article } } = this.props;
      const articleId = article && article._id;
      if (!articleId) throw new Error('articleId null');
      const { mark } = article;
      return this.props.markMutate({
        variables: { articleId, mark: !mark },
        optimisticResponse: {
          __typename: 'Mutation',
          markArticle: {
            __typename: 'Mark',
            mark: !mark,
          },
        },
        update: (store, { data: { markArticle } }) => {
          const data = store.readQuery({
            query: articleQuery,
            variables: { articleId },
          });
          data.article.mark = markArticle.mark;
          store.writeQuery({
            query: articleQuery,
            variables: { articleId },
            data,
          });
        },
      });
    }).catch(err => console.log(err));
  }
  collectOpt = () => {
    this.props.client.query({
      query: authQuery,
    }).then(({ data: { user } }) => {
      if (!user || !user._id) {
        return showLoginMask();
      }
      const { data: { article } } = this.props;
      const articleId = article && article._id;
      if (!articleId) throw new Error('articleId null');
      const { collect, collectNumber } = article;
      return this.props.collectMutate({
        variables: { articleId, collect: !collect },
        optimisticResponse: {
          __typename: 'Mutation',
          collectArticle: {
            __typename: 'Collect',
            article: {
              __typename: 'Article',
              collectNumber: collect === false ? collectNumber + 1 : collectNumber - 1,
              collect: !collect,
            },
          },
        },
        update: (store, { data: { collectArticle } }) => {
          const data = store.readQuery({
            query: articleQuery,
            variables: { articleId },
          });
          data.article.collect = collectArticle.article.collect;
          data.article.collectNumber = collectArticle.article.collectNumber;
          store.writeQuery({
            query: articleQuery,
            variables: { articleId },
            data,
          });
        },
      });
    }).catch(err => console.log(err));
  }
  render() {
    const { url, data } = this.props;
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
      const collectStatus = collect ? 'favorite_' : 'favorite_border';
      const markStatus = mark ? 'bookmark' : 'bookmark_border';
      elem = (
        <article className='ql-container ql-snow'>
          <div className='ql-editor'>
            <AuthorPreview
              _id={author._id}
              email={author.email}
              userAvatar={author.userAvatar}
              {...{ publishDate, readNumber }}
            />
            <div dangerouslySetInnerHTML={{ __html: content }} />
            <div className='article-attach-bottom'>fhufu</div>
          </div>
          <div className='article-attach-aside'>
            <div>
              <i
                className='material-icons'
                onClick={this.collectOpt}
                role='presentation'
              >{collectStatus}</i>
              <span>{collectNumber}</span>
              <i
                className='material-icons'
                onClick={this.markOpt}
                role='presentation'
              >{markStatus}</i>
            </div>
          </div>
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
  }
}

Article.propTypes = {
  url: PropTypes.shape({
    pathname: PropTypes.string,
  }).isRequired,
  data: PropTypes.shape({
    loading: PropTypes.bool,
    error: PropTypes.object,
    article: PropTypes.object,
  }).isRequired,
  collectMutate: PropTypes.func.isRequired,
  markMutate: PropTypes.func.isRequired,
  client: PropTypes.object.isRequired,
};

const ArticleWithOption = compose(
  withApollo,
  graphql(articleQuery, {
    options: (props) => {
      const variables = { articleId: props.url.query.articleId };
      return { variables };
    },
  }),
  graphql(markMutation, { name: 'markMutate' }),
  graphql(collectMutation, { name: 'collectMutate' }),
)(Article);

export default withData(ArticleWithOption);

// export default withData(graphql(articleQuery, {
//   options: (props) => {
//     const variables = { articleId: props.url.query.articleId };
//     return { variables };
//   },
// })(Article));
