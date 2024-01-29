// ChatScreen.tsx
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Image,
  StyleSheet,
  Modal,
} from "react-native";
import { createClient } from "@supabase/supabase-js";
import { Button } from "react-native";
import "react-native-url-polyfill/auto";

const supabase = createClient(
  "https://dkabcacfgilbdqnwnbzj.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRrYWJjYWNmZ2lsYmRxbnduYnpqIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTgyNDQ4NDQsImV4cCI6MjAxMzgyMDg0NH0.qE16p_x2DQXowW26cUFeD-SFLsVqXhz0_0hsxx4QYCU"
);


const MESSAGES_PAGE_SIZE = 10; // 一次加载的消息数量

const ChatScreen = ({
  userId,
  onBack,
}: {
  userId: number;
  onBack: () => void;
}) => {
  const [currentUser, setCurrentUser] = useState<any>({});
  const [messages, setMessages] = useState<Array<any>>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isSearchModalVisible, setSearchModalVisible] = useState(false);
  const [searchResults, setSearchResults] = useState<Array<any>>([]);
  const [selectedImageUrl, setSelectedImageUrl] = useState<string | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(
    null
  );
  const [messagesOffset, setMessagesOffset] = useState(0); // 新增：消息偏移量

  const fetchMessages = async () => {
    const loggedInUserId = 1;
    let { data: messagesData, error } = await supabase
      .from("messages")
      .select("*")
      .or(`sender_id.eq.${loggedInUserId},receiver_id.eq.${loggedInUserId}`)
      .or(`sender_id.eq.${userId},receiver_id.eq.${userId}`)
      .order("created_at", { ascending: false })
      .range(messagesOffset, messagesOffset + MESSAGES_PAGE_SIZE - 1);

    if (error) {
      console.error(error);
      return;
    }
    // 以逆序将新消息添加到列表前面
    setMessages(messagesData ? [...messagesData.reverse(), ...messages] : []);
  };


  useEffect(() => {
    fetchMessages();

    const fetchCurrentUser = async () => {
      let { data: userData, error } = await supabase
        .from("users")
        .select("*")
        .eq("id", userId)
        .single();
      if (error) {
        console.error(error);
        return;
      }
      setCurrentUser(userData);
    };

    fetchCurrentUser();
  }, [userId, messagesOffset]); // 添加 messagesOffset 作为依赖项

  const sendMessage = async () => {
    const loggedInUserId = 1;
    if (selectedImageUrl) {
      const { data, error } = await supabase.from("messages").insert([
        {
          sender_id: loggedInUserId,
          receiver_id: userId,
          body: selectedImageUrl,
          type: "img",
        },
      ]);

      if (error) {
        console.error(error);
      } else {
        setSelectedImageUrl(null);
        fetchMessages();
      }
    } else if (newMessage.trim() !== "") {
      const { data, error } = await supabase
        .from("messages")
        .insert([
          { sender_id: loggedInUserId, receiver_id: userId, body: newMessage },
        ]);

      if (error) {
        console.error(error);
      } else {
        setNewMessage("");
        fetchMessages();
      }
    }
  };

  const toggleSearchModal = () => {
    setSearchModalVisible(!isSearchModalVisible);
  };

  const handleSearchIcon = async (text: string) => {
    let token = ""; // Initialize token variable
    let responseData: any; // Declare responseData variable

    // Function to refresh the token
    const refreshAuthToken = async () => {
      const refreshUrl = "https://api.flaticon.com/v3/app/authentication";
      const refreshTokenBody = {
        apikey: "TzimrG6C73ZnuIkBmhMGVfrperbJzuhPuJrZHePoTdMAnDFS",
      };

      try {
        const response = await fetch(refreshUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(refreshTokenBody),
        });

        if (!response.ok) {
          throw new Error(`Error refreshing token: ${response.status}`);
        }

        responseData = await response.json();
        token = responseData.data.token;
      } catch (error) {
        console.error("Error refreshing token:", error);
      }
    };

    // Check if token is empty or expired
    if (!token || Date.now() >= 1000 * responseData.data.expires) {
      await refreshAuthToken(); // Refresh the token
    }

    const apiUrl = `https://api.flaticon.com/v3/search/icons/added?q=${text}&styleColor=black&styleShape=fill&limit=10`;

    try {
      const response = await fetch(apiUrl, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`Error during the request: ${response.status}`);
      }

      const data = await response.json();
      const images = data.data[0].images;
      const imageLinks = Object.values(images);
      setSearchResults(imageLinks);
    } catch (error) {
      console.error("Error during the fetch request:", error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Button title="Back" onPress={onBack} />
        {/* 添加一个返回按钮 */}
        <Image
          source={{ uri: currentUser.profile_picture }}
          style={styles.avatar}
        />
        <Text style={styles.username}>{currentUser.username}</Text>
      </View>
      <TouchableOpacity style={styles.searchBar} onPress={toggleSearchModal}>
        <Text>Search icon</Text>
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={isSearchModalVisible}
        onRequestClose={toggleSearchModal}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TextInput
              onChangeText={(text) => handleSearchIcon(text)}
              style={styles.searchInput}
              placeholder="Search..."
            />
            <TouchableOpacity
              onPress={toggleSearchModal}
              style={styles.closeButton}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
            <View style={styles.searchResults}>
              {searchResults.map((imageUrl, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.imageContainer,
                    index % 3 !== 0 ? styles.imageMargin : null,
                    selectedImageIndex === index
                      ? styles.selectedImageContainer
                      : null,
                  ]}
                  onPress={() => {
                    setSelectedImageIndex(index);
                    setSelectedImageUrl(searchResults[index]);
                  }}
                >
                  <Image source={{ uri: imageUrl }} style={styles.image} />
                </TouchableOpacity>
              ))}
            </View>
            {selectedImageIndex !== null && (
              <TouchableOpacity
                style={styles.sendButtonInModal}
                onPress={() => {
                  sendMessage();
                  setSelectedImageIndex(null);
                  setSelectedImageUrl(null);
                  setSearchResults([]);
                  toggleSearchModal();
                }}
              >
                <Text style={styles.sendButtonText}>Send</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </Modal>
      <FlatList
        data={messages}
        extraData={messages}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View
            style={[
              styles.message,
              item.sender_id === userId ? styles.received : styles.sent,
            ]}
          >
            {item.type === "img" ? (
              <Image source={{ uri: item.body }} style={styles.messageImage} />
            ) : (
              <Text style={styles.messageText}>{item.body}</Text>
            )}
          </View>
        )}
        onEndReached={() => setMessagesOffset(messagesOffset + MESSAGES_PAGE_SIZE)}
        onEndReachedThreshold={0.5}
        inverted
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
    backgroundColor: "#f5f5f5",
  },
  header: {
    flexDirection: "row",
    padding: 10,
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderBottomWidth: 1,
    borderBottomColor: "#e1e1e1",
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  username: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333333",
  },
  searchBar: {
    padding: 10,
    backgroundColor: "#ffffff",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    flex: 0.7,
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    width: "80%",
  },
  searchInput: {
    borderWidth: 1,
    borderColor: "#e1e1e1",
    padding: 10,
    borderRadius: 20,
    backgroundColor: "#ffffff",
    marginBottom: 10,
  },
  searchResults: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginTop: 10,
  },
  imageContainer: {
    width: "30%", // 3 images per row
    marginBottom: 10,
  },
  imageMargin: {
    marginRight: "3%", // Adjust margin between images
  },
  image: {
    width: "100%",
    height: 100,
    borderRadius: 10,
  },
  closeButton: {
    backgroundColor: "#3777f0",
    borderRadius: 20,
    paddingVertical: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  closeButtonText: {
    color: "#ffffff",
  },
  message: {
    padding: 10,
    borderRadius: 10,
    margin: 10,
    maxWidth: "75%",
  },
  messageText: {
    fontSize: 20, // 增加这个值以增大字体大小
  },
  received: {
    backgroundColor: "#ebebeb",
    alignSelf: "flex-start",
  },
  sent: {
    backgroundColor: "#d1edff",
    alignSelf: "flex-end",
  },
  inputContainer: {
    flexDirection: "row",
    padding: 10,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#e1e1e1",
    padding: 10,
    borderRadius: 20,
    backgroundColor: "#ffffff",
    marginRight: 10,
  },
  sendButton: {
    backgroundColor: "#3777f0",
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  sendButtonText: {
    color: "#ffffff",
  },

  messageImage: {
    width: 200,
    height: 200,
    borderRadius: 10,
  },
  selectedImageContainer: {
    borderColor: "#3777f0", // Add a colored border to the selected image
    borderWidth: 2,
  },
  sendButtonInModal: {
    backgroundColor: "#3777f0",
    borderRadius: 20,
    paddingVertical: 10,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },
});

export default ChatScreen;
