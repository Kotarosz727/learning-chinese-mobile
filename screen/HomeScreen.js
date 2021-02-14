import React from "react";
import { Text, View } from "react-native";
import { Button } from "react-native-elements";

export default function HomeScreen({ navigation, username }) {
  return (
    <View style={{ flex: 1, alignItems: "center" }}>
      <View style={{ marginTop: 150 }}>
        {username ? (
          <Text style={{ marginBottom: 50, fontSize: 25 }}>
            您好!{username}
          </Text>
        ) : (
          <Text></Text>
        )}
      </View>
      <Button
        title="中国語 Level①"
        onPress={() => navigation.navigate("content", {query: 'level1'})}
        type="outline"
        raised={true}
        containerStyle={{ marginBottom: 40, width: 300 }}
      />
      <Button
        title="中国語 Level②"
        onPress={() => navigation.navigate("content", {query: 'level2'})}
        type="outline"
        raised={true}
        containerStyle={{ marginBottom: 40, width: 300 }}
      />
    </View>
  );
}
