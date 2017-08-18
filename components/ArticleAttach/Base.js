import React from 'react';
import PropTypes from 'prop-types';

import { showLoginMask, showShareMask } from '../../utils';
import { articleQuery, authQuery } from '../../graphql/querys';

class ArticleAside extends React.Component {
  static propTypes = {
    collectMutate: PropTypes.func.isRequired,
    markMutate: PropTypes.func.isRequired,
    client: PropTypes.object.isRequired,
    _id: PropTypes.string.isRequired,
    collectNumber: PropTypes.number.isRequired,
    mark: PropTypes.bool.isRequired,
    collect: PropTypes.bool.isRequired,
  }

  markOpt = () => {
    this.props.client.query({
      query: authQuery,
    }).then(({ data: { user } }) => {
      if (!user || !user._id) {
        showLoginMask();
        return;
      }
      // const { data: { article } } = this.props;
      const articleId = this.props._id;
      if (!articleId) throw new Error('articleId null');
      const { mark, markMutate } = this.props;
      markMutate({
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
      }).catch(err => console.log(err));
    }).catch(err => console.log(err));
  }
  collectOpt = () => {
    this.props.client.query({
      query: authQuery,
    }).then(({ data: { user } }) => {
      if (!user || !user._id) {
        return showLoginMask();
      }
      // const { data: { article } } = this.props;
      const articleId = this.props._id;
      if (!articleId) throw new Error('articleId null');
      const { collect, collectNumber, collectMutate } = this.props;
      return collectMutate({
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

  share = () => {
    showShareMask();
  }
}

export default ArticleAside;
