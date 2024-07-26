import { ChannelType, MemberRole } from '@prisma/client';
import { Hash, Mic, ShieldAlert, ShieldCheck, Video } from 'lucide-react';
import { redirect } from 'next/navigation';

import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { currentProfile } from '@/lib/current-profile';
import { db } from '@/lib/db';
import { ServerHeader } from './server-header';
import { ServerSearch } from './server-search';
import { ServerSection } from './server-section';
import { ServerChannel } from './server-channel';
import { ServerMember } from './server-member';
import { findServer } from '@/graphql/server/queries';

interface ServerSidebarProps {
  serverId: string;
}
const iconMap = {
  [ChannelType.TEXT]: <Hash className="w-4 h-4 mr-2" />,
  [ChannelType.AUDIO]: <Mic className="w-4 h-4 mr-2" />,
  [ChannelType.VIDEO]: <Video className="w-4 h-4 mr-2" />,
};

const roleIconMap = {
  [MemberRole.GUEST]: null,
  [MemberRole.MODERATOR]: (
    <ShieldCheck className="w-4 h-4 mr-2 text-indigo-500" />
  ),
  [MemberRole.ADMIN]: <ShieldAlert className="w-4 h-4 mr-2 text-rose-500" />,
};

const ServerSidebar = async ({ serverId }: ServerSidebarProps) => {
  const profile = await currentProfile();

  if (!profile) {
    return redirect('/');
  }

  // const server = await db.server.findUnique({
  //   where: {
  //     id: serverId,
  //   },
  //   include: {
  //     channels: {
  //       orderBy: {
  //         createdAt: 'asc',
  //       },
  //     },
  //     members: {
  //       include: {
  //         profile: true,
  //       },
  //       orderBy: {
  //         role: 'asc',
  //       },
  //     },
  //   },
  // });

  const server:any = await findServer(serverId);

  //console.log('server', server);
  const textChannels = server?.channels.filter(
    (channel:any) => channel.type === ChannelType.TEXT
  );
  const audioChannels = server?.channels.filter(
    (channel:any) => channel.type === ChannelType.AUDIO
  );
  const videoChannels = server?.channels.filter(
    (channel:any) => channel.type === ChannelType.VIDEO
  );
  const members = server?.members.filter(
    (member:any) => member.ud_profileid_profile_677433 !== profile.id
  );

  if (!server) {
    return redirect('/');
  }
  const role = server.members.find(
    (member:any) => member.ud_profileid_profile_677433 === profile.id
  )?.role;

  return (
    <div className="flex flex-col h-full text-primary w-full dark:bg-[#2B2D31] bg-[#F2F3F5]">
      <ServerHeader server={server} role={role} />
      <ScrollArea className="flex-1 px-3">
        <div className="mt-2">
          <ServerSearch
            data={[
              {
                label: 'Text Channels',
                type: 'channel',
                data: textChannels?.map((channel:any) => ({
                  id: channel.id,
                  name: channel.name,
                  // @ts-ignore
                  icon: iconMap[channel.type],
                })),
              },
              {
                label: 'Voice Channels',
                type: 'channel',
                data: audioChannels?.map((channel:any) => ({
                  id: channel.id,
                  name: channel.name,
                  // @ts-ignore
                  icon: iconMap[channel.type],
                })),
              },
              {
                label: 'Video Channels',
                type: 'channel',
                data: videoChannels?.map((channel:any) => ({
                  id: channel.id,
                  name: channel.name,
                  // @ts-ignore
                  icon: iconMap[channel.type],
                })),
              },
              {
                label: 'Members',
                type: 'member',
                data: members?.map((member:any) => ({
                  id: member.id,
                  name: member.ud_profileid_c5c586.name,
                  // @ts-ignore
                  icon: roleIconMap[member.role],
                })),
              },
            ]}
          />
        </div>
        <Separator className="my-2 rounded-md bg-zinc-200 dark:bg-zinc-700" />
        {!!textChannels?.length && (
          <div className="mb-2">
            <ServerSection
              sectionType="channels"
              channelType={ChannelType.TEXT}
              role={role}
              label="Text Channels"
            />
            <div className="space-y-[2px]">
              {textChannels.map((channel:any) => (
                <ServerChannel
                  key={channel.id}
                  channel={channel}
                  role={role}
                  server={server}
                />
              ))}
            </div>
          </div>
        )}
        {!!audioChannels?.length && (
          <div className="mb-2">
            <ServerSection
              sectionType="channels"
              channelType={ChannelType.AUDIO}
              role={role}
              label="Voice Channels"
            />
            <div className="space-y-[2px]">
              {audioChannels.map((channel:any) => (
                <ServerChannel
                  key={channel.id}
                  channel={channel}
                  role={role}
                  server={server}
                />
              ))}
            </div>
          </div>
        )}
        {!!videoChannels?.length && (
          <div className="mb-2">
            <ServerSection
              sectionType="channels"
              channelType={ChannelType.VIDEO}
              role={role}
              label="Video Channels"
            />
            <div className="space-y-[2px]">
              {videoChannels.map((channel:any) => (
                <ServerChannel
                  key={channel.id}
                  channel={channel}
                  role={role}
                  server={server}
                />
              ))}
            </div>
          </div>
        )}
        {!!members?.length && (
          <div className="mb-2">
            <ServerSection
              sectionType="members"
              role={role}
              label="Members"
              server={server}
            />
            <div className="space-y-[2px]">
              {members.map((member:any) => (
                <ServerMember key={member.id} member={member} server={server} />
              ))}
            </div>
          </div>
        )}
      </ScrollArea>
    </div>
  );
};

export { ServerSidebar };
