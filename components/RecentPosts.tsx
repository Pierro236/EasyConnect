import React from "react";
import { View, StyleSheet, ScrollView, Dimensions } from "react-native";
import PostCard from "./PostCard";
import { fakePostData } from "../data/post";
import Post from "./PostCard";
import { useEffect, useState } from "react";
import { IPost } from "../types/index";
import CustomButton from "./CustomButton";

export interface RecentPostsProps {
  posts: IPost[];
}


export default function RecentPosts({ posts }: RecentPostsProps) {
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

  return (
    <View style={[styles.lowerHalf, !isSmallScreen && styles.smallScreenLowerHalf]}>
      <ScrollView
        style={styles.postsContainer}
        showsVerticalScrollIndicator={isSmallScreen}
        showsHorizontalScrollIndicator={!isSmallScreen}
        horizontal={!isSmallScreen}
      >
        { posts && (posts.map((post) => (
          <View
            key={post.id}
            style={[styles.post, isSmallScreen && styles.smallScreenPost]}
          >
            <PostCard post={post} />
          </View>
        )))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  lowerHalf: {
    backgroundColor: "#EAF2FF",
  },
  postsContainer: {
    flex: 0.95,
    paddingVertical: 10,
    paddingHorizontal: 10,
    paddingBottom: 150,
  },
  post: {
    marginRight: 10,
    width: 400,
  },
  smallScreenPost: {
    width: "100%",
  },
  smallScreenLowerHalf: {
    flex: 1,
    backgroundColor: "#EAF2FF",
  },
});