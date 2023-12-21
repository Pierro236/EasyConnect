import { Image, StyleSheet, View, Text, ScrollView } from "react-native";
const testimage = require("../../assets/images/test.jpg");
import ProfileIcon from "../../components/ProfileIcon";
import Post from "../../components/PostCard";
import { fakePostData } from "../../data/post";
import { SafeAreaView } from "react-native-safe-area-context";

export default function TabOneScreen() {
  const posts = fakePostData;
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.addPostContainer}>
        <ProfileIcon src={testimage} />
        <Text style={styles.title}>Dis quelque chose...</Text>
      </View>
      <ScrollView
        style={styles.postsContainer}
        showsVerticalScrollIndicator={false}
      >
        {posts.map((post) => (
          <Post key={post.id} post={post} />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#dbd7d7",
  },
  title: {
    fontSize: 17,
    fontWeight: "bold",
    paddingLeft: 10,
  },

  addPostContainer: {
    flex: 0.05,
    backgroundColor: "white",
    padding: 10,
    flexDirection: "row",
    alignItems: "center",
  },

  postsContainer: {
    flex: 0.95,
    paddingVertical: 10,
  },
});
