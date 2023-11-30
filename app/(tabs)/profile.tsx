import { StyleSheet } from 'react-native';
import React, { useState, useEffect } from 'react';
import EditScreenInfo from '../../components/EditScreenInfo';
import ProfileInfo from '../../components/ProfileInfo';
import RecentPosts from '../../components/RecentPosts';
import { Text, View } from '../../components/Themed';
import { createClient } from '@supabase/supabase-js';
import 'react-native-url-polyfill/auto';
import { ScrollView } from 'react-native-gesture-handler';

export interface IUser {
  profile_picture: string,
  username: string,
  name: string,
  description: string,
}

const supabase = createClient('https://dkabcacfgilbdqnwnbzj.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRrYWJjYWNmZ2lsYmRxbnduYnpqIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTgyNDQ4NDQsImV4cCI6MjAxMzgyMDg0NH0.qE16p_x2DQXowW26cUFeD-SFLsVqXhz0_0hsxx4QYCU');

export default function Profile() {
  const [user, setUser] = useState<IUser | null>(null)
  const [followers, setFollowers] = useState<number>(0)
  const [following, setFollowing] = useState<number>(0)
  const [posts, setPosts] = useState<number>(0)
  const userId = 1

  useEffect(() => {
    const fetchUser = async () => {
      let { data: userData, error } = await supabase
        .from('users')
        .select('name, username, profile_picture, description')
        .eq('id', userId)
        .single();
      if (error) {
        console.error(error);
        return;
      }
      setUser(userData);
    };

    const fetchFollowers = async () => {
      let { data: followersData, error } = await supabase
        .from('follows')
        .select('followed_user_id')
        .eq('followed_user_id', userId);
      if (error) {
        console.error(error);
        return;
      }
      if (followersData) {
        setFollowers(followersData.length);
      }
    };

    const fetchFollowing = async () => {
      let { data: followingData, error } = await supabase
        .from('follows')
        .select('following_user_id')
        .eq('following_user_id', userId);
      if (error) {
        console.error(error);
        return;
      }
      if (followingData) {
        setFollowing(followingData.length);
      }
    };

    const fetchPosts = async () => {
      let { data: postsData, error } = await supabase
        .from('posts')
        .select('user_id')
        .eq('user_id', userId);
      if (error) {
        console.error(error);
        return;
      }
      if (postsData) {
        setPosts(postsData.length);
      }
    };

    fetchUser();
    fetchFollowers();
    fetchFollowing();
    fetchPosts();

  }, [userId]);

  return (
    <View style={styles.container}>
      <ScrollView>
      <ProfileInfo name={user?.name} description={user?.description} imageSource={user?.profile_picture} followers={followers} following={following} posts={posts}/>
      <RecentPosts />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
  });
