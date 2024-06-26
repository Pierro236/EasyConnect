import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  Image,
} from "react-native";
import { createClient } from "@supabase/supabase-js";
import * as ImagePicker from "expo-image-picker";
import CustomButton from "../../components/CustomButton";


const SUPABASE_URL = "https://dkabcacfgilbdqnwnbzj.supabase.co";
const SUPABASE_PUBLIC_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRrYWJjYWNmZ2lsYmRxbnduYnpqIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTgyNDQ4NDQsImV4cCI6MjAxMzgyMDg0NH0.qE16p_x2DQXowW26cUFeD-SFLsVqXhz0_0hsxx4QYCU";
const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLIC_KEY);

const CreatePostScreen = () => {
  const [title, setTitle] = useState("");
  const [caption, setCaption] = useState("");
  const [userId, setUserId] = useState(1); // 这里应该是从登录状态获取的用户ID
  const [imageUri, setImageUri] = useState<string | null>(null);

  // ...

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      alert("Sorry, we need camera roll permissions to make this work!");
      return;
    }
    let result: ImagePicker.ImagePickerResult =
      await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

    if (!result.canceled && result.assets.length > 0) {
      setImageUri(result.assets[0].uri);
      console.log("Selected image URI:", result.assets[0].uri);
    }
  };

  const uploadImage = async (uri: RequestInfo) => {
    console.log("uploadImage called with URI:", uri);
    const imageName = `posts/${Date.now()}-${userId}`; // 使用时间戳和用户ID为图片命名
    const response = await fetch(uri);
    const blob = await response.blob();
    console.log("uploadImage called with blob", blob);
    const { data, error } = await supabase.storage
      .from("posts-images")
      .upload(imageName, blob);

    if (error) {
      console.log("Upload error", error);
      Alert.alert("Upload error", error.message);
      throw new Error("Failed to upload image");
    } else {
      console.log("Upload success", data);
    }

    // 返回图片的URL
    return `${SUPABASE_URL}/storage/v1/object/public/posts-images/${imageName}`;
  };

  const handlePostSubmit = async () => {
    // 发送数据到Supabase的'posts'表
    try {
      let imageUrl = "";
      if (imageUri) {
        imageUrl = await uploadImage(imageUri);
      }

      const { data, error } = await supabase.from("posts").insert([
        {
          title,
          caption,
          user_id: userId, // 这应该是当前登录用户的ID
          image: imageUrl, // 保存图片的URL
        },
      ]);

      if (error) {
        throw error;
      }
      Alert.alert("Success", "Post created successfully");
      // 清除表单
      setTitle("");
      setCaption("");
      setImageUri(null);
      // 添加其他逻辑，如跳转到帖子列表页面
    } catch (error: unknown) {
      let message = "An unexpected error occurred";
      if (error instanceof Error) {
        message = error.message;
      }
      Alert.alert("Error", message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={{fontSize: 28, fontWeight: "700"}}>Title</Text>
      <TextInput
        style={styles.input}
        value={title}
        onChangeText={setTitle}
        placeholder="Enter the title of the post"
      />
      <Text style={{fontSize: 28, fontWeight: "700"}}>Caption</Text>
      <TextInput
        style={styles.input}
        value={caption}
        onChangeText={setCaption}
        placeholder="What's on your mind?"
        multiline
      />
  <CustomButton buttonStyle={{marginTop:15}} onPress={pickImage} text="Selectioner une image" />
  {imageUri && (
    <Image source={{ uri: imageUri }} style={{ width: 200, height: 200 }} />
  )}
  <CustomButton buttonStyle={{marginTop:10}} onPress={handlePostSubmit} text="Publier" />

      
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: '#EAF2FF',
  },
  input: {
    width: "100%",
    marginVertical: 10,
    padding: 15,
    borderWidth: 1,
    borderColor: "#ccc",
    backgroundColor: "white",
    borderRadius: 12,
    fontSize: 20,
  },
  inputStyle: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 10,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#ccc",
    height: 60,
  },
  image: {
    width: 200,
    height: 200,
    marginVertical: 10,
  },
});

export default CreatePostScreen;
