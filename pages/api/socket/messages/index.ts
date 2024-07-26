import { NextApiRequest } from 'next';
import { currentProfilePages } from '@/lib/current-profile-pages';
import { NextApiResponseServerIo } from '@/types';
import { gql } from "@apollo/client";
import createApolloClient from "@/lib/page-apollo-client";

const client = createApolloClient();

const SERVER_QUERY = gql`
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
}`;

const CHANNEL_QUERY = gql`
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

const ADD_MESSAGE_MUTATION = gql`
  mutation ($objects: [ud_message_743906_insert_input!]!) {
    insert_ud_message_743906(objects: $objects) {
      returning {
        id
      }
    }
  }
`;

async function findServer(serverId:string) {
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

async function findChannel({channelId}:{channelId:string}) {
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

async function createMessage({data}:{data:any}) {
  client.mutate({
    mutation: ADD_MESSAGE_MUTATION,
    variables: {
      objects: data.messages,
    },
  });
}


export default async function handler(
  req: NextApiRequest,
  res: NextApiResponseServerIo
) {
  if (req.method !== 'POST') {
    return res.status(405).json({
      error: 'Method not allowed',
    });
  }
  try {
    const profile = await currentProfilePages(req);
    const { content, fileUrl } = req.body;
    const { serverId, channelId } = req.query;
    console.log('serverId', serverId, 'channelId', channelId, 'content', content, 'req', req);
    if (!profile) {
      return res.status(401).json({
        error: 'Unauthorized',
      });
    }
    if (!serverId) {
      return res.status(400).json({
        error: 'Server ID is required',
      });
    }
    if (!channelId) {
      return res.status(400).json({
        error: 'Channel ID is required',
      });
    }
    if (!content) {
      return res.status(400).json({
        error: 'Content is required',
      });
    }
    const server:any = await findServer(serverId as string);
    if (!server) {
      return res.status(404).json({
        error: 'Server not found',
      });
    }


    const channel = await findChannel({
      channelId: channelId as string,
    });

    if (!channel) {
      return res.status(404).json({
        error: 'Channel not found',
      });
    }

    const member = server.members.find(
      (member:any) => member.ud_profileid_profile_677433 === profile.id
    );
    if (!member) {
      return res.status(404).json({
        error: 'Member not found',
      });
    }
    const message = await createMessage({
      data:{
        messages:[
          {
            content:content,
            // ud_fileurl_f31621_id:fileUrl,
            ud_memberid_member_2ee43b:member.id,
            ud_channelid_channel_7d1b83:channelId as string,
          }
        ]
      }
    })
    const channelKey = `chat:${channelId}:messages`;
    res?.socket?.server?.io?.emit(channelKey, message);
    return res.status(200).json({
      message: 'Message sent',
    });
  } catch (error) {
    console.log('[MESSAGE_POST]', error);
    return res.status(500).json({
      message: 'Internal Server Error',
    });
  }
}
