import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, FlatList } from "react-native";
import Card from "./Card";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { Button, ThemeProvider, Header } from "react-native-elements";
import DrawerNavigator from "./DrawerNavigator";
import Icon5 from "react-native-vector-icons/FontAwesome5";

export default function StackNavigator() {
  const HomeStack = createStackNavigator();

  

  function HomeStackScreen({ navigation }) {
    return (
      <HomeStack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerStyle: {
            backgroundColor: "#f4511e",
          },
          headerTintColor: "#fff",
          headerTitleStyle: {
            fontWeight: "bold",
          },
          headerLeft: () => (
            <Icon5
              name="bars"
              size={25}
              onPress={() => navigation.openDrawer()}
            />
          ),
        }}
      >
        <HomeStack.Screen name="Home" component={HomeScreen} />
      </HomeStack.Navigator>
    );
  }

  return HomeStackScreen;
}
