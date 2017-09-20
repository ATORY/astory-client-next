import React from 'react';
// import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';

import Header from '../components/Header';
import withData from '../lib/withData';
import Draft from '../components/Draft';

class MyEditor extends React.Component {
  static propTypes = {
    url: PropTypes.shape({
      pathname: PropTypes.string,
    }).isRequired,
  }
  onChange = (editorState) => {
    this.setState({
      editorState,
    });
  }
  render() {
    const { url } = this.props;
    return (
      <div>
        <div className='header-shadow' />
        <Header pathname={url.pathname} title='writer' />
        <div className='write write-wrapper'>
          <Draft />
        </div>
      </div>
    );
  }
}

// export default MyEditor;
export default withData(MyEditor);
