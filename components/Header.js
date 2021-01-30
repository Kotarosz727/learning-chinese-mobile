import React from "react";
import { Button, ThemeProvider, Header } from "react-native-elements";
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function header() {
  return (
    <SafeAreaProvider>
      <Header
        leftComponent={{ icon: "menu", color: "#fff" }}
        centerComponent={{ text: "MY TITLE", style: { color: "#fff" } }}
        rightComponent={{ icon: "home", color: "#fff" }}
      />
    </SafeAreaProvider>
  );
}
