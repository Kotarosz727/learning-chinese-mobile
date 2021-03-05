import React, { useState, useContext } from "react";
import { StyleSheet, View } from "react-native";
import { useTheme, Text, TextInput } from "react-native-paper";
import Icon from "react-native-vector-icons/FontAwesome";
import Icon5 from "react-native-vector-icons/FontAwesome5";
import Ionicons from "react-native-vector-icons/Ionicons";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import * as Speech from "expo-speech";
import ChineseInterator from "../function/ChineseInterator";
import FlipCard from "react-native-flip-card";

export default function content({ item, userid, index }) {
  const [bookmarkStatus, setBookmarkStatus] = useState(item.bookmark);
  const [front, toggleCard] = useState(true);
  const [isItem, setIsItem] = useState(item.chinese);

  async function setFavoriteItem(value) {
    const res = await new ChineseInterator().postFavorite(value, userid);
    if (!res) {
      return <Text>ブックマークに失敗しました。</Text>;
    } else {
      setBookmarkStatus(true);
    }
  }

  async function removeFavoriteItem() {
    const data = {
      userid: userid,
      chinese: item.chinese,
    };
    await new ChineseInterator().deleteFavorite(data);
    if (item.type && item.type == "favorite") {
      setIsItem(false);
    } else {
      setBookmarkStatus(false);
    }
  }
  async function removeNote() {
    const data = {
      userid: userid,
      chinese: item.chinese,
    };
    await new ChineseInterator().deleteNote(data);
    setIsItem(false);
  }
  const bookmark = (
    <Icon
      name="bookmark"
      size={30}
      color="#2b59c4"
      onPress={() => removeFavoriteItem()}
    />
  );
  const bookmarkEmpty = userid ? (
    <Icon name="bookmark-o" size={30} onPress={() => setFavoriteItem(item)} />
  ) : (
    <Text></Text>
  );
  const deleteMark = (
    <MaterialCommunityIcons
      name="delete"
      size={30}
      onPress={() => removeNote()}
    />
  );
  // const arrowRight = (
  //   <Icon5
  //     name="arrow-right"
  //     style={styles.arrowRight}
  //     onPress={() => handleToggle(!front)}
  //     size={30}
  //   />
  // );
  // const Volume = (
  //   <Ionicons
  //     name="volume-high"
  //     onPress={() => Speech.speak(item.chinese, { language: "zh" })}
  //     size={30}
  //     style={{ marginRight: 50 }}
  //   />
  // );
  const frontCard = (item) => {
    return (
      <View style={styles.item}>
        <Text style={styles.content} selectable onPress={() => handleToggle(!front)}>
          {item.japanese}
        </Text>
        {/* My単語帳画面ではブックマークは表示しない */}
        {bookmarkStatus != "note" ? (
          <Text style={styles.bookmark}>
            {bookmarkStatus === true ? bookmark : bookmarkEmpty}
          </Text>
        ) : (
          <Text></Text>
        )}
      </View>
    );
  };
  const backCard = (item) => {
    return (
      <View style={styles.item}>
        <View style={styles.content} onPress={() => handleToggle(!front)}>
          <Text selectable style={styles.content}>{item.chinese}</Text>
        </View>
        <Text
          style={styles.pinin}
          onPress={() => Speech.speak(item.chinese, { language: "zh" })}
        >
          {item.pinin}
        </Text>
        {/* My単語帳画面ではブックマークアイコンではなくデリートアイコンを表示 */}
        {bookmarkStatus != "note" ? (
          <Text style={styles.bookmark}>
            {bookmarkStatus === true ? bookmark : bookmarkEmpty}
          </Text>
        ) : (
          <Text Text style={styles.bookmark}>
            {deleteMark}
          </Text>
        )}
      </View>
    );
  };
  const handleToggle = (value) => {
    toggleCard(value);
  };

  return (
    <FlipCard
      flip={!front}
      flipHorizontal={true}
      flipVertical={false}
      friction={10}
    >
      {/* Face Side */}
      {isItem ? frontCard(item) : <Text></Text>}
      {/* Back Side */}
      {isItem ? backCard(item) : <Text></Text>}
    </FlipCard>
  );
}

const styles = StyleSheet.create({
  item: {
    // backgroundColor: "#f9c2ff",
    borderWidth: 2,
    borderColor: "#dbd7db",
    borderRadius: 6,
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
    height: 230,
    display: "flex",
    justifyContent: "center",
    marginBottom: 20,
  },
  content: {
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 40,
  },
  pinin: {
    marginTop: 32,
    textAlign: "center",
    fontSize: 29,
  },
  bookmark: {
    position: "absolute",
    left: 8,
    bottom: 10,
    color: "black",
  },
  arrowRight: {
    position: "absolute",
    right: 8,
    bottom: 10,
  },
});
