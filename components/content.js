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
    <Icon5
      name="sync-alt"
      style={styles.syncAlt}
      onPress={() => handleToggle(!front)}
      size={25}
    />
  );
  const frontCard = (item) => {
    return (
      <View style={styles.item}>
        <Text style={styles.content}>{item.japanese}</Text>
        <Text style={styles.bookmark}>{bookmark}</Text>
        <Text style={styles.syncAlt}>{syncAlt}</Text>
      </View>
    );
  };
  const backCard = (item) => {
    return (
      <View style={styles.item}>
        <Text
          style={styles.content}
          onPress={() => Speech.speak(item.chinese, { language: "zh" })}
        >
          {item.chinese}
        </Text>
        <Text style={styles.pinin}>{item.pinin}</Text>
        <Text style={styles.bookmark}>{bookmark}</Text>
        <Text style={styles.syncAlt}>{syncAlt}</Text>
      </View>
    );
  };
  const handleToggle = (value) => {
    toggleCard(value);
  };

  return <>{front ? frontCard(item) : backCard(item)}</>;
}

const styles = StyleSheet.create({
  item: {
    // backgroundColor: "#f9c2ff",
    borderWidth: 2,
    borderColor: "#dbd7db",
    borderRadius: 6,
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
    height: 180,
    display: "flex",
    justifyContent: "center",
    marginBottom:20,
  },
  content: {
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 30,
  },
  pinin: {
    marginTop: 20,
    textAlign: "center",
    fontSize: 18,
  },
  bookmark: {
    position: "absolute",
    left: 8,
    bottom: 10,
  },
  syncAlt: {
    position: "absolute",
    right: 8,
    bottom: 10,
  },
});
