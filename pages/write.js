import React from 'react';
import Header from '../components/Header';
import withData from '../lib/withData';

const Write = withData((props) => (
  <div>
    <Header pathname={props.url.pathname} />
    Write
  </div>
));
export default Write;