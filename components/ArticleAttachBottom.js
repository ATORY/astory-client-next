import React from 'react';
import { graphql, compose, withApollo } from 'react-apollo';

import { markMutation, collectMutation } from '../graphql/mutations';

import ArticleAttach from './ArticleAttach';

class ArticleAttachBottom extends ArticleAttach {
  render() {
    const { collectNumber, collect, mark } = this.props;
    const collectStatus = collect ? 'favorite_' : 'favorite_border';
    const markStatus = mark ? 'bookmark' : 'bookmark_border';
    return (
      <div className='article-attach-bottom'>
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
    );
  }
}

const ArticleAttachBottomWithOption = compose(
  withApollo,
  graphql(markMutation, { name: 'markMutate' }),
  graphql(collectMutation, { name: 'collectMutate' }),
)(ArticleAttachBottom);


export default ArticleAttachBottomWithOption;
