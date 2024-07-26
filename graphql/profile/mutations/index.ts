import { gql } from "@apollo/client";
import { useMutation } from "@apollo/client";
import { getClient } from "@/lib/apollo-client";
import { object } from "zod";

const client = getClient();

export const ADD_PROFILE_MUTATION = gql`
  mutation ($objects: [ud_profile_248b57_insert_input!]!) {
    insert_ud_profile_248b57(objects: $objects) {
      returning {
        id
      }
    }
  }
`;

export async function createProfile({ data }: { data: any }) {
  client.mutate({
    mutation: ADD_PROFILE_MUTATION,
    variables: {
      objects: [
        {
          ud_userid_85784e: data.userId,
          name: data.name,
          email: data.email,
        },
      ],
    },
  });
}
