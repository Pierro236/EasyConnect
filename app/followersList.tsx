import React, { useEffect } from 'react'
import { View, ScrollView, Text } from 'react-native'
import { StyleSheet } from 'react-native'
import { createClient } from '@supabase/supabase-js';
import { useState } from 'react';
import { IUser } from '../types';
import FollowerCard from '../components/followerCard';

const supabase = createClient('https://dkabcacfgilbdqnwnbzj.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRrYWJjYWNmZ2lsYmRxbnduYnpqIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTgyNDQ4NDQsImV4cCI6MjAxMzgyMDg0NH0.qE16p_x2DQXowW26cUFeD-SFLsVqXhz0_0hsxx4QYCU');

type Props = {
    userId?: number;
    followersList?: boolean;
}

export default function followerList({followersList}: Props) {
const [followers, setFollowers] = useState<Array<IUser>>([]);
const userId = 1;

useEffect(() => {
  const fetchData = async () => {
    try {
      const { data: followersData, error } = await supabase
        .from('follows')
        .select('followed_user_id')
        .eq('following_user_id', userId);

      if (error) {
        throw error;
      }

      if (followersData) {
        const followerIds = followersData.map((follower: any) => follower.followed_user_id);

        if (followerIds.length > 0) {
          const { data: usersData, error: usersError } = await supabase
            .from('users')
            .select('id, name, profile_picture, username, description')
            .in('id', followerIds);

          if (usersError) {
            throw usersError;
          }

          if (usersData) {
            const usersArray: Array<IUser> = usersData.map((user: any) => ({
              id: user.id,
              name: user.name,
              profile_picture: user.profile_picture,
              username: user.username,
              description: user.description,
            }));

            setFollowers(usersArray);
            console.log(usersArray);
          }
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  fetchData();
}, [userId]);


  return (
    <View style={styles.container}>
    <ScrollView>
        {followers.map((follower) => (
            <View key={follower.id}>
                <FollowerCard 
                    name={follower.username}
                    certified={follower.certified}
                    imageSource={follower.profile_picture}
                    description={follower.description}
                    />
            </View>
        ))}
    </ScrollView>
  </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
})