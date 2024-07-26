import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';

import { currentProfile } from '@/lib/current-profile';
import { db } from '@/lib/db';
import { MemberRole } from '@prisma/client';
import { addServerAndMembers } from '@/graphql/server/mutations';

export async function POST(req: Request) {
  try {
    const { name, imageUrl } = await req.json();
    const profile = await currentProfile();

    if (!profile) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const server = addServerAndMembers({
      data: {
        profileId: profile.id,
        name,
        imageUrl,
        inviteCOde: uuidv4(),
        channels: [{ name: 'general', ud_profileid_profile_57d903: profile.id }],
        members: [{ ud_profileid_profile_677433: profile.id, role: MemberRole.ADMIN }],
      },
    });
    return NextResponse.json(server);
  } catch (error) {
    //console.log(['SERVER_POST', error]);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
