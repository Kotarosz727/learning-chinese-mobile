import React from "react";
import { StyleSheet, Text, View, FlatList } from "react-native";
import { Button, ThemeProvider, Header } from "react-native-elements";
import { NavigationContainer } from "@react-navigation/native";
import { createDrawerNavigator } from "@react-navigation/drawer";
import StackNavigator from "./StackNavigator";
import Card from "./Card";

export default function DrawerNavigator() {
  const Drawer = createDrawerNavigator();

  function CardStackScreen() {
    return <StackNavigator />;
  }

  function DetailsScreen({ navigation }) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <Text>Details Screen</Text>
        <Button
          title="Go to Details... again"
          onPress={() => navigation.navigate("Detail")}
        />
      </View>
    );
  }
  return (
    <Drawer.Navigator>
      <Drawer.Screen name="Card" component={CardStackScreen} />
      <Drawer.Screen name="Details" component={DetailsScreen} />
    </Drawer.Navigator>
  );
}
