import React from 'react';
import { graphql } from 'react-apollo';
import PropTypes from 'prop-types';

import ArticleCellUser from '../ArticleCellUser';
import { userDraftsQuery } from '../../graphql/querys';

const Drafts = ({ isSelf, user, data }) => {
  let articleElem = <div />;
  if (data.loading) return <div className='user-articles'>loading</div>;
  if (data.error) return <div className='user-articles'>{data.error.message}</div>;
  const { drafts } = data.user;
  articleElem = drafts.length > 0 ? drafts.map((article) => {
    const articleId = article._id;
    return (
      <ArticleCellUser
        key={articleId}
        isSelf={isSelf}
        {...article}
        user={user}
      />
    );
  }) : <div>暂无草稿或无权访问</div>;
  return (
    <div className='user-articles'>
      {articleElem}
    </div>
  );
};

Drafts.propTypes = {
  data: PropTypes.object.isRequired,
  isSelf: PropTypes.bool.isRequired,
  user: PropTypes.object.isRequired,
};

const DraftsWithQuery = graphql(userDraftsQuery, {
  options: (props) => {
    const variables = { userId: props.user._id, draft: true };
    return { variables };
  },
})(Drafts);

export default DraftsWithQuery;
