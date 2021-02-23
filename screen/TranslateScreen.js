import React, { useState } from "react";
import { View } from "react-native";
import { useTheme, Text, TextInput } from "react-native-paper";
import { Button, Overlay, Input } from "react-native-elements";
import Ionicons from "react-native-vector-icons/Ionicons";
import { translateFunction } from "./function/screen_function";
import Pinyin from "chinese-to-pinyin";
import * as Speech from "expo-speech";
import ChineseInterator from "../function/ChineseInterator";

export default function TranslateScreen({ userid }) {
  const [translateToJapanese, translateToCheinese] = useState(true);
  const [text, setText] = useState("");
  const [chinese, setChinese] = useState("");
  const [japanese, setJapanese] = useState("");
  const [translated, setTranslated] = useState("");
  const [visible, setVisible] = useState(false);
  const [pinyin, setPinyin] = useState("");

  const toggleTranslate = () => {
    translateToCheinese(!translateToJapanese);
  };

  const toggleOverlay = () => {
    setVisible(!visible);
  };

  const handleTranslate = async () => {
    const res = await translateFunction(text, translateToJapanese);

    if (!translateToJapanese && res) {
      const chineseWithPinyin = res + "\n" + Pinyin(res);
      setTranslated(chineseWithPinyin);
      setChinese(res);
      setJapanese(text);
      setPinyin(Pinyin(res));
    } else {
      setTranslated(res);
      setChinese(text);
      setJapanese(res);
      setPinyin(Pinyin(text));
    }
  };

  const postNote = async () => {
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
  };

  return (
    <View
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: 400,
      }}
    >
      <Overlay
        isVisible={visible}
        onBackdropPress={() => toggleOverlay()}
        overlayStyle={{ display: "flex", width: 300 }}
      >
        <View>
          <Input value={japanese} />
          <Input value={chinese} />
          <Input value={pinyin} />
          <Button
            title="単語帳へ追加"
            style={{ marginTop: 5 }}
            onPress={() => postNote()}
          />
        </View>
      </Overlay>
      <TextInput
        multiline={true}
        numberOfLines={10}
        editable={true}
        placeholder={translateToJapanese ? "中国語" : "日本語"}
        onChangeText={(value) => setText(value)}
        style={{
          width: 300,
          borderColor: "gray",
          borderWidth: 1,
          marginBottom: 20,
          marginTop: 20,
        }}
      />
      {translateToJapanese ? <Text>中国語</Text> : <Text>日本語</Text>}
      <Ionicons
        name="swap-vertical-sharp"
        size={35}
        onPress={() => toggleTranslate()}
      />
      {translateToJapanese ? <Text>日本語</Text> : <Text>中国語</Text>}
      {translated ? (
        <View>
          <Ionicons
            name="volume-high-outline"
            size={25}
            style={{ position: "absolute", right: 120, bottom: 0 }}
            onPress={() => Speech.speak(chinese, { language: "zh" })}
          />
        </View>
      ) : (
        <Text></Text>
      )}

      <TextInput
        multiline={true}
        numberOfLines={10}
        editable={false}
        placeholder={translateToJapanese ? "日本語" : "中国語"}
        style={{
          width: 300,
          marginTop: 20,
          borderColor: "gray",
          borderWidth: 1,
          marginBottom: 25,
        }}
        value={translated}
      />
      {translated ? (
        <>
          <View>
            <Ionicons
              name="add-circle-sharp"
              size={45}
              color={"#c92a47"}
              onPress={() => toggleOverlay()}
            />
          </View>
        </>
      ) : (
        <Text></Text>
      )}
      <View style={{ position: "absolute", right: 50, bottom: 0 }}>
        <Button title="翻訳" onPress={() => handleTranslate()} />
      </View>
    </View>
  );
}
