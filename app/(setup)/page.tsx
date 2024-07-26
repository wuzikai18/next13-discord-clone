import React from 'react';
import { redirect } from 'next/navigation';


// import { db } from '@/lib/db';
import { initialProfile } from '@/lib/initial-profile';
import { InitialModal } from '@/components/modals/initial-modal';

const SetupPage = async () => {
  const profile = await initialProfile();

  if (profile?.servers && profile.servers.length>0) {
    return redirect(`/servers/${profile.servers[0].id}`);
  }

  return <InitialModal />;
};

export default SetupPage;
