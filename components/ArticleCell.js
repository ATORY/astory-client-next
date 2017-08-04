import React from 'react';
import Link from 'next/link';

const ArticleCell = ({ _id, title}) => {
  return (
    <div className='article-cell'>
      <div>
        <Link as={`/article/${_id}`} href={`/article?articleId=${_id}`}>
          <a><h3>{title}</h3></a>
        </Link>
        <p>content</p>
      </div>
    </div>
  )
}

export default ArticleCell;