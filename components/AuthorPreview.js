import React from 'react';
import moment from 'moment';
import PropTypes from 'prop-types';
import { withApollo, compose, graphql } from 'react-apollo';

import { showLoginMask } from '../utils';
import { authQuery, articleQuery } from '../graphql/querys';
import { followUserMutation } from '../graphql/mutations';

moment.locale('zh-cn');

class AuthorPreview extends React.Component {
  static propTypes = {
    articleId: PropTypes.string.isRequired,
    _id: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    username: PropTypes.string.isRequired,
    userAvatar: PropTypes.string.isRequired,
    publishDate: PropTypes.string.isRequired,
    followed: PropTypes.bool.isRequired,
    followedNum: PropTypes.number.isRequired,
    isSelf: PropTypes.bool.isRequired,
    readNumber: PropTypes.number,
    mutate: PropTypes.func.isRequired,
    client: PropTypes.object.isRequired, // apollo client
  };

  static defaultProps = {
    readNumber: 0,
  }


  focusAuthor = () => {
    const { _id, mutate, followed, articleId, followedNum } = this.props;
    this.props.client.query({
      query: authQuery,
    }).then(({ data: { user } }) => {
      if (!user._id) {
        showLoginMask();
        return;
      }
      mutate({
        variables: { userId: _id, follow: !followed },
        optimisticResponse: {
          __typename: 'Mutation',
          followUser: {
            __typename: 'User',
            _id,
            followed: !followed,
            followedNum: !followed ? followedNum + 1 : followedNum - 1,
          },
        },
        update: (store, { data: { followUser } }) => {
          const data = store.readQuery({
            query: articleQuery,
            variables: { articleId },
          });
          data.article.author.followed = followUser.followed;
          data.article.author.followedNum = followUser.followedNum;
          store.writeQuery({
            query: articleQuery,
            variables: { articleId },
            data,
          });
        },
      });
    }).catch(err => console.log(err));
  }

  render() {
    const { isSelf, email, username, userAvatar, publishDate, readNumber, followed } = this.props;
    let focus = null;
    if (!isSelf) {
      focus = followed ?
        <button onClick={this.focusAuthor}>已关注</button> :
        <button onClick={this.focusAuthor}>关注</button>;
    }
    return (
      <div className='author-intro'>
        <img src={userAvatar} alt='' />
        <div>
          <div className='user-name'>
            <span className='label'>{username || email}</span>
            {focus}
          </div>
          {/*
            <div className='user-intro'>
              作者介绍
            </div>
          */}
          <p className='pub-time'>
            <span>{moment(publishDate).fromNow()}</span>
            <span>阅读:{readNumber}</span>
          </p>
        </div>
      </div>
    );
  }
}

export default compose(
  withApollo,
  graphql(followUserMutation),
)(AuthorPreview);
