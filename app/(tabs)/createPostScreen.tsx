import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { createClient } from '@supabase/supabase-js';

// 这里应该使用您自己的Supabase URL和公钥
const SUPABASE_URL = 'https://dkabcacfgilbdqnwnbzj.supabase.co';
const SUPABASE_PUBLIC_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRrYWJjYWNmZ2lsYmRxbnduYnpqIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTgyNDQ4NDQsImV4cCI6MjAxMzgyMDg0NH0.qE16p_x2DQXowW26cUFeD-SFLsVqXhz0_0hsxx4QYCU';
const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLIC_KEY);

const CreatePostScreen = () => {
  const [title, setTitle] = useState('');
  const [caption, setCaption] = useState('');
  const [userId, setUserId] = useState(1); // 这里应该是从登录状态获取的用户ID

  const handlePostSubmit = async () => {
    // 发送数据到Supabase的'posts'表
    const { data, error } = await supabase
      .from('posts')
      .insert([
        {
          title,
          caption,
          user_id: userId, // 这应该是当前登录用户的ID
          // image字段留空，实现图片上传需要更复杂的逻辑
        },
      ]);

    if (error) {
      Alert.alert('Error', error.message);
    } else {
      Alert.alert('Success', 'Post created successfully');
      // 清除表单
      setTitle('');
      setCaption('');
      // 添加其他逻辑，如跳转到帖子列表页面
    }
  };

  return (
    <View style={styles.container}>
      <Text>Title</Text>
      <TextInput
        style={styles.input}
        value={title}
        onChangeText={setTitle}
        placeholder="Enter the title of the post"
      />
      <Text>Caption</Text>
      <TextInput
        style={styles.input}
        value={caption}
        onChangeText={setCaption}
        placeholder="What's on your mind?"
        multiline
      />
      {/* 图片上传逻辑将在这里实现 */}
      <Button title="Submit Post" onPress={handlePostSubmit} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    width: '100%',
    marginVertical: 10,
    padding: 8,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 4,
  },
});

export default CreatePostScreen;
