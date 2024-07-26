import { auth } from '@clerk/nextjs';
import { findUnique } from '@/graphql/profile/queries';
// import { db } from '@/lib/db';

export const currentProfile = async () => {
  const { userId } = auth();
  if (!userId) return null;

  // const profile = await db.profile.findUnique({
  //   where: {
  //     userId,
  //   },
  // });
  const { loading, error, data } = await findUnique(userId);
  const profile = data ? data[0] : null;

  return profile;
};
