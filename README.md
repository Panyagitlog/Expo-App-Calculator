<h1 align="center">📱 Expo App Calculator</h1>

<p align="center">
  <b>A beautifully crafted, responsive calculator app built with React Native, Expo, and TypeScript.</b><br/>
  Supports Android, iOS, tablet, and web platforms — featuring a sleek zinc dark theme and smooth design.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Expo-000000?style=for-the-badge&logo=expo&logoColor=white"/>
  <img src="https://img.shields.io/badge/React_Native-20232A?style=for-the-badge&logo=react&logoColor=61DAFB"/>
  <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white"/>
  <img src="https://img.shields.io/badge/Platform-Android%20%7C%20iOS%20%7C%20Web-success?style=for-the-badge"/>
</p>

---

## 🚀 Features

✨ **Responsive design** for phones, tablets, and desktop web  
🌑 **Zinc dark mode** with smooth rounded buttons  
🧮 Perform operations → `+`, `−`, `×`, `÷`  
⚡ **Instant calculations** with no delay  
🧠 Built using React Hooks (`useState`)  
📏 Dynamic sizing using `useWindowDimensions()`  
📲 Cross-platform via **Expo Router** navigation  

---

## 🧩 Tech Stack

| Category | Tool / Library |
|-----------|----------------|
| **Framework** | [Expo](https://expo.dev) |
| **Language** | [TypeScript](https://www.typescriptlang.org/) |
| **UI** | React Native Components |
| **Navigation** | [Expo Router](https://expo.github.io/router/docs) |
| **Icons** | [Ionicons](https://icons.expo.fyi/) |
| **Theme** | Zinc-inspired dark palette |

---

## 🖼️ Screenshots

<p align="center">
  <b>📱 Mobile View</b><br/>
  <img src="https://i.postimg.cc/XYw51YBB/Whats-App-Image-2025-12-01-at-16-54-35-fcff4577.jpg" alt="Mobile View" width="280"/>
</p>

> 💡 *Add tablet and web screenshots later to make your project gallery complete.*

---

## 🧮 Calculator Logic (Code Overview)

The calculator uses **React state hooks** for value tracking and performs real-time math operations.

### 🔹 State Variables

```ts
const [currentValue, setCurrentValue] = useState("0");
const [previousValue, setPreviousValue] = useState<string | null>(null);
const [operator, setOperator] = useState<Operator>(null);
const [overwrite, setOverwrite] = useState(true);
