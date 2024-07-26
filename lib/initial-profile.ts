import { currentUser, redirectToSignIn } from '@clerk/nextjs';
import { findUnique } from '@/graphql/profile/queries';
import { createProfile } from '@/graphql/profile/mutations';
// import { db } from '@/lib/db';

export const initialProfile = async () => {
  const user = await currentUser();

  if (!user) {
    return redirectToSignIn();
  }

  const { loading, error, data } = await findUnique(user.id);
  const profile = data ? data[0] : null;
  if (profile) {
    // //console.log('profile', profile);
    return profile;
  }

  const newProfile = await createProfile({
    data: {
      userId: user.id,
      name: `${user.firstName} ${user.lastName}`,
      imageUrl: user.imageUrl,
      email: user.emailAddresses[0].emailAddress,
    },
  });
  return newProfile;
};
