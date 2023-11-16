import React from "react";
import { View, Text, StyleSheet, Button } from "react-native";
import Avatar from "./Avatar";
import StatsCard from "./StatsCard";
import CustomButton from "./CustomButton";

interface ProfileInfoProps {
  name: string;
  description?: string;
}

const ProfileInfo: React.FC<ProfileInfoProps> = ({ name, description }) => {
  return (
    <View style={styles.container}>
      <View style={styles.additionalInformation}>
        <View style={styles.userInformation}>
          <Text style={styles.title}>Bonjour, je m'apelle {name}</Text>
          <Text style={styles.description}>{description}</Text>
        </View>
        <StatsCard followers={0} following={0} posts={0} />
        <View style={styles.buttonContainer}>
          <View style={styles.buttonChildren}>
            <CustomButton
              text="Modifier mon profil"
              onPress={() => console.log("Follow")}
              buttonStyle={styles.customButtonStyle}
            />
            <CustomButton
              text="Déconnexion"
              onPress={() => console.log("Message")}
              buttonStyle={styles.customButtonStyle}
            />
          </View>
        </View>
      </View>
      <View style={styles.imageContainer}>
        <Avatar imageSource="https://picsum.photos/200" size={270} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
  },
  additionalInformation: {
    flex: 5,
    marginLeft: "10%",
  },
  userInformation: {
    flexDirection: "column",
  },
  imageContainer: {
    flex: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 58,
    fontWeight: "bold",
  },
  description: {
    fontSize: 23,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  buttonChildren: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  customButtonStyle: {
    marginRight: 20,
  },
});

export default ProfileInfo;
