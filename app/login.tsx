import React from "react";
import { View, Text, StyleSheet, Image, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { FontAwesome } from "@expo/vector-icons"; // Import FontAwesome from Expo Icons
import CustomInput from "../components/CustomInput";
import CustomButton from "../components/CustomButton";
import { Link } from "expo-router";
const logo = require("../assets/images/easy.png");

export default function LoginScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Connexion</Text>
      <View style={styles.inputContainer}>
        <CustomInput placeholder="Email" />
        <CustomInput placeholder="Mot de passe" />
        <Text style={styles.forgotPasswordText}>Mot de passe oublié ?</Text>
      </View>
      <View style={styles.buttonContainer}>
        <Link href="/(tabs)" asChild>
          <CustomButton text="Se connecter" />
        </Link>
        <Text style={styles.registerText}>Pas de compte? Inscrivez-vous</Text>
      </View>
      <View style={styles.authContainer}>
        {renderAuthOption("google", "red", "Connexion avec Google")}
        {renderAuthOption(
          "phone",
          "blue",
          "Connexion avec votre numéro de téléphone"
        )}
      </View>
    </SafeAreaView>
  );
}

const renderAuthOption = (iconName: any, iconColor: string, text: string) => (
  <Pressable style={styles.authOption} key={iconName}>
    <FontAwesome name={iconName} size={24} color={iconColor} />
    <Text style={styles.authOptionText}>{text}</Text>
  </Pressable>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "white",
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    marginTop: 20,
  },
  inputContainer: {
    marginTop: 35,
    flex: 0.25,
    justifyContent: "space-between",
  },
  forgotPasswordText: {
    fontSize: 16,
    color: "#071091",
    fontWeight: "bold",
  },
  buttonContainer: {
    flex: 0.15,
    marginTop: 20,
    alignItems: "center",
  },
  registerText: {
    fontSize: 16,
    color: "#071091",
    fontWeight: "bold",
    marginTop: 15,
  },
  authContainer: {
    flex: 0.15,
    justifyContent: "flex-end",
    backgroundColor: "white",
    marginTop: 20,
    borderTopColor: "gray",
  },
  authOption: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10,
  },
  authOptionText: {
    fontSize: 16,
    marginLeft: 10,
    color: "black",
  },
});
