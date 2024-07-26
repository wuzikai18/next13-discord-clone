import { gql } from "@apollo/client";
import { useMutation } from "@apollo/client";
import { getClient } from "@/lib/apollo-client";
import { object } from "zod";

const client = getClient();

export const ADD_MEMBER_MUTATION = gql`
  mutation ($objects: [ud_member_998507_insert_input!]!) {
    insert_ud_member_998507(objects: $objects) {
      returning {
        id
      }
    }
  }
`;

export async function createMember(data:any) {
  client.mutate({
    mutation: ADD_MEMBER_MUTATION,
    variables: {
      objects: data.members,
    },
    fetchPolicy: 'network-only', // 或者 'no-cache'
  });
}
