import React from 'react';
import { graphql } from 'react-apollo';
import PropTypes from 'prop-types';

import ArticleCellMark from './ArticleCellMark';
import { userCollectsQuery } from '../graphql/querys';

const UserCollectList = ({ user, data }) => {
  let articleElem = <div />;
  if (data.loading) return <div className='user-articles'>loading</div>;
  if (data.error) return <div className='user-articles'>{data.error.message}</div>;
  const { collects } = data.user;
  articleElem = (collects && collects.length > 0) ? collects.map(({ article }) => {
    if (!article) return null;
    const articleId = article._id;
    return (
      <ArticleCellMark
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

UserCollectList.propTypes = {
  data: PropTypes.object.isRequired,
  // isSelf: PropTypes.bool.isRequired,
  user: PropTypes.object.isRequired,
};

const UserCollectListWithQuery = graphql(userCollectsQuery, {
  options: (props) => {
    const variables = { userId: props.user._id };
    return { variables };
  },
})(UserCollectList);

export default UserCollectListWithQuery;
