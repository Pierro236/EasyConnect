import React from "react";
import { View, Text, StyleSheet, Image, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { FontAwesome5, FontAwesome } from "@expo/vector-icons";
import BenefitItem from "../components/BenefitItem";
import { TouchableOpacity } from "react-native-gesture-handler";
const logo = require("../assets/images/easy.png");

const benefits = [
  {
    id: 1,
    title: "Rencontrer de nouvelles personnes",
    icon: <FontAwesome5 name="user-friends" size={24} color="black" />,
  },
  {
    id: 2,
    title: "Partager des expériences",
    icon: <FontAwesome name="picture-o" size={24} color="black" />,
  },
  {
    id: 3,
    title: "Trouver du soutien",
    icon: <FontAwesome5 name="hands-helping" size={24} color="black" />,
  },
];

export default function Home() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.logoContainer}>
        <Image style={styles.logoImage} source={logo} />
        <Text style={styles.logoText}>Bienvenue sur Easy Connect</Text>
        <Text style={styles.subText}>
          L'application qui te connecte facilement avec tes amis
        </Text>
      </View>
      <View style={styles.descriptionContainer}>
        <Text style={styles.descriptionTitle}>Easy Connect te permet de :</Text>
        {benefits.map((benefit) => (
          <BenefitItem
            key={benefit.id}
            title={benefit.title}
            icon={benefit.icon}
          />
        ))}
      </View>
      <View style={styles.buttonsContainer}>
        <TouchableOpacity style={styles.buttonStyle}>
          <Text style={styles.buttonText}>Créer un compte</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.buttonStyle}>
          <Text style={styles.buttonText}>Se connecter</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  logoContainer: {
    flex: 0.5,
    justifyContent: "center",
    alignItems: "center",
  },
  logoImage: {
    height: "60%",
    width: "60%",
  },
  logoText: {
    fontWeight: "bold",
    fontSize: 28,
    paddingTop: 10,
  },
  subText: {
    fontSize: 15,
    paddingTop: 17,
  },
  descriptionContainer: {
    flex: 0.2,
  },
  descriptionTitle: {
    fontWeight: "bold",
    fontSize: 20,
    paddingTop: 17,
    paddingBottom: 10,
  },
  buttonsContainer: {
    marginTop: 25,
    flex: 0.2,
    justifyContent: "space-between",
  },
  buttonStyle: {
    backgroundColor: "#071091",
    borderRadius: 18,
    padding: 10,
    alignItems: "center",
    height: "65%",
    justifyContent: "center",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 18,
  },
});
