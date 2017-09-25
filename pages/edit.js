import React from 'react';
import PropTypes from 'prop-types';
import dynamic from 'next/dynamic';
import { graphql } from 'react-apollo';

import Header from '../components/Header';
import { articleEditQuery } from '../graphql/querys';
import withData from '../lib/withData';
import Draft from '../components/Draft';
// const Writer = dynamic(
//   import('../components/Writer'),
//   {
//     ssr: false,
//     loading: () => <div className='write write-wrapper'>初始化编辑器。。。</div>,
//   },
// );

const Editer = ({ url, data: { loading, error, article } }) => {
  if (loading) {
    return <div>Loading....</div>;
  }
  if (error) {
    return <div>{error.message}</div>;
  }
  return (
    <div>
      <div className='header-shadow' />
      <Header pathname={url.pathname} title='editor' />
      <div className='write write-wrapper'>
        <Draft
          _id={article._id}
          text={article.content}
          title={article.title}
          banner={article.shareImg}
        />
      </div>
    </div>
  );
};

Editer.propTypes = {
  url: PropTypes.shape({
    pathname: PropTypes.string,
  }).isRequired,
  data: PropTypes.shape({
    loading: PropTypes.bool,
    error: PropTypes.object,
    article: PropTypes.shape({
      _id: PropTypes.string,
      content: PropTypes.string,
    }),
  }).isRequired,
};

const EditerWithQuery = graphql(articleEditQuery, {
  options: (props) => {
    const variables = { articleId: props.url.query.articleId };
    return { variables };
  },
})(Editer);

export default withData(EditerWithQuery);
