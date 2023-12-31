import React from 'react';
import getUser from '@/lib/getUser';
import getUserPosts from '@/lib/getUserPosts';
import { Suspense } from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next';

// components
import UserPosts from './components/UserPosts';

type Params = {
  params: {
    userId: string,
  };
};

export async function generateMetadata({ params: { userId } }: Params): Promise<Metadata> {
  const userData: Promise<User> = getUser(userId);
  const user: User = await userData;

  if (!user.name) {
    return {
      title: 'User not found!'
    };
  };

  return {
    title: user.name,
    description: `This is the page of ${user.name}`,
  };
};

const UserPage = async ({ params: { userId } }: Params) => {

  const userData: Promise<User> = getUser(userId);
  const userPostsData: Promise<Post[]> = getUserPosts(userId);

  // const [user, userPosts] = await Promise.all([userData, userPostsData]);

  const user = await userData;

  if (!user.name) notFound();

  return (
    <>
      <h2>{user.name}</h2>
      <br/>
      <Suspense fallback={<h2>Loading...</h2>}>
        {/* <UserPosts posts={userPosts}/> */}
        <UserPosts promise={userPostsData}/>
      </Suspense>
    </>

  );
};

export default UserPage;
