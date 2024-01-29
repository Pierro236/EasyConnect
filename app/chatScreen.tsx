// ChatScreen.tsx
import React, { useState, useEffect, memo } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Image,
  StyleSheet,
  Modal,
  KeyboardAvoidingView,
} from "react-native";
import { createClient } from "@supabase/supabase-js";
import { Button } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import "react-native-url-polyfill/auto";
import ProfileIcon from "../components/ProfileIcon";
const testimage = require("../assets/images/test.jpg");

const supabase = createClient(
  "https://dkabcacfgilbdqnwnbzj.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRrYWJjYWNmZ2lsYmRxbnduYnpqIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTgyNDQ4NDQsImV4cCI6MjAxMzgyMDg0NH0.qE16p_x2DQXowW26cUFeD-SFLsVqXhz0_0hsxx4QYCU"
);

const MESSAGES_PAGE_SIZE = 10; // 一次加载的消息数量

const ChatScreen = memo(
  ({ userId, onBack }: { userId: number; onBack: () => void }) => {
    const [currentUser, setCurrentUser] = useState<any>({});
    const [messages, setMessages] = useState<Array<any>>([]);
    const [newMessage, setNewMessage] = useState("");
    const [loadedIcons, setLoadedIcons] = useState<Set<number>>(new Set());
    const [isSearchModalVisible, setSearchModalVisible] = useState(false);
    const [selectedImageUrl, setSelectedImageUrl] = useState<string | null>(
      null
    );
    const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(
      null
    );
    const [iconsData, setIconsData] = useState<Array<any>>([]);
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

    const fetchIcons = async (parentId?: number) => {
      let { data: Icons, error } = await supabase.from("icons").select("*");

      if (error) {
        console.error(error);
        return;
      }

      if (Icons) {
        const filteredIcons = parentId
          ? Icons.filter((icon) => icon.parent_id === parentId && icon.isDir)
          : Icons.filter((icon) => icon.isDir);

        setIconsData(filteredIcons ?? []);
      }
    };

    const loadAssociatedIcons = async (parentId: number) => {
      if (!loadedIcons.has(parentId)) {
        const { data: associatedItems, error } = await supabase
          .from("icons")
          .select("*")
          .eq("parent_id", parentId);

        if (error) {
          console.error(error);
          return;
        }

        setIconsData(associatedItems ?? []);
        setLoadedIcons(new Set(loadedIcons).add(parentId));
      }
    };

    const resetIcons = async () => {
      await fetchIcons();
      setLoadedIcons(new Set());
    };

    const handleIconPress = async (item: any, index: number) => {
      if (item.isDir) {
        await loadAssociatedIcons(item.id);
      } else {
        setNewMessage(newMessage + " " + item.name);
        setSelectedImageIndex(index);
        setSelectedImageUrl(item.link);
      }
    };

    const handleBackPress = async () => {
      setNewMessage("");
      setSelectedImageIndex(null);
      setSelectedImageUrl(null);
      await resetIcons();
    };

    useEffect(() => {
      fetchMessages();
      if (userId) {
        fetchMessages();
        fetchCurrentUser();
        fetchIcons();
      }
    }, [userId, messagesOffset]);

    const sendMessage = async () => {
      const loggedInUserId = 1;
      // if (selectedImageUrl) {
      //   const { data, error } = await supabase.from("messages").insert([
      //     {
      //       sender_id: loggedInUserId,
      //       receiver_id: userId,
      //       body: selectedImageUrl,
      //       type: "img",
      //     },
      //   ]);

      //   if (error) {
      //     console.error(error);
      //   } else {
      //     setSelectedImageUrl(null);
      //     fetchMessages();
      //   }
      if (newMessage.trim() !== "") {
        const { data, error } = await supabase.from("messages").insert([
          {
            sender_id: loggedInUserId,
            receiver_id: userId,
            body: newMessage,
          },
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

    return (
      <KeyboardAvoidingView enabled={true} style={styles.container}>
        <View style={styles.header}>
          <Button title="Back" onPress={onBack} />
          <ProfileIcon src={currentUser.profile_picture} />
          <Text style={styles.username}>{currentUser.username}</Text>
        </View>
        <TouchableOpacity style={styles.searchBar} onPress={toggleSearchModal}>
          <Text>Ecris avec des icones...</Text>
        </TouchableOpacity>

        <Modal
          animationType="slide"
          transparent={true}
          visible={isSearchModalVisible}
          onRequestClose={toggleSearchModal}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <TextInput style={styles.searchInput} value={newMessage} />
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => {
                  let trimmedMessage = newMessage.trim();
                  if (trimmedMessage) {
                    const words = trimmedMessage.split(" ");
                    words.pop();
                    const newTrimmedMessage = words.join(" ");
                    setNewMessage(newTrimmedMessage);
                    setSelectedImageIndex(null);
                    setSelectedImageUrl(null);
                  }
                }}
              >
                <Text style={styles.closeButtonText}>Supprimer</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  toggleSearchModal();
                  setNewMessage("");
                }}
                style={styles.closeButton}
              >
                <Text style={styles.closeButtonText}>Fermer</Text>
              </TouchableOpacity>
              <View style={styles.searchResults}>
                <TouchableOpacity
                  onPress={handleBackPress}
                  style={styles.closeButton}
                >
                  <Ionicons name="arrow-back" size={24} color="white" />
                </TouchableOpacity>
                <FlatList
                  showsVerticalScrollIndicator={false}
                  data={iconsData}
                  numColumns={3} // Nombre d'éléments par ligne
                  keyExtractor={(item) => item.id.toString()}
                  renderItem={({ item, index }) => (
                    <TouchableOpacity
                      key={index}
                      onPress={handleIconPress.bind(this, item, index)}
                      style={[
                        styles.imageContainer,
                        selectedImageIndex === index
                          ? styles.selectedImageContainer
                          : null,
                        item.isDir ? { backgroundColor: "#ffffff" } : null,
                      ]}
                    >
                      <Image source={{ uri: item.link }} style={styles.image} />
                      <Text>{item.name}</Text>
                    </TouchableOpacity>
                  )}
                />
              </View>
              {selectedImageIndex !== null && (
                <TouchableOpacity
                  style={styles.sendButtonInModal}
                  onPress={() => {
                    setSelectedImageIndex(null);
                    setSelectedImageUrl(null);
                    toggleSearchModal();
                  }}
                >
                  <Text style={styles.sendButtonText}>Confirmer</Text>
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
                styles.messageContainer,
                item.sender_id === userId
                  ? { alignSelf: "flex-start" }
                  : { alignSelf: "flex-end" },
              ]}
            >
              {item.sender_id === userId ? (
                <ProfileIcon src={currentUser.profile_picture} />
              ) : null}
              <View
                style={[
                  styles.message,
                  item.sender_id === userId ? styles.received : styles.sent,
                ]}
              >
                {item.type === "img" ? (
                  <Image
                    source={{ uri: item.body }}
                    style={styles.messageImage}
                  />
                ) : (
                  <Text style={styles.messageText}>{item.body}</Text>
                )}
              </View>
              {item.sender_id !== userId ? (
                <ProfileIcon src={currentUser.profile_picture} />
              ) : null}
            </View>
          )}
          onEndReached={() => setMessagesOffset(messagesOffset + MESSAGES_PAGE_SIZE)} // 下拉到底部时增加消息偏移量
          onEndReachedThreshold={0.5} // 当距离底部还有一半时开始加载
          inverted // 逆序排列消息
        />

        <KeyboardAvoidingView enabled={true} style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={newMessage}
            onChangeText={setNewMessage}
            placeholder="Type a message"
          />
          <TouchableOpacity onPress={sendMessage} style={styles.sendButton}>
            <Text style={styles.sendButtonText}>Send</Text>
          </TouchableOpacity>
        </KeyboardAvoidingView>
      </KeyboardAvoidingView>
    );
  }
);

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
    flex: 0.8,
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    width: "95%",
  },
  searchInput: {
    borderWidth: 1,
    borderColor: "#e1e1e1",
    padding: 10,
    borderRadius: 20,
    backgroundColor: "#ffffff",
    marginBottom: 10,
    height: 60,
  },
  searchResults: {
    flex: 1,
    flexDirection: "column",
    marginTop: 10,
    backgroundColor: "#ebebeb",
    padding: 10,
  },
  flatListContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  imageContainer: {
    width: "32%", // 3 images per row
    marginBottom: 10,
    alignItems: "center",
    backgroundColor: "#ebebeb",
    padding: 2,
    marginRight: 10,
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
    marginVertical: 10,
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
    backgroundColor: "#ffffff",
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
  messageContainer: {
    flexDirection: "row", // Horizontal layout for icon and message // Align items vertically in the center
    marginVertical: 5,
    alignItems: "center", // Adjust the vertical margin as needed
  },
});

export default ChatScreen;
