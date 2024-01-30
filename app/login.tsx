import React, { useState } from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { FontAwesome } from "@expo/vector-icons";
import { createClient } from "@supabase/supabase-js";
import CustomInput from "../components/CustomInput";
import CustomButton from "../components/CustomButton";
import { router } from 'expo-router';


const supabase = createClient(
  "https://dkabcacfgilbdqnwnbzj.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRrYWJjYWNmZ2lsYmRxbnduYnpqIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTgyNDQ4NDQsImV4cCI6MjAxMzgyMDg0NH0.qE16p_x2DQXowW26cUFeD-SFLsVqXhz0_0hsxx4QYCU"
);

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState<string>(""); 
  const [user, setUser] = useState(null);

  const handleLogin = async () => {
    try {
      const { data, error } = await supabase
        .from("users")
        .select("password")
        .eq("username", email)
        .single();
        
      if (data) {
        if (data.password === password) {
          console.log("Login successful: Vous êtes connecté");
          router.replace('/(tabs)');
        } else {
          console.warn("Incorrect password: Mot de passe incorrect");
        }
      } else {
        console.warn("User not found: Utilisateur non trouvé");
      }
    } catch (error) {
      console.error("Unexpected error:", error);
    }
  };
  

  return (
    <SafeAreaView style={styles.container}>
      {/* ...other JSX code */}
      <View style={styles.inputContainer}>
        <CustomInput
          placeholder="Email"
          value={email}
          onChangeText={(text:string) => setEmail(text)}
        />
        <CustomInput
          placeholder="Mot de passe"
          secureTextEntry
          value={password}
          onChangeText={(text:string) => setPassword(text)}
        />
        <Text style={styles.forgotPasswordText}>Mot de passe oublié ?</Text>
      </View>
      <View style={styles.buttonContainer}>
        <Pressable>
          <CustomButton onPress={handleLogin} text="Se connecter" />
        </Pressable>
        <Text style={styles.registerText}>Pas de compte? Inscrivez-vous</Text>
      </View>
      {/* ...other JSX code */}
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
