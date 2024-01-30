import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import ProfileIcon from "./ProfileIcon";

const ChatCard = ({
  userName,
  userIcon,
  userLastMessage,
  lastTime,
  onPress,
}: any) => (
  <TouchableOpacity onPress={onPress} style={styles.container}>
    <ProfileIcon src={userIcon} />
    <View style={styles.textContainer}>
      <Text style={styles.userName}>{userName}</Text>
      <Text style={styles.userLastMessage}>{userLastMessage}</Text>
    </View>
    <Text style={styles.lastTime}>{lastTime}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    height: 80,
    borderBottomWidth: 0.7,
  },
  textContainer: {
    paddingLeft: 10,
  },
  userName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  userLastMessage: {
    fontSize: 14,
  },
  lastTime: {
    fontSize: 12,
    paddingLeft: "30%",
  },
});

export default ChatCard;
