import { MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react'
import { View, Text } from 'react-native';
import ProfileIcon from './ProfileIcon';
import { StyleSheet } from 'react-native';

type Props = {
    name: string;
    description: string;
    imageSource: string;
    certified?: boolean;
}

export default function FollowerCard({imageSource, certified, description, name}: Props) {
  return (
    <View style={styles.container}>
        <ProfileIcon src={imageSource} />
                <Text style={{ fontSize: 18, fontWeight: "700" }}>
                    {name + "jmsdkmas"}
                </Text>
                {certified && (
                    <MaterialCommunityIcons
                    name="check-decagram"
                    size={16}
                    color="#579AF5"
                    style={{ marginLeft: -2 }}
                    />
                )}
    </View>
  )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        alignItems: "center",
        gap: 7,
        backgroundColor: "red",
      },
})