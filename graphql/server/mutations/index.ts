import { gql } from "@apollo/client";
import { useMutation } from "@apollo/client";
import { getClient } from "@/lib/apollo-client";
import { object } from "zod";
import { createMember } from "@/graphql/member/mutations";
import { createChannel } from "@/graphql/channel/mutations";

const client = getClient();

export const ADD_SERVER_MUTATION = gql`
  mutation ($objects: [ud_server_5c30bd_insert_input!]!) {
    insert_ud_server_5c30bd(objects: $objects) {
      returning {
        id
      }
    }
  }
`;

export async function createServer({ data }: { data: any }) {
  client.mutate({
    mutation: ADD_SERVER_MUTATION,
    variables: {
      objects: [
        {
          ud_profileid_profile_64e280: data.profileId,
          name: data.name,
          ud_invitecode_ddc7e2: data.inviteCOde,
          ud_imageurl_8a571f: data.imageUrl,
        },
      ],
    },
  });
}


export async function addServerAndMembers({ data }: { data: any }) {
  try {
    // 首先添加服务器
    const serverResponse = await client.mutate({
      mutation: ADD_SERVER_MUTATION,
      variables: {
        objects: [
          {
            ud_profileid_profile_64e280: data.profileId,
            name: data.name,
            ud_invitecode_ddc7e2: data.inviteCOde,
            ud_imageurl_8a571f: data.imageUrl,
          },
        ],
      },
    });

    // 获取新创建的服务器ID
    const serverId = serverResponse.data.insert_ud_server_5c30bd.returning[0].id;

    // 更新成员数据以包含服务器ID
    const membersWithServerId = data.members.map((member:any) => ({
      ...member,
      ud_serverid_server_98e759: serverId,
    }));

    const memberResponse:any = await createMember({ members:membersWithServerId });

    const channelsWithServerId = data.channels.map((channel:any) => ({
      ...channel,
      ud_serverid_server_521f66: serverId,
    }));

    const channelResponse = await createChannel({ channels:channelsWithServerId });

    return {
      server: serverResponse,
      members: memberResponse,
      channels: channelResponse,
    };
  } catch (error) {
    console.error(error);
    throw new Error('Failed to add server and members');
  }
}