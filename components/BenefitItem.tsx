import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";

const BenefitItem = ({ title, icon }: any) => (
  <View style={styles.benefitContainer}>
    {icon}
    <Text style={styles.benefitText}>{title}</Text>
  </View>
);

const styles = StyleSheet.create({
  benefitContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 10,
  },
  benefitText: {
    paddingLeft: 10,
  },
});

export default BenefitItem;
