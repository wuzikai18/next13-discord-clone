import { gql, useQuery } from '@apollo/client';
import { getClient } from '@/lib/apollo-client';

const client = getClient();

const MEMBER_QUERY = gql`
  query ($limit: Int, $offset: Int, $order_by: [ud_member_998507_order_by!], $where: ud_member_998507_bool_exp) {
  ud_member_998507(
    limit: $limit
    offset: $offset
    order_by: $order_by
    where: $where
  ) {
    id
    created_at
    updated_at
    ud_profileid_profile_677433
    ud_serverid_server_98e759
    role
    ud_profileid_c5c586 {
      id
      name
      ud_imageurl_ee9d25 {
        url
      }
    }
    messages {
      id
    }
    ud_conversationsinitiated_c7b4d6 {
      id
    }
    ud_conversationsreceived_812afa {
      id
    }
    ud_directmessages_4bb9f6 {
      id
    }
  }
}
`;

// 将 findUnique 转换为一个自定义 Hook
export async function findMember({serverId, userId}:{serverId:string, userId:string}) {
    const { loading, error, data } = await client.query({
        query: MEMBER_QUERY,
        variables: { 
          where: {
            _and: [
              {
                ud_profileid_profile_677433: {
                  _eq: userId
                }
              },
              {
                ud_serverid_server_98e759: {
                  _eq: serverId
                }
              }
            ]
          },
          limit: 1,
          offset: 0 
      },
      fetchPolicy: 'network-only', // 或者 'no-cache'
      });
    return data.ud_member_998507[0];
  }
