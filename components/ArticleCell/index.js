import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import Link from 'next/link';

import ArticleMark from './ArticleMark';
import { showAuthorIntro, hideAuthorInfo } from '../../utils';

import MarkCell from './MarkCell';
import UserCell from './UserCell';
// export MarkCell;
export const AticleMarkCell = MarkCell;
export const AticleUserCell = UserCell;

moment.locale('zh-cn');

class ArticleCell extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: {},
    };
  }

  render() {
    const { _id, title, shareImg, author, publishDate, mark, readNumber } = this.props;
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
  mark: PropTypes.bool.isRequired,
  readNumber: PropTypes.number.isRequired,
};

ArticleCell.defaultProps = {
  _id: 'john',
};

export default ArticleCell;
