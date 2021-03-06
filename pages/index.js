import React from 'react';
import PropTypes from 'prop-types';

import Footer from '../components/Footer';
import Header from '../components/Header';
import ArticleList from '../components/ArticleList';
import AuthorIntro from '../components/AuthorIntro';
import withData from '../lib/withData';

const Index = props => (
  <div>
    <div className='header-shadow' />
    <Header pathname={props.url.pathname} title='Home' />
    <ArticleList />
    <AuthorIntro />
    <Footer />
  </div>
);

Index.propTypes = {
  url: PropTypes.shape({
    pathname: PropTypes.string.isRequired,
  }).isRequired,
};

const IndexWithData = withData(Index);

export default IndexWithData;
