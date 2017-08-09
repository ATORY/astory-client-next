import { gql } from 'react-apollo';

export const userLoginMutation = gql`
  mutation newUser($user: UserInput!) {
    user: newUser(user: $user) {
      _id
      email
      userAvatar
    }
  }
`;

export const newArticleMutation = gql`
  mutation newArticle($newArticle: ArticleInput!) {
    article: newArticle(article: $newArticle) {
      _id
      draft
    }
  }
`;

export const markMutation = gql`
  mutation markMutation($articleId: String!, $mark: Boolean!) {
    markArticle(articleId: $articleId, mark: $mark) {
      mark
    }
  }
`;

export const collectMutation = gql`
  mutation collectMutation($articleId: String!, $collect: Boolean!) {
    collectArticle(articleId: $articleId, collect: $collect) {
      article {
        collect
        collectNumber
      }
    }
  }
`;

export const newCommentMutation = gql`
  mutation commentMutation($articleId: String!, $content: String!, $originId: String) {
    newArticleComment(articleId: $articleId, content: $content, originCommentId: $originId) {
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
`;
