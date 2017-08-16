import React from 'react';
import PropTypes from 'prop-types';
import { withApollo, compose, graphql } from 'react-apollo';

import UserHeaderSelf from './Self';
import Nav from './Nav';
import { showLoginMask } from '../../utils';
import { authQuery, userQuery } from '../../graphql/querys';
import { followUserMutation } from '../../graphql/mutations';

class UserHeader extends React.Component {
  static propTypes = {
    url: PropTypes.object.isRequired,
    _id: PropTypes.string.isRequired,
    isSelf: PropTypes.bool.isRequired,
    followed: PropTypes.bool.isRequired,
    followedNum: PropTypes.number.isRequired,
    email: PropTypes.string.isRequired,
    username: PropTypes.string.isRequired,
    userIntro: PropTypes.string.isRequired,
    userAvatar: PropTypes.string.isRequired,
    client: PropTypes.object.isRequired, // apollo client
    mutate: PropTypes.func.isRequired, // apollo mutate
  }

  focusUser = () => {
    const { _id, mutate, followed } = this.props;
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
          },
        },
        update: (store, { data: { followUser } }) => {
          const data = store.readQuery({
            query: userQuery,
            variables: { userId: _id },
          });
          data.user.followed = followUser.followed;
          store.writeQuery({
            query: userQuery,
            variables: { userId: _id },
            data,
          });
        },
      });
    }).catch(err => console.log(err));
  }

  render() {
    const { url, isSelf, _id, email, username,
      userIntro, userAvatar, followed, followedNum } = this.props;
    if (!isSelf) {
      return (
        <div className='user-header'>
          <div className='user'>
            <div className='intro'>
              <h2 id='username'>{username}</h2>
              <p id='userintro'>{userIntro}</p>
            </div>
            <img src={userAvatar} alt='' />
            <div className='intro-other'>
              {
                followed ?
                  <button onClick={this.focusUser}>已关注({followedNum})</button> :
                  <button onClick={this.focusUser}>关注({followedNum})</button>
              }
            </div>
          </div>
          <Nav {...{ url, isSelf }} userId={_id} />
        </div>
      );
    }
    return (
      <div className='user-header'>
        <UserHeaderSelf {...{ _id, email, username, userIntro, userAvatar, followedNum }} />
        <Nav {...{ url, isSelf }} userId={_id} />
      </div>
    );
  }
}


export default compose(
  withApollo,
  graphql(followUserMutation),
)(UserHeader);
