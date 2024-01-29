import { MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react'
import { View, Text, Dimensions } from 'react-native';
import { StyleSheet } from 'react-native';
import Avatar from './Avatar';
import { useEffect, useState } from 'react';

type Props = {
    name: string;
    description: string;
    imageSource: string;
    certified?: boolean;
}

export default function FollowerCard({imageSource, certified, description, name}: Props) {

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
                <Avatar imageSource={imageSource ? imageSource : "https://picsum.photos/200"} size={isSmallScreen ? 70:100} />
                <View style={styles.header}>
                <Text style={{ fontSize: 18, fontWeight: "700" }}>
                    {name}
                </Text>
                {certified && (
                    <MaterialCommunityIcons
                    name="check-decagram"
                    size={16}
                    color="#579AF5"
                    style={{ marginLeft: -2 }}
                    />
                )}
                {
                    !isSmallScreen && (
                        <Text style={{ fontSize: 18, fontWeight: "400" }}>
                        {description}
                        </Text>
                    )
                }
            </View>
    </View>
  )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
            alignItems: "center",
            gap: 7,
        backgroundColor: "white",
        padding: 15,
        marginVertical: 10,
        borderRadius: 20,
        overflow: 'hidden'
      },
        header: {
            marginLeft: 10,
            flexDirection: "column",
            alignItems: "flex-start",
            justifyContent: "center",
            gap: 5,
        },
})