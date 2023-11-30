import React from "react";
import { View, TouchableOpacity, StyleSheet, Text, ViewStyle } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export interface FloatingButtonProps {
    onPress: () => void;
    icon: React.ComponentProps<typeof Ionicons>["name"];
    buttonStyle?: ViewStyle;
    }

const FloatingButton = ({ onPress, icon, buttonStyle}: FloatingButtonProps) => {
  return (
      <TouchableOpacity style={[styles.button, buttonStyle]} onPress={onPress}>
        <Ionicons name={icon} size={24} color="white" /> 
      </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#071091",
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 50,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
});

export default FloatingButton;
