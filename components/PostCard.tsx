import {
  View,
  Text,
  StyleSheet,
  Image,
  ImageBackground,
  TouchableOpacity,
  Pressable,
  Button,
  TextInput,
} from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import { FontAwesome, MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { Audio } from "expo-av";
import ProfileIcon from "./ProfileIcon";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://dkabcacfgilbdqnwnbzj.supabase.co";
const SUPABASE_PUBLIC_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRrYWJjYWNmZ2lsYmRxbnduYnpqIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTgyNDQ4NDQsImV4cCI6MjAxMzgyMDg0NH0.qE16p_x2DQXowW26cUFeD-SFLsVqXhz0_0hsxx4QYCU";
const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLIC_KEY);

type Comment = {
  id: number;
  user_id: number;
  post_id: number;
  content: string;
  created_at: string; 
};

// In reality, I will only retrieve the Post Id and process everything here

const Post = ({ post }: any) => {
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const [numberOflikes, setNumberOflikes] = useState(0);
  const [comments, setComments] = useState<Comment[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [newComment, setNewComment] = useState('');
  const [showComments, setShowComments] = useState(false);

  if (!post) return <View style={styles.skeletonPost} />;

  useEffect(() => {
    if (post) {
      setLiked(post.liked);
      setSaved(post.saved);
      setNumberOflikes(post.likes);
    }
  }, [post.id]);

  const fetchComments = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('comments')
        .select('*')
        .eq('post_id', post.id)
        .order('created_at', { ascending: false })
        .range(0, 15); // 获取前15条评论

      if (error) throw error;
      if (data) setComments(data);
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  }, [post.id]);

  const handleCommentSubmit = useCallback(async () => {
    // 提交评论的逻辑
    try {
      const { data, error } = await supabase
        .from('comments')
        .insert([{ post_id: post.id, user_id: 1, content: newComment }]); // 使用了固定的 user_id

      if (error) throw error;
      if (data) {
        //setComments([data[0], ...comments]);
        setNewComment('');
        fetchComments(); // 提交后立即更新评论列表
      }
    } catch (error) {
      console.error('Error submitting comment:', error);
    }
  }, [newComment, post.id, fetchComments]);

  const toggleComments = () => {
    setShowComments(!showComments);
    if (!showComments) {
      fetchComments();
    }
  };

  // const CommentSection = () => {
  //   return (
  //     <View>
  //       <TextInput
  //         style={{ fontFamily: "Arial", fontSize: 20 }}
  //         value={newComment}
  //         onChangeText={setNewComment}
  //         placeholder="Ecrire un commentaire..."
  //       />
  //       <TouchableOpacity onPress={handleCommentSubmit} style={styles.postFooterItem}>
  //         <Button title="Submit" onPress={handleCommentSubmit} />
  //       </TouchableOpacity>
  //       {comments.map((comment) => (
  //         <View key={comment.id}>
  //           <Text style={{ fontFamily: "Arial", fontSize: 18 }}>{comment.content}</Text>
  //         </View>
  //       ))}
  //     </View>
  //   );
  // };
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
      {post.image && (
        <ImageBackground
          source={{ uri: post.image }}
          style={styles.post}
        ></ImageBackground>
      )}
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
          <TouchableOpacity onPress={toggleComments} style={styles.postFooterItem}>
            <Text style={{ fontFamily: "Arial", fontSize: 18 }}>
              commentaires
            </Text>
          </TouchableOpacity>
        </View>

      </View>
      {showComments && 
          <View>
          <TextInput
            style={{ fontFamily: "Arial", fontSize: 20 }}
            value={newComment}
            onChangeText={setNewComment}
            placeholder="Ecrire un commentaire..."
          />
          <TouchableOpacity onPress={handleCommentSubmit} style={styles.postFooterItem}>
            <Button title="Submit" onPress={handleCommentSubmit} />
          </TouchableOpacity>
          {comments.map((comment) => (
            <View key={comment.id}>
              <Text style={{ fontFamily: "Arial", fontSize: 18 }}>{comment.content}</Text>
            </View>
          ))}
        </View>
      }
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
