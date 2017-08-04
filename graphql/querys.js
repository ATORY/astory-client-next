import { gql } from 'react-apollo';

export const authQuery = gql`
  query auth {
    user: auth {
      _id
      email
      userAvatar
    }
  }
`;


export const articlesQuery = gql`
  query articlesQuery($articleId: ID) {
    articles(_id: $articleId) {
      _id
      title
    }
  }
`;

export const articleQuery = gql`
  query articleQuery($articleId: ID!) {
    article(_id: $articleId) {
      _id
      title
      content
    }
  }
`

export const articlePreviewQuery = gql`
  query articleQuery($articleId : ID!) {
    article(_id: $articleId) {
      _id
      title
    }
  }
`;