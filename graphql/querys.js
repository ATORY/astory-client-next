import { gql } from 'react-apollo';

export const authQuery = gql`
  query auth {
    user: auth {
      _id
      email
      username
      userAvatar
    }
  }
`;


export const articlesQuery = gql`
  query articlesQuery($articleId: ID) {
    articles(_id: $articleId) {
      _id
      title
      shareImg
      publishDate
      author {
        _id
        email
        username
        userAvatar
      }
    }
  }
`;

export const articleQuery = gql`
  query articleQuery($articleId: ID!) {
    article(_id: $articleId) {
      _id
      title
      content
      publishDate
      author {
        _id
        email
        username
        userAvatar
      }
    }
  }
`;

export const articlePreviewQuery = gql`
  query articleQuery($articleId : ID!) {
    article(_id: $articleId) {
      _id
      title
      publishDate
      author {
        _id
        email
        username
        userAvatar
      }
    }
  }
`;

export const authorInfoQuery = gql`
  query authorInfoQuery($userId : ID!) {
    user(_id: $userId) {
      _id
      email
      username
      userAvatar
    }
  }
`;
