import { gql } from "@apollo/client";
import { useMutation } from "@apollo/client";
import { getClient } from "@/lib/apollo-client";
import { object } from "zod";

const client = getClient();

export const ADD_MESSAGE_MUTATION = gql`
  mutation ($objects: [ud_message_743906_insert_input!]!) {
    insert_ud_message_743906(objects: $objects) {
      returning {
        id
      }
    }
  }
`;

export async function createMessage({data}:{data:any}) {
  client.mutate({
    mutation: ADD_MESSAGE_MUTATION,
    variables: {
      objects: data.messages,
    },
  });
}
