import React from "react";
import { View, StyleSheet, ViewProps } from "react-native";

export const Card: React.FC<ViewProps> = ({ children, style, ...props }) => (
  <View {...props} style={[styles.card, style]}>
    {children}
  </View>
);

const styles = StyleSheet.create({
  card: {
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 20,
    padding: 16,
  },
});
