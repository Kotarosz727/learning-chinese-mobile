import React, { useState, useEffect, useContext, useRef } from "react";
import { Appbar, useTheme, TextInput } from "react-native-paper";
import { StyleSheet, Text, View, FlatList } from "react-native";
import Content from "./content";
import { Overlay, Input, Button } from "react-native-elements";
import { SharedFunction } from "./context";
import ChineseInterator from "../function/ChineseInterator";
import IconAnt from "react-native-vector-icons/AntDesign";

export default function data({ data, userid, type = null }) {
  const perPage = 20;
  const [endPage, setEndPage] = useState(20);
  const [pageData, setPageData] = useState(data);
  const [currentPage, setCurrentPage] = useState(0);
  // const { isDarkTheme } = useContext(SharedFunction);
  const lastPage = Math.floor(data / perPage);
  const [visible, setVisible] = useState(false);
  const [japanese, setJapanese] = useState("");
  const [chinese, setChinese] = useState("");
  const [pinyin, setPinyin] = useState("");

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
      <Text></Text>
    ) : (
      <IconAnt
        onPress={() => goNext()}
        size={40}
        name="downcircle"
        style={styles.rightIcon}
      />
    );
  }

  async function postNote() {
    const data = {
      mychinese: chinese,
      myjapanese: japanese,
      mypinyin: pinyin,
    };
    const res = await new ChineseInterator().postNote(data, userid);
    if (!res) {
      return <Text>単語帳の追加に失敗しました。</Text>;
    } else {
      alert("単語帳に追加しました。");
    }
    setVisible(!visible);
  }

  const OverlayComponent = (
    <Overlay
      isVisible={visible}
      onBackdropPress={() => setVisible(!visible)}
      overlayStyle={{ display: "flex", width: 300, marginBottom: 150 }}
    >
      <View>
        <Input onChangeText={(val) => setJapanese(val)} placeholder="日本語" />
        <Input onChangeText={(val) => setChinese(val)} placeholder="中国語" />
        <Input onChangeText={(val) => setPinyin(val)} placeholder="pinyin" />
        <Button
          title="単語帳へ追加"
          style={{ marginTop: 5 }}
          onPress={() => postNote()}
        />
      </View>
    </Overlay>
  );

  function BarComponent() {
    return (
      <View style={{ marginTop: 50 }}>
        <Appbar style={styles.bottomDark} dark={true}>
          <Appbar.Action
            icon="plus-circle"
            onPress={() => setVisible(!visible)}
            style={{
              marginBottom: 10,
              marginRight: "auto",
              marginLeft: "auto",
            }}
            color={"#196fd1"}
            size={55}
          />
        </Appbar>
      </View>
    );
  }

  return (
    <>
      <FlatList
        ListFooterComponent={() => footer()}
        keyExtractor={(item, index) => index.toString()}
        data={pageData}
        renderItem={({ item, index }) => (
          <Content item={item} userid={userid} index={index} />
        )}
      />
      {OverlayComponent}
      {type && type == "note" && <BarComponent />}
    </>
  );
}

const styles = StyleSheet.create({
  rightIcon: {
    marginTop: 10,
    marginBottom: 40,
    textAlign: "center",
  },
  bottomLight: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "#ffffff",
  },
  bottomDark: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
  },
  iconLight: {
    position: "absolute",
    left: 0,
    right: 0,
    color: "black",
  },
  iconDark: {
    position: "absolute",
    left: 0,
    bottom: 0,
  },
});
