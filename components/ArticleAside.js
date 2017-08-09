import React from 'react';
import PropTypes from 'prop-types';
import { graphql, compose, withApollo } from 'react-apollo';

import { showLoginMask } from '../utils';
import { articleQuery, authQuery } from '../graphql/querys';
import { markMutation, collectMutation } from '../graphql/mutations';

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

  constructor(props) {
    super(props);
    this.node = null;
    this.state = {
      opacity: 0,
      position: 'fixed',
      top: '190px', // article margin-top 20 header 70 aside 100
      // self height 100
    };
  }

  componentDidMount() {
    window.addEventListener('scroll', this.handleScroll);
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleScroll);
  }

  handleScroll = () => {
    const articleElem = document.getElementById('article');
    const articleHeight = articleElem.clientHeight;
    const articleElemRect = articleElem.getBoundingClientRect();
    // console.log(articleElemRect);
    const articleBottom = articleElemRect.bottom;
    const articleTop = articleElemRect.top;
    // console.log(window.pageYOffset, articleBottom);
    if (articleTop < 0) {
      this.setState({
        opacity: 1,
        position: 'fixed',
        top: '',
      });
    } else {
      this.setState({
        opacity: 0,
        position: 'fixed',
        top: '',
      });
    }
    console.log(articleBottom);
    if (articleBottom < 340) {
      this.setState({
        position: 'absolute',
        top: `${articleHeight - 250}px`,
      });
    } else {
      this.setState({
        position: 'fixed',
        top: '',
      });
    }
    // console.log('scroll', evt, articleElemRect, window.pageYOffset);
  }

  markOpt = () => {
    this.props.client.query({
      query: authQuery,
    }).then(({ data: { user } }) => {
      if (!user || !user._id) {
        return showLoginMask();
      }
      // const { data: { article } } = this.props;
      const articleId = this.props._id;
      if (!articleId) throw new Error('articleId null');
      const { mark, markMutate } = this.props;
      return markMutate({
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

  render() {
    const { position, top, opacity } = this.state;
    const { collectNumber, collect, mark } = this.props;
    const collectStatus = collect ? 'favorite_' : 'favorite_border';
    const markStatus = mark ? 'bookmark' : 'bookmark_border';
    return (
      <div className='article-attach-aside'>
        <div style={{ position, top, opacity }} ref={(node) => { this.node = node; }}>
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
    );
  }
}

const ArticleAsideWithOption = compose(
  withApollo,
  graphql(markMutation, { name: 'markMutate' }),
  graphql(collectMutation, { name: 'collectMutate' }),
)(ArticleAside);

// export default withData(ArticleWithOption);

export default ArticleAsideWithOption;
