import React from "react";
import { View, StyleSheet } from "react-native";
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItem,
} from "@react-navigation/drawer";
import Icon5 from "react-native-vector-icons/FontAwesome5";
import Ionicons from "react-native-vector-icons/Ionicons";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { Drawer, Text, Title } from "react-native-paper";
import { logout } from "./function/screen_function";
import Amplify, { Auth, Hub } from "aws-amplify";

export function DrawerContent({ props, username }) {
  return (
    <View style={{ flex: 1 }}>
      <DrawerContentScrollView {...props}>
        {username ? (
          <Drawer.Section>
            <View style={{ flex: 1, marginTop: 10, marginLeft: 15 }}>
              <Title>
                <Text style={{ fontSize: 20 }}>{username}</Text>
                <Text></Text>
              </Title>
            </View>
          </Drawer.Section>
        ) : (
          <Text></Text>
        )}
        {username ? (
          <>
            <DrawerItem
              icon={() => <Ionicons name="home-outline" size={25} />}
              label="ホーム"
              onPress={() => props.navigation.navigate("ホーム")}
            />
            <DrawerItem
              icon={() => <Ionicons name="bookmarks-outline" size={25} />}
              label="ブックマーク"
              onPress={() => props.navigation.navigate("ブックマーク")}
            />
            <DrawerItem
              icon={() => <MaterialIcons name="translate" size={25} />}
              label="翻訳"
              onPress={() => props.navigation.navigate("翻訳")}
            />
            <DrawerItem
              icon={() => <Ionicons name="folder-outline" size={25} />}
              label="my単語帳"
              onPress={() => props.navigation.navigate("my単語帳")}
            />
            <DrawerItem
              icon={() => (
                <MaterialCommunityIcons name="exit-to-app" size={25} />
              )}
              label="SignOut"
              onPress={() => Auth.signOut()}
            />
          </>
        ) : (
          <>
            <DrawerItem
              icon={() => <Ionicons name="home-outline" size={25} />}
              label="ホーム"
              onPress={() => props.navigation.navigate("ホーム")}
            />
            <DrawerItem
              icon={() => <Ionicons name="log-in-outline" size={25} />}
              label="SignIn"
              onPress={() => props.navigation.navigate("SignIn")}
            />
          </>
        )}
      </DrawerContentScrollView>
    </View>
  );
}
