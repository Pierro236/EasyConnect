import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { useEffect, useState } from 'react';
import { Link } from 'expo-router';

interface StatsCardProps {
  followers: number;
  following: number;
  posts: number;
}

const StatsCard: React.FC<StatsCardProps> = ({ followers, following, posts }) => {
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
      <View style={isSmallScreen ? styles.statsContainerSmall : styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{followers}</Text>
          <Text style={styles.statLabel}>Followers</Text>
        </View>
        <View style={styles.statItem}>
          <Link href="/followersList"> <Text style={styles.statValue}>{following}</Text> </Link>
          <Text style={styles.statLabel}>Following</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{posts}</Text>
          <Text style={styles.statLabel}>Posts</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  statsContainer: {
    flexDirection: 'row',
    padding: 15,
    margin: 10,
    width: '60%',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 23,
    fontWeight: '500',
    color: '#333',
  },
  statValue: {
    fontSize: 33,
    color: '#366EFF',
    fontWeight: '700',
  },
  statsContainerSmall: {
    flexDirection: 'row',
    padding: 15,
    margin: 10,
    width: '120%',
  },
});

export default StatsCard;
