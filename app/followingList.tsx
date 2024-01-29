import React, { useEffect } from 'react'
import { View, ScrollView, Dimensions } from 'react-native'
import { StyleSheet } from 'react-native'
import { createClient } from '@supabase/supabase-js';
import { useState } from 'react';
import { IUser } from '../types';
import FollowerCard from '../components/FollowerCard';

const supabase = createClient('https://dkabcacfgilbdqnwnbzj.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRrYWJjYWNmZ2lsYmRxbnduYnpqIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTgyNDQ4NDQsImV4cCI6MjAxMzgyMDg0NH0.qE16p_x2DQXowW26cUFeD-SFLsVqXhz0_0hsxx4QYCU');

type Props = {
    userId?: number;
    followersList?: boolean;
}

export default function followingList({followersList}: Props) {
    const [isSmallScreen, setIsSmallScreen] = useState(false);

    useEffect(() => {
      const checkScreenSize = () => {
        const { width } = Dimensions.get("window");
        setIsSmallScreen(width < 600);
      };
  
      checkScreenSize();
  
      const resizeListener = Dimensions.addEventListener(
        "change",
        checkScreenSize
      );
  
      return () => {
        resizeListener.remove();
      };
    }, []);

const [followers, setFollowers] = useState<Array<IUser>>([]);
const userId = 1;
followersList = true;
useEffect(() => {
  const fetchData = async () => {
    try {
      const { data: followersData, error } = await supabase
        .from('follows')
        .select('following_user_id')
        .eq('followed_user_id', userId);

      if (error) {
        throw error;
      }

      if (followersData) {
        const followerIds = followersData.map((follower: any) => follower.following_user_id);

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
    <ScrollView style={[styles.followersTable, isSmallScreen ? { paddingHorizontal: 10 } : { paddingHorizontal: 60 }]}>
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
    backgroundColor: '#EAF2FF',
  },
    followersTable: {
        flex: 1,
        paddingVertical: 30,
    },
})