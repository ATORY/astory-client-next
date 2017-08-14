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
      mark
      readNumber
      author {
        _id
        email
        username
        userAvatar
      }
    }
  }
`;

export const articleEditQuery = gql`
  query articleEditQuery($articleId: ID!) {
    article: articleEdit(_id: $articleId) {
      _id
      content
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
      readNumber
      collectNumber
      # commentNumber
      mark
      collect
      author {
        _id
        email
        username
        userAvatar
      }
      comments {
        _id
        content
        createDate
        user {
          _id
          email
          username
          userAvatar
        }
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
      readNumber
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

export const userQuery = gql`
query userQuery($userId: ID!) {
  user(_id: $userId) {
    _id
    email
    username
    userIntro
    userAvatar
    isSelf
  }
}
`;

export const userArticlesQuery = gql`
query userArticlesQuery($userId: ID!, $draft: Boolean) {
  user(_id: $userId) {
    _id
    articles(draft: $draft) {
      _id
      title
      shareImg
      publishDate
      mark
      readNumber
      collectNumber
    }
  }
}
`;

export const userDraftsQuery = gql`
query userDraftsQuery($userId: ID!, $draft: Boolean) {
  user(_id: $userId) {
    _id
    drafts: articles(draft: $draft) {
      _id
      title
      shareImg
      publishDate
      mark
      readNumber
      collectNumber
    }
  }
}
`;


export const userMarksQuery = gql`
query userQuery($userId: ID!, $draft: Boolean) {
  user(_id: $userId) {
    _id
    articles(draft: $draft) {
      _id
      title
      shareImg
      publishDate
      mark
      readNumber
      collectNumber
    }
  }
}
`;

export const userCollectsQuery = gql`
query userQuery($userId: ID!, $draft: Boolean) {
  user(_id: $userId) {
    _id
    articles(draft: $draft) {
      _id
      title
      shareImg
      publishDate
      mark
      readNumber
      collectNumber
    }
  }
}
`;
