import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";

const ProfileIcon = ({ src }: any) => (
  <View style={styles.container}>
    <Image source={src} style={styles.image} />
  </View>
);

const styles = StyleSheet.create({
  container: {
    width: 45,
    height: 45,
    borderRadius: 50,
  },
  image: {
    objectFit: "cover",
    height: "100%",
    width: "100%",
    borderRadius: 50,
  },
});

export default ProfileIcon;
