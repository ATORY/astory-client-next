import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import Link from 'next/link';

import ArticleMark from './ArticleMark';
import { showAuthorIntro, hideAuthorInfo } from '../../utils';

moment.locale('zh-cn');

const ArticleCellMark = ({ _id, title, shareImg, author, publishDate, mark, readNumber }) => {
  const url = `url(${shareImg})`;
  return (
    <div className='article-cell'>
      <div>
        <Link as={`/article/${_id}`} href={`/article?articleId=${_id}`}>
          <a>
            <div className='img-container' style={{ backgroundImage: url }} />
          </a>
        </Link>
        <Link as={`/article/${_id}`} href={`/article?articleId=${_id}`}>
          <a>
            <div className='article-intro'>
              <h3>{title}</h3>
            </div>
          </a>
        </Link>
        <div className='author-intro'>
          <img src={author.userAvatar} alt='' />
          <div>
            <Link as={`/@/${author._id}`} href={`/user?userId=${author._id}`}>
              <a>
                <p
                  className='author-name'
                  onMouseMove={evt => showAuthorIntro(evt, author._id)}
                  onMouseLeave={hideAuthorInfo}
                >{author.email}</p>
              </a>
            </Link>
            <p className='pub-time'>
              <span>{publishDate && moment(publishDate).fromNow()}</span>
              <span>{`阅读:${readNumber}`}</span>
            </p>
          </div>
          <ArticleMark articleId={_id} mark={mark} />
        </div>
      </div>
    </div>
  );
};


ArticleCellMark.propTypes = {
  _id: PropTypes.string,
  title: PropTypes.string.isRequired,
  shareImg: PropTypes.string.isRequired,
  author: PropTypes.shape({
    _id: PropTypes.string,
    email: PropTypes.string,
  }).isRequired,
  publishDate: PropTypes.string.isRequired,
  mark: PropTypes.bool.isRequired,
  readNumber: PropTypes.number.isRequired,
};

ArticleCellMark.defaultProps = {
  _id: 'john',
};

export default ArticleCellMark;
