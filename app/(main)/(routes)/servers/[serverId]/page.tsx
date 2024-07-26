import {redirect} from 'next/navigation'
import { redirectToSignIn } from '@clerk/nextjs';

import { currentProfile } from '@/lib/current-profile';
import { db } from '@/lib/db';
import { findServer } from '@/graphql/server/queries';
interface ServerIdPageProps {
  params: {
    serverId: string;
  };
}

const ServerIdPage = async ({ params }: ServerIdPageProps) => {
  const profile = await currentProfile();

  if (!profile) {
    return redirectToSignIn();
  }

  // const server = await db.server.findUnique({
  //   where: {
  //     id: params.serverId,
  //     members: {
  //       some: {
  //         profileId: profile.id,
  //       },
  //     },
  //   },
  //   include: {
  //     channels: {
  //       where: {
  //         name: 'general',
  //       },
  //       orderBy: {
  //         createdAt: 'asc',
  //       },
  //     },
  //   },
  // });
  const server:any = await findServer(params.serverId);

  const initialChannel = server?.channels[0];
  console.log("params.serverId",params.serverId,'initialChannel', initialChannel);
  if (initialChannel?.name !== 'general') {
    return null;
  }

  return redirect(`/servers/${params.serverId}/channels/${initialChannel?.id}`);
};

export default ServerIdPage;
