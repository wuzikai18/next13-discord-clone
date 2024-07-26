import { gql, useQuery } from '@apollo/client';
import { getClient } from '@/lib/apollo-client';

const client = getClient();

const MESSAGE_QUERY = gql`
  query ($limit: Int, $offset: Int, $order_by: [ud_message_743906_order_by!], $where: ud_message_743906_bool_exp) {
  ud_message_743906(
    limit: $limit
    offset: $offset
    order_by: $order_by
    where: $where
  ) {
    id
    created_at
    updated_at
    content
    ud_fileurl_f31621 {
      url
      id
    }
    ud_memberid_member_2ee43b
    ud_memberid_f7fb6b {
      id
      ud_profileid_profile_677433
      ud_profileid_c5c586 {
        name
        ud_imageurl_ee9d25 {
          url
        }
      }
      role
    }
    ud_channelid_channel_7d1b83
    ud_channelid_54620e {
      id
      name
      type
    }
    deleted
  }
}
`;

// 将 findUnique 转换为一个自定义 Hook
export async function findMessage({channelId,limit}:{channelId:string,limit:number}) {
    const { loading, error, data } = await client.query({
        query: MESSAGE_QUERY,
        variables: { 
          where: {
            ud_channelid_channel_7d1b83: {
              _eq: channelId
            }
          },
          limit: limit,
          offset: 0,
          order_by: [
            {
              created_at: "desc_nulls_last"
            }
          ]
      },
      fetchPolicy: 'network-only',
      });
    return data.ud_message_743906;
  }
