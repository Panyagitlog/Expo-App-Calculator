// app/(tabs)/_layout.tsx
import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerStyle: {
          backgroundColor: "#020617", // zinc-950
        },
        headerTintColor: "#e4e4e7", // zinc-200
        headerTitleStyle: {
          fontWeight: "600",
          letterSpacing: 0.5,
        },
        tabBarStyle: {
          backgroundColor: "#020617", // zinc-950
          borderTopColor: "#27272a", // zinc-800
        },
        tabBarActiveTintColor: "#fafafa", // zinc-50
        tabBarInactiveTintColor: "#a1a1aa", // zinc-400
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Calculator",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="calculator-outline" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
