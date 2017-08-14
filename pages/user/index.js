import React from 'react';
import PropTypes from 'prop-types';
import { graphql, withApollo, compose } from 'react-apollo';

import Header from '../../components/Header';
import withData from '../../lib/withData';
import { userQuery, authQuery } from '../../graphql/querys';
import UserHeader from '../../components/UserHeader';
import UserHeaderSelf from '../../components/UserHeaderSelf';
import UserHeaderNav from '../../components/UserHeaderNav';
import UserArticleList from '../../components/UserArticleList';

class User extends React.Component {
  componentDidMount() {
    this.props.client.watchQuery({
      query: authQuery,
    }).subscribe({
      next: ({ data: { user } }) => {
        // console.log('user', user);
        const userId = user && user._id;
        const isSelf = userId && this.props.data.user
                       && (userId === this.props.data.user._id);
        if (isSelf) {
          const data = this.props.client.readQuery({
            query: userQuery,
            variables: { userId: this.props.url.query.userId },
          });
          if (data.user.isSelf !== isSelf) {
            data.user.isSelf = isSelf;
          }
          this.props.client.writeQuery({
            query: userQuery,
            variables: { userId: this.props.url.query.userId },
            data,
          });
        }
      },
    });
  }

  render() {
    const { url, data } = this.props;
    let userHeader = <div />;
    let userHeaderNav = <div />;
    let articleElem = <div />;
    const { loading, error, user } = data;
    if (loading) {
      userHeader = <div>loading...</div>;
    } else if (error) {
      userHeader = <div>{error.message}</div>;
    } else {
      const { _id, email, username, userIntro, userAvatar, isSelf } = user;
      if (isSelf) {
        userHeader = <UserHeaderSelf {...{ _id, email, username, userIntro, userAvatar }} />;
      } else {
        userHeader = <UserHeader {...{ _id, email, username, userIntro, userAvatar }} />;
      }
      userHeaderNav = <UserHeaderNav {...{ url, isSelf }} userId={_id} />;
      articleElem = <UserArticleList {...{ isSelf, user }} />;
    }
    return (
      <div>
        <div className='header-shadow' />
        <Header pathname={url.pathname} title='user' />
        <div className='user-header'>
          {userHeader}
        </div>
        {userHeaderNav}
        {articleElem}
      </div>
    );
  }
}

User.propTypes = {
  url: PropTypes.shape({
    pathname: PropTypes.string,
    query: PropTypes.object,
  }).isRequired,
  data: PropTypes.shape({
    user: PropTypes.object,
    refetch: PropTypes.func,
  }).isRequired,
  client: PropTypes.object.isRequired,
};

const UserWithData = compose(
  withApollo,
  graphql(userQuery, {
    options: (props) => {
      const variables = { userId: props.url.query.userId };
      return { variables };
    },
  }),
)(User);

export default withData(UserWithData);
