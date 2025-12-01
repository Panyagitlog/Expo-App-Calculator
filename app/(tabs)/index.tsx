// app/(tabs)/index.tsx
import React, { useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  Pressable,
  StyleSheet,
  useWindowDimensions,
} from "react-native";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";

type Operator = "+" | "-" | "×" | "÷" | null;
type ButtonType = "number" | "operator" | "utility" | "equal";

type CalcButton = {
  label: string;
  type: ButtonType;
  flex?: number;
};

const BUTTONS: CalcButton[][] = [
  [
    { label: "AC", type: "utility" },
    { label: "+/-", type: "utility" },
    { label: "%", type: "utility" },
    { label: "÷", type: "operator" },
  ],
  [
    { label: "7", type: "number" },
    { label: "8", type: "number" },
    { label: "9", type: "number" },
    { label: "×", type: "operator" },
  ],
  [
    { label: "4", type: "number" },
    { label: "5", type: "number" },
    { label: "6", type: "number" },
    { label: "-", type: "operator" },
  ],
  [
    { label: "1", type: "number" },
    { label: "2", type: "number" },
    { label: "3", type: "number" },
    { label: "+", type: "operator" },
  ],
  [
    { label: "0", type: "number", flex: 2 },
    { label: ".", type: "number" },
    { label: "=", type: "equal" },
  ],
];

