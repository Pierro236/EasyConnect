import { StyleSheet } from 'react-native';
import React, { useState, useEffect } from 'react';
import ProfileInfo from '../../components/ProfileInfo';
import RecentPosts from '../../components/RecentPosts';
import { View } from '../../components/Themed';
import { createClient } from '@supabase/supabase-js';
import 'react-native-url-polyfill/auto';
import { ScrollView } from 'react-native-gesture-handler';
import { IPost } from '../../types/index';
import { IUser } from '../../types/index';

const supabase = createClient('https://dkabcacfgilbdqnwnbzj.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRrYWJjYWNmZ2lsYmRxbnduYnpqIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTgyNDQ4NDQsImV4cCI6MjAxMzgyMDg0NH0.qE16p_x2DQXowW26cUFeD-SFLsVqXhz0_0hsxx4QYCU');

export default function Profile() {
  const [user, setUser] = useState<IUser | null>(null);
  const [followers, setFollowers] = useState<number>(0);
  const [following, setFollowing] = useState<number>(0);
  const [posts, setPosts] = useState<number>(0);
  const [postsData, setPostsData] = useState<IPost[]>([]);
  const userId = 1;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [userData, followersData, followingData, postsCount, postsData] =
          await Promise.all([
            supabase
              .from('users')
              .select('name, username, profile_picture, description')
              .eq('id', userId)
              .single(),
            supabase
              .from('follows')
              .select('followed_user_id')
              .eq('followed_user_id', userId),
            supabase
              .from('follows')
              .select('following_user_id')
              .eq('following_user_id', userId),
            supabase
              .from('posts')
              .select('user_id')
              .eq('user_id', userId),
            supabase
              .from('posts')
              .select('id, user_id, caption, image, title, created_at')
              .eq('user_id', userId)
              .order('created_at', { ascending: false }),
          ]);

        setUser(userData?.data as IUser | null);
        const followersArray = followersData?.data as { followed_user_id: any }[] | null;
        const followingArray = followingData?.data as { following_user_id: any }[] | null;
        const postsCountArray = postsCount?.data as { user_id: any }[] | null;

        setFollowers(followersArray ? followersArray.length : 0);
        setFollowing(followingArray ? followingArray.length : 0);
        setPosts(postsCountArray ? postsCountArray.length : 0);

        if (postsData?.data && user) {
          const postsDataArray = postsData.data as any[];
          const processedData = postsDataArray.map((post:any) => ({
            id: post.id,
            title: post.title,
            caption: post.caption,
            image: post.image,
            user_id: post.user_id,
            user: {
              id: user.id,
              username: user.username,
              image: user.profile_picture,
              certified: false,
              description: user.description,
              name: user.name,
            },
            time: post.created_at,
            likes: 0,
            comments: 0,
            liked: false,
            saved: false,
            ingredients: 'test',
          }));
          setPostsData(processedData);
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, [userId, user]);

  return (
    <View style={styles.container}>
      <ScrollView>
        <ProfileInfo
          name={user?.name}
          description={user?.description}
          imageSource={user?.profile_picture}
          followers={followers}
          following={following}
          posts={posts}
        />
        <RecentPosts posts={postsData} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
  });
