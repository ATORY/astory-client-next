import React from 'react';
import moment from 'moment';
import Link from 'next/link';

import ArticleMark from '../components/ArticleMark';
const ArticleCell = ({ _id, title, author, publishDate}) => {
  return (
    <div className='article-cell'>
      <div>
        <Link as={`/article/${_id}`} href={`/article?articleId=${_id}`}>
          <div className='img-container' style={{
              backgroundImage: 'url(https://imgs.atory.cc/58ef759fcba90a17dc10cf0b/6c0e65f1e1fb13613efe8945fef75f44.jpeg)'
            }}>
          </div>
        </Link>
        <Link as={`/article/${_id}`} href={`/article?articleId=${_id}`}>
          <div className='article-intro'>
            <h3>{title}</h3>
            <p>content</p>
          </div>
        </Link>
        <div className='author-intro'>
          <img src="/static/svg/account_circle.svg" alt=""/>
          <div>
            <p>{author.email}</p>
            <p className='pub-time'>{publishDate && moment(publishDate).fromNow()}</p>
          </div>
          <ArticleMark />
        </div>
      </div>
      
    </div>
  )
}

export default ArticleCell;