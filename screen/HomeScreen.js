import React, { useState, useEffect } from "react";
import { Text, View, StyleSheet, TextInput } from "react-native";
import { Button, Overlay, Input } from "react-native-elements";

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
          onPress={() => navigation.navigate("Level1")}
          type="outline"
          raised={true}
          containerStyle={{ marginBottom: 40, width: 300 }}
        />
        <Button
          title="中国語 Level②"
          onPress={() => navigation.navigate("Level2")}
          type="outline"
          raised={true}
          containerStyle={{ marginBottom: 40, width: 300 }}
        />
      </View>
    );
  }