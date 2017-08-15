import React from 'react';
import { graphql } from 'react-apollo';
import PropTypes from 'prop-types';

import { AticleMarkCell } from '../ArticleCell';
import { userCollectsQuery } from '../../graphql/querys';

const Collects = ({ user, data }) => {
  let articleElem = <div />;
  if (data.loading) return <div className='user-articles'>loading</div>;
  if (data.error) return <div className='user-articles'>{data.error.message}</div>;
  const { collects } = data.user;
  articleElem = (collects && collects.length > 0) ? collects.map(({ article }) => {
    if (!article) return null;
    const articleId = article._id;
    return (
      <AticleMarkCell
        key={articleId}
        {...article}
        author={user}
      />
    );
  }) : <div>暂无收藏</div>;
  return (
    <div className='user-articles user-mark'>
      {articleElem}
    </div>
  );
};

Collects.propTypes = {
  data: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
};

const CollectsWithQuery = graphql(userCollectsQuery, {
  options: (props) => {
    const variables = { userId: props.user._id };
    return { variables };
  },
})(Collects);

export default CollectsWithQuery;
