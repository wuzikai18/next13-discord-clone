import { NextApiRequest } from 'next';
import { getAuth } from '@clerk/nextjs/server';
import { gql } from "@apollo/client";
import createApolloClient from "@/lib/page-apollo-client";

const client = createApolloClient();

const PROFILE_QUERY = gql`
  query ($limit: Int, $offset: Int, $order_by: [ud_profile_248b57_order_by!], $where: ud_profile_248b57_bool_exp) {
  ud_profile_248b57(
    limit: $limit
    offset: $offset
    order_by: $order_by
    where: $where
  ) {
    id
    created_at
    updated_at
    ud_userid_85784e
    name
    ud_imageurl_ee9d25 {
      url(option: {resize: {width: 500, height: 500}})
      id
    }
    email
    servers {
      id
      name
      ud_imageurl_8a571f
      ud_invitecode_ddc7e2
      ud_profileid_profile_64e280
      members {
      id
      ud_profileid_profile_677433
      role
      ud_profileid_c5c586 {
        name
        ud_imageurl_ee9d25 {
          url
        }
      }
    }
    }
    members {
      id
      ud_profileid_profile_677433
      ud_serverid_server_98e759
      ud_serverid_a7bb35 {
        id
    created_at
    updated_at
    name
    ud_imageurl_8a571f
    ud_invitecode_ddc7e2
    ud_profileid_profile_64e280
    members {
      id
      ud_profileid_profile_677433
      role
      ud_profileid_c5c586 {
        name
        ud_imageurl_ee9d25 {
          url
        }
      }
    }
    channels {
      id
      name
      type
    }
      }
      role
    }
    channels {
      id
      name
      type
    }
  }
}
`;

// 将 findUnique 转换为一个自定义 Hook
export async function findUnique(userId:string) {
    const { loading, error, data } = await client.query({
        query: PROFILE_QUERY,
        variables: { where: { ud_userid_85784e: { _eq: userId } } },
        fetchPolicy: 'network-only', // 或者 'no-cache'
      });
    return {
      loading,
      error,
      data: data ? data.ud_profile_248b57 : null,
    };
  }

export const currentProfilePages = async (req: NextApiRequest) => {
  const { userId } = getAuth(req);

  if (!userId) {
    return null;
  }

  const { loading, error, data } = await findUnique(userId);
  const profile = data ? data[0] : null;

  return profile;
};
