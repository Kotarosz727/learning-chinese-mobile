import React, { useState, useEffect, useContext } from "react";
import { StyleSheet, View } from "react-native";
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItem,
} from "@react-navigation/drawer";
import Icon5 from "react-native-vector-icons/FontAwesome5";
import Ionicons from "react-native-vector-icons/Ionicons";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import {
  useTheme,
  Drawer,
  Text,
  Title,
  TouchableRipple,
  Switch,
} from "react-native-paper";
import { logout } from "./function/screen_function";
import Amplify, { Auth, Hub } from "aws-amplify";
import { SharedFunction } from "../components/context";

export function DrawerContent({ props, username }) {
  const { toggleTheme } = useContext(SharedFunction);
  const paperTheme = useTheme();

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
              icon={({ color, size }) => (
                <MaterialCommunityIcons name="home" color={color} size={25} />
              )}
              label="ホーム"
              onPress={() => props.navigation.navigate("ホーム")}
            />
            <DrawerItem
              icon={({ color, size }) => (
                <MaterialCommunityIcons
                  color={color}
                  name="bookmark-multiple"
                  size={25}
                />
              )}
              label="ブックマーク"
              onPress={() => props.navigation.navigate("ブックマーク")}
            />
            <DrawerItem
              icon={({ color }) => (
                <MaterialIcons color={color} name="translate" size={25} />
              )}
              label="翻訳"
              onPress={() => props.navigation.navigate("翻訳")}
            />
            <DrawerItem
              icon={({ color }) => (
                <Ionicons color={color} name="folder" size={25} />
              )}
              label="my単語帳"
              onPress={() => props.navigation.navigate("my単語帳")}
            />
            <DrawerItem
              icon={({ color }) => (
                <MaterialCommunityIcons
                  color={color}
                  name="exit-to-app"
                  size={25}
                />
              )}
              label="SignOut"
              onPress={() => Auth.signOut()}
            />
          </>
        ) : (
          <>
            <DrawerItem
              icon={({ color }) => <Ionicons color={color} name="home" size={25} />}
              label="ホーム"
              onPress={() => props.navigation.navigate("ホーム")}
            />
            <DrawerItem
              icon={({ color }) => <Ionicons color={color} name="log-in" size={25} />}
              label="SignIn"
              onPress={() => props.navigation.navigate("SignIn")}
            />
          </>
        )}
      </DrawerContentScrollView>
      <TouchableRipple onPress={() => toggleTheme()}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            paddingVertical: 12,
            paddingHorizontal: 16,
            marginBottom: 30,
          }}
        >
          {/* <Text>ダークモード</Text>
          <View pointerEvents="none">
            <Switch value={paperTheme.dark} />
          </View> */}
        </View>
      </TouchableRipple>
    </View>
  );
}
