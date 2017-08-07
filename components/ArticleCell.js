import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import Link from 'next/link';

import ArticleMark from '../components/ArticleMark';
import { showAuthorIntro, hideAuthorInfo } from '../utils';

class ArticleCell extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: {},
    };
  }

  render() {
    const { _id, title, shareImg, author, publishDate } = this.props;
    const url = `url(${shareImg})`;
    return (
      <div className='article-cell'>
        <div>
          <Link as={`/article/${_id}`} href={`/article?articleId=${_id}`}>
            <div
              className='img-container'
              style={{
                backgroundImage: url,
              }}
            />
          </Link>
          <Link as={`/article/${_id}`} href={`/article?articleId=${_id}`}>
            <div className='article-intro'>
              <h3>{title}</h3>
              <p>Chrome DevTools 的堆分析器可以按页面的 JavaScript 对象和相关 DOM
                节点显示内存分配（另请参阅对象保留树）。使用分析器可以拍摄 JS 堆快照、
                分析内存图、比较快照以及查找内存泄漏。</p>
            </div>
          </Link>
          <div className='author-intro'>
            <img src={author.userAvatar} alt='' />
            <div>
              <p
                className='author-name'
                onMouseMove={evt => showAuthorIntro(evt, author._id)}
                onMouseLeave={hideAuthorInfo}
              >
                {author.email}
              </p>
              <p className='pub-time'>{publishDate && moment(publishDate).fromNow()}</p>
            </div>
            <ArticleMark />
          </div>
        </div>
      </div>
    );
  }
}

ArticleCell.propTypes = {
  _id: PropTypes.string,
  title: PropTypes.string.isRequired,
  shareImg: PropTypes.string.isRequired,
  author: PropTypes.shape({
    _id: PropTypes.string,
    email: PropTypes.string,
  }).isRequired,
  publishDate: PropTypes.string.isRequired,
};

ArticleCell.defaultProps = {
  _id: 'john',
};

export default ArticleCell;
