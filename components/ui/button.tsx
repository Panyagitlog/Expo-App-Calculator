import React from "react";
import { TouchableOpacity, Text, StyleSheet, TouchableOpacityProps } from "react-native";

interface ButtonProps extends TouchableOpacityProps {
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({ children, style, ...props }) => (
  <TouchableOpacity {...props} style={[styles.button, style]}>
    {typeof children === "string" ? (
      <Text style={styles.text}>{children}</Text>
    ) : (
      children
    )}
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  button: {
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 999,
    paddingVertical: 12,
    paddingHorizontal: 20,
    alignItems: "center",
  },
  text: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 18,
  },
});
