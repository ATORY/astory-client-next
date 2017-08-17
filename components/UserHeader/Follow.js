import React from 'react';
import PropTypes from 'prop-types';
import { withApollo, compose, graphql } from 'react-apollo';

import { showLoginMask } from '../../utils';
import { authQuery, userQuery } from '../../graphql/querys';
import { followUserMutation } from '../../graphql/mutations';

class Follow extends React.Component {
  static propTypes = {
    _id: PropTypes.string.isRequired,
    followed: PropTypes.bool.isRequired,
    followedNum: PropTypes.number.isRequired,
    mutate: PropTypes.func.isRequired,
    client: PropTypes.object.isRequired, // apollo client
  }

  focusUser = () => {
    const { _id, mutate, followed, followedNum } = this.props;
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
            query: userQuery,
            variables: { userId: _id },
          });
          data.user.followed = followUser.followed;
          data.user.followedNum = followUser.followedNum;
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
    const { followed } = this.props;
    if (followed) {
      return <button onClick={this.focusUser}>已关注</button>;
    }
    return <button onClick={this.focusUser}>关注</button>;
  }
}

// export default Follow;

export default compose(
  withApollo,
  graphql(followUserMutation),
)(Follow);
