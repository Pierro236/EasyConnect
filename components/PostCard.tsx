import {
  View,
  Text,
  StyleSheet,
  Image,
  ImageBackground,
  TouchableOpacity,
  Pressable,
} from "react-native";
import React, { useEffect, useState } from "react";
import { FontAwesome, MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { Audio } from "expo-av";
import ProfileIcon from "./ProfileIcon";

// In reality, I will only retrieve the Post Id and process everything here

const Post = ({ post }: any) => {
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const [numberOflikes, setNumberOflikes] = useState(0);

  if (!post) return <View style={styles.skeletonPost} />;

  useEffect(() => {
    if (post) {
      setLiked(post.liked);
      setSaved(post.saved);
      setNumberOflikes(post.likes);
    }
  }, [post.id]);

  const handleLiked = async () => {
    setLiked(!liked);
    setNumberOflikes((nl) => (liked ? nl - 1 : nl + 1));
    const sound = await Audio.Sound.createAsync(
      require("../assets/sounds/facebook_likes.mp3")
    );
    liked ? sound.sound.stopAsync : await sound.sound.playAsync();
  };
  const handleSaved = () => {
    setSaved(!saved);
  };
  return (
    <View style={styles.container}>
      <View style={styles.postHeader}>
        <Pressable style={styles.postHeaderUser}>
          <ProfileIcon src={post.user.image} />
          <Text style={{ fontSize: 18, fontWeight: "700" }}>
            {post.user.username}
          </Text>
          {post.user.certified && (
            <MaterialCommunityIcons
              name="check-decagram"
              size={16}
              color="#579AF5"
              style={{ marginLeft: -2 }}
            />
          )}
        </Pressable>
        <FontAwesome
          name={saved ? "bookmark" : "bookmark-o"}
          size={24}
          color="black"
          onPress={handleSaved}
        />
      </View>
      <View style={styles.postContent}>
        <Text style={{ fontSize: 20, fontFamily: "Arial" }}>
          {post.caption}
        </Text>
      </View>
      <ImageBackground
        source={post.image}
        style={styles.post}
      ></ImageBackground>
      <View style={styles.postFooter}>
        <Pressable style={styles.postFooterItem} onPress={handleLiked}>
          <FontAwesome
            name={liked ? "heart" : "heart-o"}
            color={liked ? "red" : "black"}
            size={24}
          />
          <Text style={styles.postFooterItemText}>{numberOflikes} J'aime</Text>
        </Pressable>
        <View style={styles.postFooterItem}>
          <TouchableOpacity style={styles.postFooterItem}>
            <Text style={{ fontFamily: "Arial", fontSize: 18 }}>
              {post.comments} commentaires
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default Post;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginBottom: 10,
    backgroundColor: "white",
  },
  skeletonPost: {
    height: 400,
    width: "100%",
    backgroundColor: "lightgrey",
    marginBottom: 10,
  },
  post: {
    height: 350,
    width: "100%",
  },
  postContent: {
    height: "auto",
    marginBottom: 10,
    paddingLeft: 10,
  },
  postHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
  },
  postHeaderUser: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
  },
  postFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
  },
  postUserPhoto: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  postFooterItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  postFooterItemText: {
    fontSize: 18,
    fontWeight: "500",
    fontFamily: "Arial",
  },
});
