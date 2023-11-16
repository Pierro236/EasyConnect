import { StyleSheet } from 'react-native';

import EditScreenInfo from '../../components/EditScreenInfo';
import ProfileInfo from '../../components/ProfileInfo';
import RecentPosts from '../../components/RecentPosts';
import { Text, View } from '../../components/Themed';

export default function Profile() {
  return (
    <View style={styles.container}>
      <ProfileInfo name="Alice" description="Apprécie l'art, les chats, et les petits plaisirs simples. 🎨🐱🌼. Je veux discuter et me faire des amis. Parlez-moi de vous ! 💬"/>
      <RecentPosts />
    </View>
  );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
  });