const CalculatorScreen: React.FC = () => {
  const { width, height } = useWindowDimensions();
  const tabBarHeight = useBottomTabBarHeight();

  const isLandscape = width > height;
  const deviceWidth = width;

  let maxCalcWidth = 420; // default (phone)
  let maxCalcHeight = 720;

  if (deviceWidth >= 480 && deviceWidth < 768) {
    maxCalcWidth = 480;
    maxCalcHeight = 720;
  } else if (deviceWidth >= 768 && deviceWidth < 1024) {
    maxCalcWidth = 520;
    maxCalcHeight = 780;
  } else if (deviceWidth >= 1024) {
    maxCalcWidth = 560;
    maxCalcHeight = 800;
  }

  const calcWidth = Math.min(
    deviceWidth * (isLandscape ? 0.6 : 0.9),
    maxCalcWidth
  );

  // 🔹 Use a bit less than full height AND ensure enough space above tab bar
  const usableHeight = height - tabBarHeight - 32; // leave gap for tab bar + padding
  const calcHeight = Math.min(usableHeight * 0.9, maxCalcHeight);

  const base = Math.min(calcWidth, calcHeight);
  const displayFontSize = Math.max(32, base * 0.11);
  const buttonFontSize = Math.max(18, base * 0.05);

  const [currentValue, setCurrentValue] = useState<string>("0");
  const [previousValue, setPreviousValue] = useState<string | null>(null);
  const [operator, setOperator] = useState<Operator>(null);
  const [overwrite, setOverwrite] = useState<boolean>(true);

  const formatNumber = (value: string) => {
    if (value.endsWith(".")) return value;
    const num = Number(value);
    if (isNaN(num)) return "0";
    if (Math.abs(num) > 999999999) {
      return num.toExponential(4);
    }
    return num.toString();
  };

  const handleNumberPress = (digit: string) => {
    setCurrentValue((prev) => {
      if (overwrite) {
        if (digit === ".") {
          setOverwrite(false);
          return "0.";
        }
        setOverwrite(false);
        return digit;
      }
      if (digit === "." && prev.includes(".")) return prev;
      if (prev === "0" && digit !== ".") return digit;
      return prev + digit;
    });
  };

  const calculateResult = (): string => {
    if (!operator || previousValue === null) return currentValue;

    const prev = Number(previousValue);
    const curr = Number(currentValue);

    let result: number;
    switch (operator) {
      case "+":
        result = prev + curr;
        break;
      case "-":
        result = prev - curr;
        break;
      case "×":
        result = prev * curr;
        break;
      case "÷":
        if (curr === 0) return "Error";
        result = prev / curr;
        break;
      default:
        return currentValue;
    }
    return result.toString();
  };

  const handleOperatorPress = (op: Operator) => {
    if (operator && !overwrite) {
      const result = calculateResult();
      setPreviousValue(result);
      setCurrentValue("0");
      setOperator(op);
      setOverwrite(true);
    } else {
      setPreviousValue(currentValue);
      setCurrentValue("0");
      setOperator(op);
      setOverwrite(true);
    }
  };

  const handleEqualPress = () => {
    const result = calculateResult();
    setCurrentValue(result === "Error" ? result : formatNumber(result));
    setPreviousValue(null);
    setOperator(null);
    setOverwrite(true);
  };

  const handleUtilityPress = (label: string) => {
    switch (label) {
      case "AC":
        setCurrentValue("0");
        setPreviousValue(null);
        setOperator(null);
        setOverwrite(true);
        break;
      case "+/-":
        if (currentValue === "0" || currentValue === "Error") return;
        if (currentValue.startsWith("-")) {
          setCurrentValue(currentValue.slice(1));
        } else {
          setCurrentValue("-" + currentValue);
        }
        break;
      case "%":
        if (currentValue === "Error") return;
        const percentVal = Number(currentValue) / 100;
        setCurrentValue(percentVal.toString());
        setOverwrite(true);
        break;
      default:
        break;
    }
  };

  const handleButtonPress = (btn: CalcButton) => {
    if (currentValue === "Error" && btn.label !== "AC") return;

    switch (btn.type) {
      case "number":
        handleNumberPress(btn.label);
        break;
      case "operator":
        handleOperatorPress(btn.label as Operator);
        break;
      case "equal":
        handleEqualPress();
        break;
      case "utility":
        handleUtilityPress(btn.label);
        break;
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* 👇 push content up by tab bar height so nothing hides behind it */}
      <View style={[styles.root, { paddingBottom: tabBarHeight + 16 }]}>
        <View
          style={[
            styles.calculator,
            {
              width: calcWidth,
              height: calcHeight,
              borderRadius: calcWidth * 0.07,
              paddingHorizontal: base * 0.04,
              paddingVertical: base * 0.04,
            },
          ]}
        >
          {/* Display */}
          <View style={styles.displayContainer}>
            {previousValue && operator && (
              <Text
                numberOfLines={1}
                style={[
                  styles.historyText,
                  { fontSize: Math.max(14, buttonFontSize * 0.7) },
                ]}
              >
                {formatNumber(previousValue)} {operator}
              </Text>
            )}
            <Text
              numberOfLines={1}
              adjustsFontSizeToFit
              style={[styles.displayText, { fontSize: displayFontSize }]}
            >
              {currentValue === "Error" ? "Error" : formatNumber(currentValue)}
            </Text>
          </View>

          {/* Buttons */}
          <View style={styles.buttonGrid}>
            {BUTTONS.map((row, rowIndex) => (
              <View key={rowIndex} style={styles.buttonRow}>
                {row.map((btn, index) => {
                  const flex = btn.flex ?? 1;
                  const isOperator =
                    btn.type === "operator" || btn.type === "equal";
                  const isUtility = btn.type === "utility";

                  return (
                    <Pressable
                      key={index}
                      style={({ pressed }) => [
                        styles.button,
                        { flex },
                        pressed && styles.buttonPressed,
                        isOperator && styles.buttonOperator,
                        isUtility && styles.buttonUtility,
                        btn.label === "0" && styles.buttonZero,
                      ]}
                      onPress={() => handleButtonPress(btn)}
                    >
                      <Text
                        style={[
                          styles.buttonText,
                          { fontSize: buttonFontSize },
                          isOperator && styles.buttonTextOperator,
                          isUtility && styles.buttonTextUtility,
                        ]}
                      >
                        {btn.label}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            ))}
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#020617", // zinc-950
  },
  root: {
    flex: 1,
    backgroundColor: "#020617", // zinc-950
    justifyContent: "center",
    alignItems: "center",
  },
  calculator: {
    backgroundColor: "#09090b", // zinc-950
    justifyContent: "space-between",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.5,
    shadowRadius: 24,
    elevation: 12,
    borderWidth: 1,
    borderColor: "#18181b", // zinc-900
  },
  displayContainer: {
    flex: 0.35,
    justifyContent: "flex-end",
    alignItems: "flex-end",
  },
  displayText: {
    color: "#f9fafb", // zinc-50
    fontWeight: "300",
    textAlign: "right",
  },
  historyText: {
    color: "#71717a", // zinc-500
    marginBottom: 4,
  },
  buttonGrid: {
    flex: 0.65,
    justifyContent: "space-between",
  },
  buttonRow: {
    flexDirection: "row",
    alignItems: "stretch",
  },
  button: {
    marginHorizontal: 4,
    marginVertical: 5,
    borderRadius: 999,
    justifyContent: "center",
    alignItems: "center",
    aspectRatio: 1,
    backgroundColor: "#18181b", // zinc-900
  },
  buttonZero: {
    alignItems: "flex-start",
    paddingLeft: 28,
    aspectRatio: 2.3,
  },
  buttonOperator: {
    backgroundColor: "#4f46e5", // indigo-600
  },
  buttonUtility: {
    backgroundColor: "#27272a", // zinc-800
  },
  buttonPressed: {
    opacity: 0.7,
    transform: [{ scale: 0.97 }],
  },
  buttonText: {
    color: "#e5e7eb", // zinc-200
    fontWeight: "500",
  },
  buttonTextOperator: {
    color: "#f9fafb", // zinc-50
    fontWeight: "700",
  },
  buttonTextUtility: {
    color: "#e5e7eb", // zinc-200
    fontWeight: "600",
  },
});

export default CalculatorScreen;
