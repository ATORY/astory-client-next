import React from 'react';
import { graphql, compose, withApollo } from 'react-apollo';

import { markMutation, collectMutation } from '../graphql/mutations';

import ArticleAttach from './ArticleAttach';

class ArticleAside extends ArticleAttach {
  constructor(props) {
    super(props);
    this.node = null;
    this.state = {
      opacity: 0,
      position: 'fixed',
      top: '190px', // article margin-top 20 header 70 aside 100 self height 100
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

export default ArticleAsideWithOption;
