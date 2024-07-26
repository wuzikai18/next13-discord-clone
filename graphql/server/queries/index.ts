import { gql, useQuery } from '@apollo/client';
import { getClient } from '@/lib/apollo-client';
import { off } from 'process';

const client = getClient();

export const SERVER_QUERY = gql`
  query ($limit: Int, $offset: Int, $order_by: [ud_server_5c30bd_order_by!], $where: ud_server_5c30bd_bool_exp) {
  ud_server_5c30bd(
    limit: $limit
    offset: $offset
    order_by: $order_by
    where: $where
  ) {
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
}
`;

// 将 findUnique 转换为一个自定义 Hook
export async function findServer(serverId:string) {
    const { loading, error, data } = await client.query({
        query: SERVER_QUERY,
        variables: { 
          where: {
              id: {
                _eq: serverId
              }
          },
          limit: 1,
          offset: 0 
      },
      fetchPolicy: 'network-only', // 或者 'no-cache'
      });
    return data.ud_server_5c30bd[0];
  }

  // export async function findUserAllServer(serverId:string) {
  //   const { loading, error, data } = await client.query({
  //       query: SERVER_QUERY,
  //       variables: { 
  //         where: {
  //             id: {
  //               _eq: serverId
  //             }
  //         },
  //         limit: 1,
  //         offset: 0 
  //     },
  //     fetchPolicy: 'network-only', // 或者 'no-cache'
  //     });
  //   return data.ud_server_5c30bd[0];
  // }