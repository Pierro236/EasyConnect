import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface StatsCardProps {
  followers: number;
  following: number;
  posts: number;
}

const StatsCard: React.FC<StatsCardProps> = ({ followers, following, posts }) => {
  return (
    <View style={styles.container}>
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{followers}</Text>
          <Text style={styles.statLabel}>Followers</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{following}</Text>
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
});

export default StatsCard;
