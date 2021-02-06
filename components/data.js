import React, { useState, useEffect } from "react";
import {
  Card,
  ListItem,
  Button,
  Icon,
  TouchableOpacity,
} from "react-native-elements";
import { StyleSheet, Text, View, FlatList, Animated } from "react-native";
import Content from "./content";
import IconAnt from "react-native-vector-icons/AntDesign";

export default function data({ data, userid }) {
  const perPage = 20;
  const [endPage, setEndPage] = useState(20);
  const [pageData, setPageData] = useState(data);
  const [currentPage, setCurrentPage] = useState(0);
  const lastPage = Math.floor(data / perPage);

  useEffect(() => {
    const startPage = 0;
    setPageData(data.slice(startPage, endPage));
    setCurrentPage(currentPage + perPage);
  }, [endPage]);

  function goNext() {
    setEndPage(endPage + perPage);
  }
  function footer() {
    return (currentPage > data.length) | (data.length <= 20) ? (
      ""
    ) : (
      <IconAnt
        onPress={() => goNext()}
        size={30}
        name="downcircle"
        style={styles.rightIcon}
      />
    );
  }

  return (
    <FlatList
      ListFooterComponent={() => footer()}
      keyExtractor={(item, index) => index.toString()}
      data={pageData}
      renderItem={({ item }) => <Content item={item} userid={userid} />}
    />
  );
}

const styles = StyleSheet.create({
  rightIcon: {
    marginTop: 10,
    marginBottom: 20,
    textAlign: "center",
  },
});
