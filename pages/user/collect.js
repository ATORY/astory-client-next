import React from 'react';
import PropTypes from 'prop-types';
import { graphql, withApollo, compose } from 'react-apollo';

import Header from '../../components/Header';
import withData from '../../lib/withData';
import { userQuery, authQuery } from '../../graphql/querys';
import UserHeader from '../../components/UserHeader';
// import UserHeaderNav from '../../components/UserHeaderNav';
import { Collects } from '../../components/UserList';

class UserCollect extends React.Component {
  static propTypes = {
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

  componentDidMount() {
    this.props.client.watchQuery({
      query: authQuery,
    }).subscribe({
      next: ({ data: { user } }) => {
        const { data, url } = this.props;
        const userId = user && user._id;
        const isSelf = !!(userId && data.user && (userId === data.user._id));
        if (isSelf) {
          const storeData = this.props.client.readQuery({
            query: userQuery,
            variables: { userId: url.query.userId },
          });
          storeData.user.isSelf = isSelf;
          this.props.client.writeQuery({
            query: userQuery,
            variables: { userId: this.props.url.query.userId },
            data: storeData,
          });
        }
      },
    });
  }

  render() {
    const { url, data } = this.props;
    let userHeader = <div />;
    let articleElem = <div />;
    const { loading, error, user } = data;
    if (loading) {
      userHeader = <div>loading...</div>;
    } else if (error) {
      userHeader = <div>{error.message}</div>;
    } else {
      const { isSelf } = user;
      userHeader = <UserHeader {...{ url, ...user }} />;
      articleElem = <Collects {...{ isSelf, user }} />;
    }
    return (
      <div>
        <div className='header-shadow' />
        <Header pathname={url.pathname} title='user' />
        {userHeader}
        {articleElem}
      </div>
    );
  }
}

const UserCollectWithData = compose(
  withApollo,
  graphql(userQuery, {
    options: (props) => {
      const variables = { userId: props.url.query.userId, draft: true };
      return { variables };
    },
  }),
)(UserCollect);

export default withData(UserCollectWithData);

