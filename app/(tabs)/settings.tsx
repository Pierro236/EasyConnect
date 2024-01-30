import { Button, Image, ScrollView, StyleSheet } from "react-native";
import { Text, View } from "../../components/Themed";
const testimage = require("../../assets/images/easy.png");



// export default function SettingsScreen() {
//   return (
//     <View style={styles.container}>
//       <Image style={{ height: "30%", width: "50%" }} source={testimage}></Image>
//       <Text style={styles.title}>Easy Connect</Text>
//     </View>
//   );
// }

const SettingsScreen: React.FC = () => {
  return (
    <ScrollView style={styles.container}>
      <Image style={styles.image} source={testimage} />
      <Text style={styles.title}>Easy Connect</Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Paramètres du compte</Text>
        <Button title="Modifier le mot de passe" onPress={() => {}} />
        <Button title="Mise à jour de l'adresse électronique" onPress={() => {}} />
        <Button title="Gestion de l'accès aux applications tierces" onPress={() => {}} />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Paramètres de confidentialité</Text>
        <Button title="Qui peut voir vos messages ?" onPress={() => {}} />
        <Button title="Faut-il divulguer des données à caractère personnel ?" onPress={() => {}} />
        <Button title="Indexation des moteurs de recherche" onPress={() => {}} />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Paramètres de notification</Text>
        <Button title="Notification par e-mail" onPress={() => {}} />
        <Button title="Notifications dans l'application" onPress={() => {}} />
        <Button title="Notification par SMS" onPress={() => {}} />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Affichage et interface</Text>
        <Button title="thématique" onPress={() => {}} />
        <Button title="taille de la police" onPress={() => {}} />
        <Button title="Mode nuit" onPress={() => {}} />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Langues et régions</Text>
        <Button title="Sélection de la langue d'affichage" onPress={() => {}} />
        <Button title="Format de la date et de l'heure" onPress={() => {}} />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>en ce qui concerne</Text>
        <Button title="version de l'application" onPress={() => {}} />
        <Button title="Informations sur le développeur" onPress={() => {}} />
        <Button title="Informations sur les licences" onPress={() => {}} />
      </View>
    </ScrollView>
  );
}

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     alignItems: "center",
//     justifyContent: "center",
//     backgroundColor: "white",
//   },
//   title: {
//     fontSize: 20,
//     fontWeight: "bold",
//   },
//   separator: {
//     marginVertical: 30,
//     height: 1,
//     width: "80%",
//   },
// });

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    paddingTop: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: "#000000",
  },
  image: {
    height: "30%",
    width: "50%",
    alignSelf: "center",
    marginBottom: 20,
  },
  section: {
    width: "90%",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    alignSelf: "center",
    backgroundColor: "#EAF2FF",
  },
  sectionTitle: {
    fontSize: 18,
    marginBottom: 10,
    color: "#000000",
  },
});

export default SettingsScreen;