import { gql } from "@apollo/client";

export const GET_ALL_Events = gql`
  query getQuoteByUser($eventby: ID!) {
    ievent(by: $eventby) {
      eventName
      addGuest {
        email
        id
      }
      location
      date
      description
      imageUrls
      duration {
        hours
        minutes
      }
      meetingRoom
      notification
      reminder
      time
      by
    }
  }
`;

export const GET_MY_PROFILE = gql`
  query getMyProfile {
    user: myprofile {
      firstName
      lastName
      email
      quotes {
        name
      }
    }
  }
`;

export const GET_USER_BY_ID = gql`
  query getUserById($userid: ID!) {
    user(_id: $userid) {
      _id
      firstName
      lastName
      email
      quotes {
        name
      }
    }
  }
`;
