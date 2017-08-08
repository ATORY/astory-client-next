import React from 'react';
import moment from 'moment';
import PropTypes from 'prop-types';

moment.locale('zh-cn');

class AuthorPreview extends React.Component {
  static propTypes = {
    _id: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    userAvatar: PropTypes.string.isRequired,
    publishDate: PropTypes.string.isRequired,
    readNumber: PropTypes.number,
  };

  static defaultProps = {
    readNumber: 0,
  }


  focusAuthor = () => {
    const { _id } = this.props;
    console.log(_id);
  }

  render() {
    const { email, userAvatar, publishDate, readNumber } = this.props;
    return (
      <div className='author-intro'>
        <img src={userAvatar} alt='' />
        <div>
          <div className='user-name'>
            <span className='label'>{email}</span>
            <button onClick={this.focusAuthor}>关注</button>
          </div>
          <div className='user-intro'>
            作者介绍
          </div>
          <p className='pub-time'>
            <span>{moment(publishDate).fromNow()}</span>
            <span>阅读:{readNumber}</span>
          </p>
        </div>
      </div>
    );
  }
}

export default AuthorPreview;
