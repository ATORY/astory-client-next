import React from 'react';
import moment from 'moment';
import Link from 'next/link';

import ArticleMark from '../components/ArticleMark';
// {_id, title, shareImg, publishDate, author}
const ArticleCell = ({ _id, title, shareImg, author, publishDate}) => {
  const url = `url(${shareImg})`;
  return (
    <div className='article-cell'>
      <div>
        <Link as={`/article/${_id}`} href={`/article?articleId=${_id}`}>
          <div className='img-container' style={{
              backgroundImage: url
            }}>
          </div>
        </Link>
        <Link as={`/article/${_id}`} href={`/article?articleId=${_id}`}>
          <div className='article-intro'>
            <h3>{title}</h3>
            <p>Chrome DevTools 的堆分析器可以按页面的 JavaScript 对象和相关 DOM 节点显示内存分配（另请参阅对象保留树）。使用分析器可以拍摄 JS 堆快照、分析内存图、比较快照以及查找内存泄漏。</p>
          </div>
        </Link>
        <div className='author-intro'>
          <img src={author.userAvatar} />
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