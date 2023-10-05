import { Image, StyleSheet } from "react-native";

import EditScreenInfo from "../../components/EditScreenInfo";
import { Text, View } from "../../components/Themed";
const testimage = require("../../assets/images/easy.png");

export default function SettingsScreen() {
  return (
    <View style={styles.container}>
      <Image style={{ height: "30%", width: "50%" }} source={testimage}></Image>
      <Text style={styles.title}>Easy Connect</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
});