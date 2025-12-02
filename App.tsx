// App.tsx
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
  useColorScheme,
  Image,
  ActivityIndicator,
  ScrollView,
  Platform,
} from "react-native";
import { BlurView } from "expo-blur";
import { Moon, Sun, Image as ImageIcon, Clock, RefreshCw } from "lucide-react-native";
import * as Location from "expo-location";
import axios from "axios";

// 🌆 Background images
const backgrounds = [
  require("./assets/images/bg1.jpg"),
  require("./assets/images/bg2.jpg"),
  require("./assets/images/bg3.jpg"),
];

// 🔢 Calculator keys
const KEYS = [
  ["C", "⌫", "/"],
  ["7", "8", "9", "*"],
  ["4", "5", "6", "-"],
  ["1", "2", "3", "+"],
  ["0", ".", "="],
];

const isOperator = (k: string) => ["/", "*", "-", "+", "="].includes(k);

export default function App() {
  const systemTheme = useColorScheme();
  const [overrideTheme, setOverrideTheme] = useState<"light" | "dark" | null>(null);
  const isDark = (overrideTheme ?? systemTheme) === "dark";

  const [expression, setExpression] = useState("");
  const [result, setResult] = useState("0");
  const [bgIndex, setBgIndex] = useState(0);
  const [weather, setWeather] = useState<any>(null);
  const [loadingWeather, setLoadingWeather] = useState(true);
  const [time, setTime] = useState<string>("");

  // 🕒 Real-time Indian Time
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const options: Intl.DateTimeFormatOptions = {
        hour: "numeric",
        minute: "numeric",
        hour12: true,
        timeZone: "Asia/Kolkata",
      };
      const timeStr = new Intl.DateTimeFormat("en-IN", options).format(now);
      setTime(timeStr);
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // 🌦 Weather Fetch Function (mobile only)
  const fetchWeather = async () => {
    // On web, skip real weather fetch to avoid CORS + location issues
    if (Platform.OS === "web") {
      setWeather(null);
      setLoadingWeather(false);
      return;
    }

    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      let latitude = 18.5204;
      let longitude = 73.8567;

      if (status === "granted") {
        const loc = await Location.getCurrentPositionAsync({});
        latitude = loc.coords.latitude;
        longitude = loc.coords.longitude;
      }

      // wttr.in JSON API
      const res = await axios.get(`https://wttr.in/${latitude},${longitude}?format=j1`);
      const data = res.data.current_condition[0];

      setWeather({
        name: res.data.nearest_area[0].areaName[0].value,
        main: { temp: parseFloat(data.temp_C) },
        weather: [
          {
            description: data.weatherDesc[0].value,
            icon: data.weatherIconUrl[0].value,
          },
        ],
      });
    } catch (e) {
      console.log("Weather/location error:", e);
    } finally {
      setLoadingWeather(false);
    }
  };

  // Fetch once on load
  useEffect(() => {
    fetchWeather();
  }, []);

  // ⚙️ Actions
  const changeBackground = () => setBgIndex((p) => (p + 1) % backgrounds.length);
  const toggleTheme = () => setOverrideTheme((p) => (p === "dark" ? "light" : "dark"));

  const handleKeyPress = (key: string) => {
    if (key === "C") return setExpression(""), setResult("0");
    if (key === "⌫") return setExpression((p) => p.slice(0, -1));
    if (key === "=") {
      if (!expression.trim()) return;
      try {
        setResult(String(eval(expression)));
      } catch {
        setResult("Error");
      }
      return;
    }
    setExpression((p) => p + key);
  };

  return (
    <ImageBackground source={backgrounds[bgIndex]} style={styles.background} resizeMode="cover">
      {/* Dark/Light overlay so background image doesn't overpower UI */}
      <View
        style={[
          StyleSheet.absoluteFillObject,
          {
            backgroundColor: isDark ? "rgba(9,9,11,0.93)" : "rgba(250,250,250,0.9)",
          },
        ]}
      />

      <BlurView intensity={20} tint={isDark ? "dark" : "light"} style={styles.blurLayer}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View style={styles.headerRow}>
            <Text style={[styles.title, isDark ? styles.textLight : styles.textDark]}>
              Pranav Calc
            </Text>

            <View style={styles.headerButtons}>
              <TouchableOpacity onPress={changeBackground} style={styles.iconButton}>
                <ImageIcon size={20} color={isDark ? "#fafafa" : "#18181b"} />
              </TouchableOpacity>
              <TouchableOpacity onPress={toggleTheme} style={styles.iconButton}>
                {isDark ? <Sun size={20} color="#facc15" /> : <Moon size={20} color="#18181b" />}
              </TouchableOpacity>
            </View>
          </View>

          {/* Weather + Time */}
          <View style={styles.weatherBox}>
            {loadingWeather ? (
              <ActivityIndicator color={isDark ? "#fff" : "#000"} />
            ) : Platform.OS === "web" ? (
              <>
                <Text style={[styles.weatherText, isDark ? styles.textLight : styles.textDark]}>
                  Weather not available in web preview
                </Text>
                <View style={styles.timeRow}>
                  <Clock size={14} color={isDark ? "#facc15" : "#ca8a04"} />
                  <Text style={[styles.timeText, isDark ? styles.textLight : styles.textDark]}>
                    {time}
                  </Text>
                </View>
              </>
            ) : weather ? (
              <>
                <View style={styles.weatherRow}>
                  <Image
                    source={{ uri: weather.weather[0].icon }}
                    style={{ width: 40, height: 40 }}
                  />
                  <Text style={[styles.weatherText, isDark ? styles.textLight : styles.textDark]}>
                    {weather.name} | {Math.round(weather.main.temp)}°C
                  </Text>

                  {/* Refresh button (mobile) */}
                  <TouchableOpacity onPress={fetchWeather} style={styles.refreshBtn}>
                    <RefreshCw size={18} color={isDark ? "#facc15" : "#ca8a04"} />
                  </TouchableOpacity>
                </View>

                <Text
                  style={[
                    styles.weatherSubText,
                    isDark ? styles.textLightMuted : styles.textDarkMuted,
                  ]}
                >
                  {weather.weather[0].description}
                </Text>

                <View style={styles.timeRow}>
                  <Clock size={14} color={isDark ? "#facc15" : "#ca8a04"} />
                  <Text style={[styles.timeText, isDark ? styles.textLight : styles.textDark]}>
                    {time}
                  </Text>
                </View>
              </>
            ) : (
              <Text style={{ color: "#aaa" }}>Weather not found</Text>
            )}
          </View>

          {/* Calculator */}
          <View
            style={[
              styles.calcContainer,
              {
                backgroundColor: isDark ? "#09090b" : "#f4f4f5",
                borderColor: isDark ? "#27272a" : "#d4d4d8",
              },
            ]}
          >
            {/* Display */}
            <View style={styles.displayCard}>
              <Text
                numberOfLines={1}
                style={[styles.expressionText, isDark ? styles.textLightMuted : styles.textDarkMuted]}
              >
                {expression || "0"}
              </Text>
              <Text numberOfLines={1} style={[styles.resultText, isDark ? styles.textLight : styles.textDark]}>
                {result}
              </Text>
            </View>

            {/* Keypad */}
            <View style={styles.keypad}>
              {KEYS.map((row) => (
                <View style={styles.keyRow} key={row.join("")}>
                  {row.map((key) => (
                    <TouchableOpacity
                      key={key}
                      style={[
                        styles.key,
                        isDark
                          ? { backgroundColor: isOperator(key) ? "#27272a" : "#18181b" }
                          : {
                              backgroundColor: isOperator(key) ? "#e4e4e7" : "#ffffff",
                              borderColor: "#d4d4d8",
                              borderWidth: 1.2,
                              shadowColor: "#000",
                              shadowOpacity: 0.1,
                              shadowRadius: 2,
                            },
                      ]}
                      onPress={() => handleKeyPress(key)}
                      activeOpacity={0.75}
                    >
                      <Text
                        style={[
                          styles.keyText,
                          isDark
                            ? isOperator(key)
                              ? styles.textAccent
                              : styles.textLight
                            : isOperator(key)
                              ? styles.textDarkAccent
                              : styles.textDark,
                        ]}
                      >
                        {key}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              ))}
            </View>
          </View>
        </ScrollView>
      </BlurView>
    </ImageBackground>
  );
}

// 🌈 Styles
const styles = StyleSheet.create({
  background: { flex: 1 },
  blurLayer: { flex: 1 },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 14,
    paddingTop: 30, // ⬅️ little bit down so it doesn't hit notch
    paddingBottom: 8,
  },

  // Header
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  headerButtons: { flexDirection: "row", gap: 8 },
  iconButton: { padding: 8, borderRadius: 999, backgroundColor: "rgba(0,0,0,0.2)" },
  title: { fontSize: 22, fontWeight: "700" },

  // Text
  textLight: { color: "#fafafa" },
  textLightMuted: { color: "#a1a1aa" },
  textDark: { color: "#18181b" },
  textDarkMuted: { color: "#52525b" },
  textAccent: { color: "#fbbf24" },
  textDarkAccent: { color: "#b45309" },

  // Weather
  weatherBox: { alignItems: "center", marginBottom: 8 },
  weatherRow: { flexDirection: "row", alignItems: "center", gap: 6 },
  weatherText: { fontSize: 15, fontWeight: "600" },
  weatherSubText: { fontSize: 13, textTransform: "capitalize", opacity: 0.9 },
  refreshBtn: { marginLeft: 8, padding: 4 },
  timeRow: { flexDirection: "row", alignItems: "center", gap: 4, marginTop: 4 },
  timeText: { fontSize: 14, fontWeight: "500" },

  // Calculator container
  calcContainer: {
    borderRadius: 20,
    padding: 12,
    borderWidth: 2,
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 6,
  },
  displayCard: { paddingVertical: 10, marginBottom: 10 },
  expressionText: { fontSize: 20, textAlign: "right" },
  resultText: { fontSize: 32, textAlign: "right", fontWeight: "700" },

  // Keypad
  keypad: { marginTop: 8 },
  keyRow: { flexDirection: "row", marginBottom: 8 },
  key: {
    flex: 1,
    marginHorizontal: 4,
    height: 58,
    borderRadius: 999,
    justifyContent: "center",
    alignItems: "center",
  },
  keyText: { fontSize: 20, fontWeight: "600" },
});
