import React, { useState, useEffect } from "react";
import { Text, View, StyleSheet, TextInput } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import Amplify, { Auth } from "aws-amplify";

export default function HomeScreen({navigation}) {
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Icon.Button
        name="facebook"
        size={30}
        backgroundColor="#3b5998"
        style={{ width: 300 }}
        onPress={() => Auth.federatedSignIn({ provider: "Facebook" })}
      >
        <Text style={{ fontFamily: "Arial", fontSize: 16, color: "white" }}>
          FaceBookアカウントで登録
        </Text>
      </Icon.Button>
      <View style={{ marginTop: 30 }}>
        <Icon.Button
          name="google"
          size={30}
          type="outline"
          style={{ width: 300 }}
          onPress={() => Auth.federatedSignIn({ provider: "Google" })}
        >
          <Text style={{ fontFamily: "Arial", fontSize: 16, color: "white" }}>
            Googleアカウントで登録
          </Text>
        </Icon.Button>
      </View>
      <View style={{ marginTop: 30, marginBottom: 30 }}>
        <Icon.Button
          name="amazon"
          size={30}
          type="outline"
          backgroundColor="#f5d362"
          style={{ width: 300 }}
          onPress={() => Auth.federatedSignIn({ provider: "Amazon" })}
        >
          <Text style={{ fontFamily: "Arial", fontSize: 16, color: "white" }}>
            Amazonアカウントで登録
          </Text>
        </Icon.Button>
      </View>
      <Text onPress={() => navigation.navigate("SignIn")}>戻る</Text>
    </View>
  );
}
