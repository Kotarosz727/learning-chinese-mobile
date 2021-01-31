import React, { useState, useEffect } from "react";
import {
  Card,
  ListItem,
  Button,
  Icon,
  TouchableOpacity,
} from "react-native-elements";
import { StyleSheet, Text, View, FlatList } from "react-native";
import Content from "./content";
import ChineseInterator from "../function/ChineseInterator";

export default function card({data}) {

  return (
    <View>
      <FlatList
        data={data}
        renderItem={({ item }) => (
          <Card
            containerStyle={{
              height: 200,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Content item={item} />
          </Card>
        )}
      />
    </View>
  );
}
