import React from "react";
import { TextInput, StyleSheet } from "react-native";

export default function CustomInput({
  placeholder,
  value,
  onChangeText,
  inputStyle,
  placeholderTextColor,
}: any) {
  return (
    <TextInput
      style={[styles.inputStyle, inputStyle]}
      placeholder={placeholder}
      value={value}
      onChangeText={onChangeText}
      placeholderTextColor={placeholderTextColor}
    />
  );
}

const styles = StyleSheet.create({
  inputStyle: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 10,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#ccc",
    height: 60,
  },
});
