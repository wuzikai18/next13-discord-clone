import { gql, useQuery } from '@apollo/client';
import { getClient } from '@/lib/apollo-client';

const client = getClient();

export const CHANNEL_QUERY = gql`
  query ($limit: Int, $offset: Int, $order_by: [ud_channel_725403_order_by!], $where: ud_channel_725403_bool_exp) {
  ud_channel_725403(
    limit: $limit
    offset: $offset
    order_by: $order_by
    where: $where
  ) {
    id
    created_at
    updated_at
    name
    type
    ud_profileid_profile_57d903
    ud_serverid_server_521f66
    messages {
      id
    }
  }
}
`;

// 将 findUnique 转换为一个自定义 Hook
export async function findChannel({channelId}:{channelId:string}) {
    const { loading, error, data } = await client.query({
        query: CHANNEL_QUERY,
        variables: { 
          where: {
              id: {
                _eq: channelId
              }
            },
          limit: 1,
          offset: 0 
      },
      fetchPolicy: 'network-only',
      });
    return data.ud_channel_725403[0];
  }
