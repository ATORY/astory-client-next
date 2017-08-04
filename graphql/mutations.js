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
