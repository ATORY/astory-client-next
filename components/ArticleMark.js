import React from 'react';
import PropTypes from 'prop-types';
import { graphql, compose, withApollo } from 'react-apollo';
import { markMutation } from '../graphql/mutations';
import { authQuery } from '../graphql/querys';
import { showLoginMask } from '../utils';

// turned in
class ArticleMark extends React.Component {
  static propTypes = {
    mark: PropTypes.bool.isRequired,
    articleId: PropTypes.string.isRequired,
    client: PropTypes.object.isRequired, // apollo client
    mutate: PropTypes.func.isRequired, // apollo mutate
  }

  constructor(props) {
    super(props);
    this.state = {
      mark: props.mark,
    };
  }

  markArticle = () => {
    // query auth
    const { mark } = this.state;
    const { articleId, mutate } = this.props;
    this.props.client.query({
      query: authQuery,
    }).then(({ data: { user } }) => {
      if (user._id) {
        mutate({
          variables: { articleId, mark: !mark },
          optimisticResponse: {
            __typename: 'Mutation',
            markArticle: {
              __typename: 'Mark',
              mark: !mark,
            },
          },
          update: (store, { data: { markArticle } }) => {
            this.setState({ mark: markArticle.mark });
          },
        }).then(({ data: { markArticle } }) => {
          this.setState({ mark: markArticle.mark });
        });
      } else {
        showLoginMask();
      }
    }).catch(err => console.log(err));
  }

  render() {
    const markStatus = this.state.mark ? 'turned_in' : 'turned_in_not';
    return (
      <div className='article-mark' onClick={this.markArticle} role='presentation'>
        <i className='material-icons'>{markStatus}</i>
      </div>
    );
  }
}

const ArticleMarkWithMutation = compose(
  graphql(markMutation),
  withApollo,
)(ArticleMark);

export default ArticleMarkWithMutation;
