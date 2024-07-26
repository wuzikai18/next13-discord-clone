import { gql } from "@apollo/client";
import { useMutation } from "@apollo/client";
import { getClient } from "@/lib/apollo-client";
import { object } from "zod";

const client = getClient();

export const ADD_CHANNEL_MUTATION = gql`
  mutation ($objects: [ud_channel_725403_insert_input!]!) {
    insert_ud_channel_725403(objects: $objects) {
      returning {
        id
      }
    }
  }
`;

export async function createChannel(data:any) {
  client.mutate({
    mutation: ADD_CHANNEL_MUTATION,
    variables: {
      objects: data.channels,
    },
  });
}
