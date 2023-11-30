import React from "react";
import { View, StyleSheet } from "react-native";
import PostCard from "./PostCard";
import { fakePostData } from "../data/post";
import { ScrollView } from "react-native-gesture-handler";
import Post from "./PostCard";

export default function RecentPosts() {
  const posts = fakePostData;
    return (
      <View style={styles.lowerHalf}>
        <ScrollView
        style={styles.postsContainer}
        showsVerticalScrollIndicator={false}
        horizontal={true}
      >
        {posts.map((post) => (
          <View key={post.id} style={styles.post}>
          <PostCard post={post} />
        </View>
        ))}
      </ScrollView>
        
      </View>
    );
  };

const styles = StyleSheet.create({
    lowerHalf: {
      flex: 1,
      backgroundColor: '#EAF2FF', // Adjust styling as needed
    },
    postsContainer: {
      flex: 0.95,
      paddingVertical: 10,
      paddingHorizontal: 10,
    },
    post: {
      marginRight: 10,
      width: 400,
    }
});

