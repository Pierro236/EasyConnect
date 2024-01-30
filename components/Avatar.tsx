import React from 'react';
import { View, Image, StyleSheet } from 'react-native';

interface AvatarProps {
  imageSource: string;
  size?: number;
}

const Avatar: React.FC<AvatarProps> = ({ imageSource, size }) => {
    const avatarStyles = styles(size);
    return (
        <View style={avatarStyles.avatarContainer}>
            <Image
                source={{ uri: imageSource }}
                style={avatarStyles.avatarImage}
                resizeMode="cover"
            />
        </View>
    );
};
const styles = (size? : number) => {
    return StyleSheet.create({
    avatarContainer: {
        borderRadius: size ? size / 2 : 50, 
        overflow: 'hidden',
        width: size? size: '100%',
        height: size? size: '100%',
    },
    avatarImage: {
        flex: 1,
        width: '100%',
        height: '100%',
    },
    });
}

export default Avatar;
