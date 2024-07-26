import { NextApiRequest } from 'next';
import { MemberRole } from '@prisma/client';

import { NextApiResponseServerIo } from '@/types';
import { currentProfilePages } from '@/lib/current-profile-pages';
import { db } from '@/lib/db';
import { findServer } from '@/graphql/server/queries';
import { findChannel } from '@/graphql/channel/queries';
import { createMessage } from '@/graphql/message/mutations';
import { findMessage } from '@/graphql/message/queries';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponseServerIo
) {
  if (req.method !== 'DELETE' && req.method !== 'PATCH') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const profile = await currentProfilePages(req);
    const { messageId, serverId, channelId } = req.query;
    const { content } = req.body;

    if (!profile) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    if (!serverId) {
      return res.status(400).json({ error: 'Server ID missing' });
    }

    if (!channelId) {
      return res.status(400).json({ error: 'Channel ID missing' });
    }

    // const server = await db.server.findFirst({
    //   where: {
    //     id: serverId as string,
    //     members: {
    //       some: {
    //         profileId: profile.id,
    //       },
    //     },
    //   },
    //   include: {
    //     members: true,
    //   },
    // });
    const server:any = await findServer(serverId as string);
    if (!server) {
      return res.status(404).json({ error: 'Server not found' });
    }

    // const channel = await db.channel.findFirst({
    //   where: {
    //     id: channelId as string,
    //     sreverId: serverId as string,
    //   },
    // });
    const channel = await findChannel({
      channelId: channelId as string,
    });

    if (!channel) {
      return res.status(404).json({ error: 'Channel not found' });
    }

    const member = server.members.find(
      (member:any) => member.profileId === profile.id
    );

    if (!member) {
      return res.status(404).json({ error: 'Member not found' });
    }

    // let message = await db.message.findFirst({
    //   where: {
    //     id: messageId as string,
    //     channelId: channelId as string,
    //   },
    //   include: {
    //     member: {
    //       include: {
    //         profile: true,
    //       },
    //     },
    //   },
    // });

    let message = await findMessage({
      channelId:channelId as string,
      limit:1,
    });

    if (!message || message.deleted) {
      return res.status(404).json({ error: 'Message not found' });
    }

    const isMessageOwner = message.memberId === member.id;
    const isAdmin = member.role === MemberRole.ADMIN;
    const isModerator = member.role === MemberRole.MODERATOR;
    const canModify = isMessageOwner || isAdmin || isModerator;

    if (!canModify) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    if (req.method === 'DELETE') {
      message = await db.message.update({
        where: {
          id: messageId as string,
        },
        data: {
          fileUrl: null,
          content: 'This message has been deleted.',
          deleted: true,
        },
        include: {
          member: {
            include: {
              profile: true,
            },
          },
        },
      });
    }

    if (req.method === 'PATCH') {
      if (!isMessageOwner) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      message = await db.message.update({
        where: {
          id: messageId as string,
        },
        data: {
          content,
        },
        include: {
          member: {
            include: {
              profile: true,
            },
          },
        },
      });
    }

    const updateKey = `chat:${channelId}:messages:update`;

    res?.socket?.server?.io?.emit(updateKey, message);

    return res.status(200).json(message);
  } catch (error) {
    //console.log('[MESSAGE_ID]', error);
    return res.status(500).json({ error: 'Internal Error' });
  }
}
