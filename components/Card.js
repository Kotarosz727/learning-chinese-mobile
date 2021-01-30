import React from "react";
import { Card, ListItem, Button, Icon } from "react-native-elements";
import { StyleSheet, Text, View, FlatList } from "react-native";
import Icon5 from "react-native-vector-icons/FontAwesome5";

export default function card({ data }) {
  const bookmark = (
    <>
      <Icon5 name="bookmark" size={25} />
    </>
  );
  const speaker = <Icon5 name="volume-up" size={25} />;
  const front = (item) => {
    return <Text style={styles.content}>{item.japanese}</Text>;
  };
  const back = (item) => {
    return (
      <>
        <Text style={{ marginBottom: 15, top: 0 }}>{speaker}</Text>
        <Text style={styles.content}>{item.chinese}</Text>
        <Text style={styles.pinin}>{item.pinin}</Text>
        <Text style={styles.bookmark}>{bookmark}</Text>
      </>
    );
  };

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
            {back(item)}
          </Card>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    fontWeight: "bold",
    fontSize: 30,
  },
  pinin: {
    marginTop: 20,
    textAlign: "center",
    fontSize: 18,
  },
  bookmark: {
    // position: "absolute",
    bottom: 0,
    left: 0,
    marginTop: 10
  },
});
