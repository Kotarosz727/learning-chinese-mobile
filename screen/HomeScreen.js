import React from "react";
import { Text, View } from "react-native";
import { Button } from "react-native-elements";

export default function HomeScreen({ navigation, username }) {
  return (
    <View style={{ flex: 1, alignItems: "center" }}>
      <Button
        title="基本120文"
        onPress={() => navigation.navigate("content", { query: "120" })}
        raised={true}
        containerStyle={{ marginTop: 100, marginBottom: 40, width: 300 }}
      />
      <Button
        title="日常会話"
        onPress={() => navigation.navigate("content", { query: "nichijo" })}
        raised={true}
        containerStyle={{ marginBottom: 40, width: 300 }}
      />
      <Button
        title="動詞"
        onPress={() => navigation.navigate("content", { query: "dousa" })}
        raised={true}
        containerStyle={{ marginBottom: 40, width: 300 }}
      />
    </View>
  );
}
