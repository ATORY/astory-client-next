import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import Link from 'next/link';

import ArticleEdit from '../components/ArticleEdit';
import ArticleMark from '../components/ArticleMark';

moment.locale('zh-cn');

const ArticleCellUser = (
  { isSelf, _id, shareImg, publishDate, title, readNumber, collectNumber, mark, user },
) => {
  const optElem = isSelf ?
    <ArticleEdit articleId={_id} userId={user._id} {...{ readNumber, collectNumber }} /> :
    <ArticleMark articleId={_id} mark={mark} />;
  const author = user;
  return (
    <div className='user-article-cell'>
      <div className='author-intro'>
        <img src={author.userAvatar} alt='' />
        <div>
          <Link as={`/@/${author._id}`} href={`/user?userId=${author._id}`}>
            <a>
              <p className='author-name'>
                {author.email}
              </p>
            </a>
          </Link>
          <p className='pub-time'>
            <span>{publishDate && moment(publishDate).fromNow()}</span>
          </p>
        </div>
      </div>
      <Link as={`/article/${_id}`} href={`/article?articleId=${_id}`}>
        <a>
          <div className='cell-image' style={{ backgroundImage: `url(${shareImg})` }} />
        </a>
      </Link>
      <div className='cell-intro'>
        <Link as={`/article/${_id}`} href={`/article?articleId=${_id}`}>
          <a><h3>{title}</h3></a>
        </Link>
      </div>
      <div className='cell-opt'>
        {optElem}
      </div>
    </div>
  );
};

ArticleCellUser.propTypes = {
  isSelf: PropTypes.bool.isRequired,
  _id: PropTypes.string.isRequired,
  shareImg: PropTypes.string.isRequired,
  publishDate: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  readNumber: PropTypes.number.isRequired,
  collectNumber: PropTypes.number.isRequired,
  mark: PropTypes.bool.isRequired,
  user: PropTypes.shape({
    _id: PropTypes.string,
    userAvatar: PropTypes.string,
    email: PropTypes.string,
  }).isRequired,
};

export default ArticleCellUser;
