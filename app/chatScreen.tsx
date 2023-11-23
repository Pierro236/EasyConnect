// ChatScreen.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, Image, StyleSheet } from 'react-native';
import { createClient } from '@supabase/supabase-js';
import { Button } from 'react-native';
import 'react-native-url-polyfill/auto';

const supabase = createClient('https://dkabcacfgilbdqnwnbzj.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRrYWJjYWNmZ2lsYmRxbnduYnpqIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTgyNDQ4NDQsImV4cCI6MjAxMzgyMDg0NH0.qE16p_x2DQXowW26cUFeD-SFLsVqXhz0_0hsxx4QYCU');


const ChatScreen = ({ userId , onBack}: { userId: number; onBack: () => void }) => {
  const [currentUser, setCurrentUser] = useState<any>({});
  const [messages, setMessages] = useState<Array<any>>([]);
  const [newMessage, setNewMessage] = useState('');

  const fetchMessages = async () => {
    const loggedInUserId = 1; // 假设已登录用户ID为1
    let { data: messagesData, error } = await supabase
      .from('messages')
      .select('*')
      .or(`sender_id.eq.${loggedInUserId},receiver_id.eq.${loggedInUserId}`)
      .or(`sender_id.eq.${userId},receiver_id.eq.${userId}`)
      .order('created_at', { ascending: true });
      
    if (error) {
      console.error(error);
      return;
    }
    setMessages(messagesData ?? []);
  };

  useEffect(() => {
    fetchMessages();

    const fetchCurrentUser = async () => {
      let { data: userData, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();
      if (error) {
        console.error(error);
        return;
      }
      setCurrentUser(userData);
    };

    fetchCurrentUser();
  }, [userId]);

  const sendMessage = async () => {
    const loggedInUserId = 1; // 假设已登录用户ID为1
    const { data, error } = await supabase
      .from('messages')
      .insert([
        { sender_id: loggedInUserId, receiver_id: userId, body: newMessage },
      ]);
  
    if (error) {
      console.error(error);
    } else {
      setNewMessage('');
      fetchMessages(); // 发送消息后重新获取消息列表
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        {/* <Button title="Back" onPress={onBack} /> 添加一个返回按钮 */}
        <Image source={{ uri: currentUser.profile_picture }} style={styles.avatar} />
        <Text style={styles.username}>{currentUser.username}</Text>
      </View>
      <FlatList
        data={messages}
        extraData={messages}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={[styles.message, item.sender_id === userId ? styles.received : styles.sent]}>
            <Text>{item.body}</Text>
          </View>
        )}
      />
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={newMessage}
          onChangeText={setNewMessage}
          placeholder="Type a message"
        />
        <TouchableOpacity onPress={sendMessage} style={styles.sendButton}>
          <Text style={styles.sendButtonText}>Send</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};


  
const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#f5f5f5',
    },
    header: {
      flexDirection: 'row',
      padding: 10,
      alignItems: 'center',
      backgroundColor: '#ffffff',
      borderBottomWidth: 1,
      borderBottomColor: '#e1e1e1',
    },
    avatar: {
      width: 40,
      height: 40,
      borderRadius: 20,
      marginRight: 10,
    },
    username: {
      fontSize: 18,
      fontWeight: 'bold',
      color: '#333333',
    },
    message: {
      padding: 10,
      borderRadius: 10,
      margin: 10,
      maxWidth: '75%',
    },
    received: {
      backgroundColor: '#ebebeb',
      alignSelf: 'flex-start',
    },
    sent: {
      backgroundColor: '#d1edff',
      alignSelf: 'flex-end',
    },
    inputContainer: {
      flexDirection: 'row',
      padding: 10,
    },
    input: {
      flex: 1,
      borderWidth: 1,
      borderColor: '#e1e1e1',
      padding: 10,
      borderRadius: 20,
      backgroundColor: '#ffffff',
      marginRight: 10,
    },
    sendButton: {
      backgroundColor: '#3777f0',
      borderRadius: 20,
      paddingVertical: 10,
      paddingHorizontal: 20,
      justifyContent: 'center',
      alignItems: 'center',
    },
    sendButtonText: {
      color: '#ffffff',
    },
  });
  
export default ChatScreen;