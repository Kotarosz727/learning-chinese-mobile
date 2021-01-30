import { StatusBar } from "expo-status-bar";
import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, FlatList } from "react-native";
import ChineseInterator from "./function/ChineseInterator";
import Card from "./components/Card";

import { Button, ThemeProvider, Header } from "react-native-elements";
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function App() {
  const [data, setData] = useState([]);

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    const res = (await new ChineseInterator().fetchLists()) ?? [];
    setData(res);
  };

  return (
    <>
      <SafeAreaProvider>
        <Header
          leftComponent={{ icon: "menu", color: "#fff" }}
          centerComponent={{ text: "MY TITLE", style: { color: "#fff" } }}
          rightComponent={{ icon: "home", color: "#fff" }}
        />
        <View style={styles.container}>
          <Card data={data} />
        </View>
      </SafeAreaProvider>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    // backgroundColor: "#fff",
    // alignItems: "center",
    // justifyContent: "center",
  },
});
