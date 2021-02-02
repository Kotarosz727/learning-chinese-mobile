import React, { useState, useEffect } from "react";
import {
  Card,
  ListItem,
  Button,
  Icon,
  TouchableOpacity,
} from "react-native-elements";
import { StyleSheet, Text, View, FlatList ,Animated } from "react-native";
import Content from "./content";

export default function card({ data }) {
  return (
    <FlatList
      keyExtractor={(item, index) => index.toString()}
      data={data}
      renderItem={({ item }) => <Content item={item} />}
    />
  );
}
