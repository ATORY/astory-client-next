import React from 'react';
import PropTypes from 'prop-types';
import { graphql } from 'react-apollo';

import loArray from 'lodash/array';

import { userQuery } from '../graphql/querys';
import { delArticleMutation } from '../graphql/mutations';

class ArticleEdit extends React.Component {
  static propTypes = {
    userId: PropTypes.string.isRequired,
    articleId: PropTypes.string.isRequired,
    readNumber: PropTypes.number.isRequired,
    collectNumber: PropTypes.number.isRequired,
    mutate: PropTypes.func.isRequired,
  }
  delArticle = () => {
    const { articleId, mutate, userId } = this.props;
    mutate({
      variables: { articleId },
      optimisticResponse: {
        __typename: 'Mutation',
        delArticle: {
          __typename: 'Article',
          _id: articleId,
        },
      },
      update: (store, { data: { delArticle } }) => {
        const data = store.readQuery({
          query: userQuery,
          variables: { userId },
        });
        loArray.remove(data.user.articles, article => (article._id === delArticle._id));
        store.writeQuery({
          query: userQuery,
          variables: { userId },
          data,
        });
      },
    }).then(res => console.log(res)).catch(console.log);
  }
  render() {
    const { readNumber, collectNumber } = this.props;
    return (
      <div className='article-edit'>
        <span>收藏:{collectNumber}</span>
        <span>阅读:{readNumber}</span>
        <button>Edit</button>
        <button onClick={this.delArticle}>Delete</button>
      </div>
    );
  }
}

const ArticleEditWithMutation = graphql(delArticleMutation)(ArticleEdit);

export default ArticleEditWithMutation;
