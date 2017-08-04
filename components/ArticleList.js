import React from 'react';
import { gql, graphql } from 'react-apollo';

import ArticleCell from './ArticleCell';
import { articlesQuery } from '../graphql/querys';

class ArticleList extends React.Component {
  render() {
    const { data: { loading, error, articles } } = this.props;
    return (
      <div className="maxWidth articles">
        { 
          loading ? <div>Loading...</div> :
          error ? <div>{error.message}</div> : 
          articles.map( ({_id, title}) =>
            <ArticleCell key={_id} _id={_id} title={title}/>
          )
        }
      </div>
    )
  }
}
// const Home = ({ match, data: { loading, error, articles } }) => {
//   return (
//     <div>
//       <Head>
//         <Nav />
//       </Head>
//       <div className="maxWidth articles">
//       { 
//         loading ? <div>Loading...</div> :
//         error ? <div>{error.message}</div> : 
//         articles.map( ({_id, title}) =>
//         <ArticleCell key={_id} _id={_id} title={title}/>
//       )}
//       </div>
//     </div>
//   );
// };


const ArticleListWithData = (graphql(articlesQuery)(ArticleList));
export default ArticleListWithData;
// const POSTS_PER_PAGE = 10
/*
// function PostList ({ data: { loading, error, allPosts, _allPostsMeta }, loadMorePosts }) {
  if (error) return <ErrorMessage message='Error loading posts.' />
  if (allPosts && allPosts.length) {
    // const areMorePosts = allPosts.length < _allPostsMeta.count
    return (
      <section>
        <ul>
          {allPosts.map((post, index) =>
            <li key={post.id}>
              <div>
                <span>{index + 1}. </span>
                <a href={post.url}>{post.title}</a>
                <PostUpvoter id={post.id} votes={post.votes} />
              </div>
            </li>
          )}
        </ul>
        {areMorePosts ? <button onClick={() => loadMorePosts()}> {loading ? 'Loading...' : 'Show More'} </button> : ''}
      </section>
    )
  }
  return <div>Loading</div>
}

const allPosts = gql`
  query allPosts($first: Int!, $skip: Int!) {
    allPosts(orderBy: createdAt_DESC, first: $first, skip: $skip) {
      id
      title
      votes
      url
      createdAt
    },
    _allPostsMeta {
      count
    }
  }
`

// The `graphql` wrapper executes a GraphQL query and makes the results
// available on the `data` prop of the wrapped component (PostList)
export default graphql(allPosts, {
  options: {
    variables: {
      skip: 0,
      first: POSTS_PER_PAGE
    }
  },
  props: ({ data }) => ({
    data,
    loadMorePosts: () => {
      return data.fetchMore({
        variables: {
          skip: data.allPosts.length
        },
        updateQuery: (previousResult, { fetchMoreResult }) => {
          if (!fetchMoreResult) {
            return previousResult
          }
          return Object.assign({}, previousResult, {
            // Append the new posts results to the old one
            allPosts: [...previousResult.allPosts, ...fetchMoreResult.allPosts]
          })
        }
      })
    }
  })
})(PostList)
*/