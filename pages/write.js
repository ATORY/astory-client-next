import React from 'react';
// import ReactDOM from 'react-dom';
import { graphql } from 'react-apollo';
import PropTypes from 'prop-types';
import { authQuery } from '../graphql/querys';

import Header from '../components/Header';
import withData from '../lib/withData';
import Draft from '../components/Draft';

class DraftPage extends React.Component {
  static propTypes = {
    url: PropTypes.shape({
      pathname: PropTypes.string,
    }).isRequired,
    data: PropTypes.shape({
      user: PropTypes.object,
    }).isRequired,
  }
  onChange = (editorState) => {
    this.setState({
      editorState,
    });
  }
  render() {
    // const { url } = this.props;
    const { url, data: { user } } = this.props;
    return (
      <div>
        <div className='header-shadow' />
        <Header pathname={url.pathname} title='writer' />
        <div className='write write-wrapper'>
          {user && user._id && <Draft />}
        </div>
      </div>
    );
  }
}

// export default MyEditor;
export default withData(graphql(authQuery)(DraftPage));
