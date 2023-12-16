import { gql } from "@apollo/client";

export const SIGNUP_USER = gql`
  mutation createUser($userNew: UserInput!) {
    user: signupUser(userNew: $userNew) {
      firstName
    }
  }
`;
export const LOGIN_USER = gql`
  mutation SigninUser($userSignin: UserSigninInput!) {
    user: signinUser(userSignin: $userSignin) {
      token
      user {
        _id
        firstName
        lastName
        email
        password
      }
    }
  }
`;

export const CREATE_EVENT = gql`
  mutation createEvent($event: Event!) {
    event: createEvent(event: $event)
  }
`;
