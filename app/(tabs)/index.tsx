import { StyleSheet, View, Text, ScrollView } from "react-native";
const testimage = require("../../assets/images/test.jpg");
import ProfileIcon from "../../components/ProfileIcon";
import Post from "../../components/PostCard";
import { SafeAreaView } from "react-native-safe-area-context";
import { createClient } from "@supabase/supabase-js";
import { useState, useEffect } from "react";
import { IPost } from "../../types/index";
import RecentPosts from "../../components/RecentPosts";

const supabase = createClient(
  "https://dkabcacfgilbdqnwnbzj.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRrYWJjYWNmZ2lsYmRxbnduYnpqIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTgyNDQ4NDQsImV4cCI6MjAxMzgyMDg0NH0.qE16p_x2DQXowW26cUFeD-SFLsVqXhz0_0hsxx4QYCU"
);

// MISSING: Do not show your own posts in feed.

export default function TabOneScreen() {
  const [posts, setPosts] = useState<IPost[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Step 1: Fetch all users
        const { data: userData, error: userError } = await supabase
          .from("users")
          .select("id, username, profile_picture, certified, description, name");

        if (userError) {
          throw userError;
        }

        if (userData) {
          // Step 2: Map users into a dictionary
          const userDictionary = userData.reduce((acc:any, user) => {
            acc[user.id] = user;
            return acc;
          }, {});

          // Step 3: Fetch posts
          const { data: postsData, error: postError } = await supabase
            .from("posts")
            .select("id, user_id, caption, image, title, created_at")
            .order("created_at", { ascending: false });

          if (postError) {
            throw postError;
          }

          if (postsData) {
            // Process posts and fill in user details
            const processedData = postsData.map((post) => ({
              id: post.id,
              title: post.title,
              caption: post.caption,
              image: post.image,
              createdAt: post.created_at,
              user_id: post.user_id,
                user: userDictionary[post.user_id as string] || {}, // Fill in user details
              time: post.created_at,
              likes: 0,
              comments: 0,
              liked: false,
              saved: false,
              ingredients: 'test',
            }));
            console.log(processedData);
            setPosts(processedData);
          }
        }
      } catch (error) {
        console.log(error);
      }
    };
    
    fetchData();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.addPostContainer}>
        <ProfileIcon src={testimage} />
        <Text style={styles.title}>Dis quelque chose...</Text>
      </View>
      <ScrollView
        style={styles.postsContainer}
        showsVerticalScrollIndicator={false}
      >
        <RecentPosts posts={posts}/>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#dbd7d7",
  },
  title: {
    fontSize: 17,
    fontWeight: "bold",
    paddingLeft: 10,
  },

  addPostContainer: {
    flex: 0.05,
    backgroundColor: "white",
    padding: 10,
    flexDirection: "row",
    alignItems: "center",
  },

  postsContainer: {
    flex: 0.95,
    paddingVertical: 10,
  },
});
