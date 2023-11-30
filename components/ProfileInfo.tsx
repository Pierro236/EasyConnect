import React from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import Avatar from "./Avatar";
import StatsCard from "./StatsCard";
import CustomButton from "./CustomButton";
import { useEffect, useState } from "react";
import FloatingButton from "./FloatingButton";
interface ProfileInfoProps {
  name?: string;
  description?: string;
  imageSource?: string;
  followers?: number;
  following?: number;
  posts?: number;
}

const ProfileInfo: React.FC<ProfileInfoProps> = ({ name, description, imageSource, followers, following, posts}) => {
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  useEffect(() => {
    const checkScreenSize = () => {
      const { width } = Dimensions.get("window");
      setIsSmallScreen(width < 600);
    };

    checkScreenSize();

    const resizeListener = Dimensions.addEventListener(
      "change",
      checkScreenSize
    );

    return () => {
      resizeListener.remove();
    };
  }, []);


  return (
    <View style={styles.container}>
      {
        isSmallScreen ? (
          <View style={styles.infoContainer}>
            <Avatar imageSource={imageSource ? imageSource : "https://picsum.photos/200"} size={210} />
            <Text style={[styles.smallTitle, styles.row]}>{name}</Text>
            <View style={styles.buttonChildren}>
            <FloatingButton icon="pencil-outline" onPress={() => console.log("EDIT")} buttonStyle={styles.customButtonStyle}/>
            <FloatingButton  icon="log-out-outline" onPress={() => console.log("Logout")}/>
          </View>
            <StatsCard followers={followers ? followers : 0} following={following ? following : 0} posts={posts ? posts : 0} />
          </View>
        ) : (
          <>
<View style={styles.additionalInformation}>
        <View style={styles.userInformation}>
          <Text style={styles.title}>Bonjour, je m'apelle {name}</Text>
          <Text style={styles.description}>{description}</Text>
        </View>
        <StatsCard followers={followers ? followers : 0} following={following ? following : 0} posts={posts ? posts : 0} />
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
        <Avatar imageSource={imageSource ? imageSource : "https://picsum.photos/200"} size={310} />
      </View>
      </>
        )
      }
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
  smallTitle: {
    fontSize: 30,
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
  infoContainer: {
    flex: 1,
    alignItems: "center",
    padding: 20,
    paddingTop: 50,
  },
  row: {
    paddingBottom: 10
  },
});

export default ProfileInfo;
