import React, { useState } from "react";
import { StyleSheet, Text, View, FlatList } from "react-native";
import Icon5 from "react-native-vector-icons/FontAwesome5";
import * as Speech from "expo-speech";

export default function content({ item }) {
  const [front, toggleCard] = useState(true);
  const bookmark = (
    <>
      <Icon5 name="bookmark" size={25} />
    </>
  );
  const syncAlt = (
    <>
      <Icon5 name="sync-alt" onPress={() => handleToggle(!front)} size={25} />
    </>
  );
  const frontCard = (item) => {
    return <Text style={styles.content}>{item.japanese}</Text>;
  };
  const backCard = (item) => {
    return (
      <>
        <Text
          style={styles.content}
          onPress={() => Speech.speak(item.chinese, { language: "zh" })}
        >
          {item.chinese}
        </Text>
        <Text style={styles.pinin}>{item.pinin}</Text>
        <Text style={styles.bookmark}>{bookmark}</Text>
      </>
    );
  };
  const handleToggle = (value) => {
    toggleCard(value);
  };

  return (
    <>
      {front ? frontCard(item) : backCard(item)}
      <Text style={{ position: "absolute", right: 0, bottom: 0 }}>
        {syncAlt}
      </Text>
    </>
  );
}

const styles = StyleSheet.create({
  content: {
    fontWeight: "bold",
    fontSize: 30,
  },
  pinin: {
    marginTop: 20,
    textAlign: "center",
    fontSize: 18,
  },
  bookmark: {
    // position: "absolute",
    bottom: 0,
    left: 0,
    marginTop: 10,
  },
});
