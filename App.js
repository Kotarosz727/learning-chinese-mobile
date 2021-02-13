import React, { useState, useEffect } from "react";
import { Text, View, StyleSheet, TextInput } from "react-native";
import { NavigationContainer, useFocusEffect } from "@react-navigation/native";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { createStackNavigator } from "@react-navigation/stack";
import Icon5 from "react-native-vector-icons/FontAwesome5";
import Icon from "react-native-vector-icons/FontAwesome";
import Ionicons from "react-native-vector-icons/Ionicons";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import Data from "./components/data";
import { Button, Overlay, Input } from "react-native-elements";
import ChineseInterator from "./function/ChineseInterator";
import Amplify, { Auth } from "aws-amplify";
import awsconfig from "./aws-exports";
import translateFunction from "./function/translate";
import * as WebBrowser from "expo-web-browser";
import Pinyin from "chinese-to-pinyin";
import * as Speech from "expo-speech";

Amplify.configure(awsconfig);

// async function urlOpener(url, redirectUrl) {
//   const { type, url: newUrl } = await WebBrowser.openAuthSessionAsync(
//     url,
//     redirectUrl
//   );

//   if (type === "success" && Platform.OS === "ios") {
//     WebBrowser.dismissBrowser();
//     return Linking.openURL(newUrl);
//   }
// }

// Amplify.configure({
//   ...awsconfig,
//   oauth: {
//     ...awsconfig.oauth,
//     urlOpener,
//   },
// });

export default function App() {
  const [username, setUsername] = useState("");
  const [userid, setUserid] = useState(null);
  const [data, setData] = useState([]);
  const [favorite, setFavorite] = useState([]);
  const [render, setRender] = useState(true);

  const getData = async (query) => {
    const res = (await new ChineseInterator().fetchLists(query)) ?? [];
    if (!res) {
      return <Text>No data</Text>;
    }
    if (userid) {
      checkIsFavorite(res);
    } else {
      setData(res);
    }
  };

  const checkIsFavorite = async (value) => {
    //make bookmark true if it is bookmarked
    const favoriteItems = await new ChineseInterator().fetchFavorites(userid);

    if (favoriteItems) {
      const bookmarked = [];
      favoriteItems.map((r) => {
        bookmarked.push(r.chinese);
      });
      value.map((v) => {
        if (bookmarked.findIndex((item) => item === v.chinese) >= 0) {
          v.bookmark = true;
        }
      });
    }
    console.log("check if favorite");
    // setRender(!render);
    setData(value);
  };

  const getfavorites = async () => {
    // const res = await new ChineseInterator().getAllAsyncStorage();
    const res = await new ChineseInterator().fetchFavorites(userid);
    if (res) {
      res.map((v) => {
        v.bookmark = true;
      });
      setFavorite(res);
    }
  };

  useEffect(() => {
    Auth.currentAuthenticatedUser()
      .then((user) => {
        setUsername(user.attributes.name);
        setUserid(user.attributes.sub);
      })
      .catch((err) => console.log("error", err));
    console.log("mounted");
  }, []);

  // useEffect(() => {
  //   let mounted = true;
  //   if (mounted && userid && data) {
  //     checkIsFavorite();
  //   }
  //   return () => {
  //     mounted = false;
  //   };
  // }, [userid, data]);

  const Drawer = createDrawerNavigator();
  const HomeStack = createStackNavigator();
  const Level1Stack = createStackNavigator();
  const TranslateStack = createStackNavigator();
  const SignInStack = createStackNavigator();
  const FavoriteStack = createStackNavigator();

  function HomeScreen({ navigation }) {
    return (
      <View style={{ flex: 1, alignItems: "center" }}>
        <View style={{ marginTop: 150 }}>
          {username ? (
            <Text style={{ marginBottom: 50, fontSize: 25 }}>
              您好!{username}
            </Text>
          ) : (
            <Text></Text>
          )}
        </View>
        <Button
          title="中国語 Level①"
          onPress={() => navigation.navigate("Level1")}
          type="outline"
          raised={true}
          containerStyle={{ marginBottom: 40, width: 300 }}
        />
        <Button
          title="中国語 Level②"
          onPress={() => navigation.navigate("Level2")}
          type="outline"
          raised={true}
          containerStyle={{ marginBottom: 40, width: 300 }}
        />
      </View>
    );
  }

  function Level1Screen({ navigation }) {
    useEffect(() => {
      let mounted = true;
      navigation.addListener("focus", () => {
        if (mounted) {
          console.log("focus homescreen");
          const query = "level1";
          getData(query);
        }
      });
      return () => {
        mounted = false;
      };
    }, []);

    return <Data data={data} userid={userid} />;
  }

  function Level2Screen({ navigation }) {
    useEffect(() => {
      let mounted = true;
      navigation.addListener("focus", () => {
        if (mounted) {
          console.log("focus homescreen");
          const query = "level2";
          getData(query);
        }
      });
      return () => {
        mounted = false;
      };
    }, []);

    return <Data data={data} userid={userid} />;
  }

  function FavoriteScreen({ navigation }) {
    useEffect(() => {
      navigation.addListener("focus", () => {
        console.log("focus favorite");
        getfavorites();
      });
    });
    return <Data data={favorite} userid={userid} />;
  }

  function TranslateScreen({ navigation }) {
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
          textAlignVertical={"top"}
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
          textAlignVertical={"top"}
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
        <View style={{ position: "absolute", right: 50, bottom: -10 }}>
          <Button title="翻訳" onPress={() => handleTranslate()} />
        </View>
      </View>
    );
  }

  function SignInScreen({ navigation }) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        {/* <Button
          title="FaceBookでログイン"
          icon={<Icon name="facebook-official" size={20} containerStyle={{paddingRight:10}} reverse={true} color="white" />}
          onPress={() => Auth.federatedSignIn({ provider: "Facebook" })}
          style={{ width: 200, marginBottom: 1 }}
        /> */}
        <Icon.Button
          name="facebook"
          size={30}
          backgroundColor="#3b5998"
          style={{ width: 200 }}
        >
          <Text style={{ fontFamily: "Arial", fontSize: 16, color: "white" }}>
            FaceBookでログイン
          </Text>
        </Icon.Button>
        <View style={{ marginTop: 30, marginBottom: 30 }}>
          <Icon.Button
            name="google"
            size={30}
            type="outline"
            style={{ width: 200 }}
          >
            <Text style={{ fontFamily: "Arial", fontSize: 16, color: "white" }}>
              Googleでログイン
            </Text>
          </Icon.Button>
        </View>
        <Text>Create account</Text>
      </View>
    );
  }

  function HomeStackScreen({ navigation }) {
    return (
      <HomeStack.Navigator initialRouteName="Home">
        <HomeStack.Screen
          name="Home"
          component={HomeScreen}
          options={({ route }) => ({
            title: "ホーム",
            headerStyle: {
              backgroundColor: "#03dffc",
            },
            headerTintColor: "#fff",
            headerTitleStyle: {
              fontWeight: "bold",
            },
            headerLeft: () => (
              <Icon5
                name="bars"
                size={23}
                color={"white"}
                style={{ marginLeft: 13 }}
                onPress={() => navigation.openDrawer()}
              />
            ),
            // headerRight: () =>
            //   username ? (
            //     <Text style={{ color: "white" }}>您好!{username}</Text>
            //   ) : (
            //     <Text></Text>
            //   ),
          })}
        />
        <HomeStack.Screen
          name="Level1"
          component={Level1Screen}
          options={({ route }) => ({
            title: "中国語 Level①",
            headerStyle: {
              backgroundColor: "#03dffc",
            },
            headerTintColor: "#fff",
            headerTitleStyle: {
              fontWeight: "bold",
            },
          })}
        />
        <HomeStack.Screen
          name="Level2"
          component={Level2Screen}
          options={({ route }) => ({
            title: "中国語 Level②",
            headerStyle: {
              backgroundColor: "#03dffc",
            },
            headerTintColor: "#fff",
            headerTitleStyle: {
              fontWeight: "bold",
            },
          })}
        />
      </HomeStack.Navigator>
    );
  }

  function SignInStackScreen({ navigation }) {
    return (
      <SignInStack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerStyle: {
            backgroundColor: "#03dffc",
          },
          headerTintColor: "#fff",
          headerTitleStyle: {
            fontWeight: "bold",
          },
          headerLeft: () => (
            <Icon5
              name="bars"
              size={23}
              color={"white"}
              style={{ marginLeft: 13 }}
              onPress={() => navigation.openDrawer()}
            />
          ),
        }}
      >
        <SignInStack.Screen name="SignIn" component={SignInScreen} />
      </SignInStack.Navigator>
    );
  }

  function FavoriteStackScreen({ navigation }) {
    return (
      <FavoriteStack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerStyle: {
            backgroundColor: "#03dffc",
          },
          headerTintColor: "#fff",
          headerTitleStyle: {
            fontWeight: "bold",
          },
          headerLeft: () => (
            <Icon5
              name="bars"
              size={23}
              color={"white"}
              style={{ marginLeft: 13 }}
              onPress={() => navigation.openDrawer()}
            />
          ),
        }}
      >
        <FavoriteStack.Screen
          name="Favorite"
          component={FavoriteScreen}
          options={({ route }) => ({
            title: "ブックマーク",
            headerStyle: {
              backgroundColor: "#03dffc",
            },
            headerTintColor: "#fff",
            headerTitleStyle: {
              fontWeight: "bold",
            },
          })}
        />
      </FavoriteStack.Navigator>
    );
  }

  function TranslateStackScreen({ navigation }) {
    return (
      <TranslateStack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerStyle: {
            backgroundColor: "#03dffc",
          },
          headerTintColor: "#fff",
          headerTitleStyle: {
            fontWeight: "bold",
          },
          headerLeft: () => (
            <Icon5
              name="bars"
              size={23}
              color={"white"}
              style={{ marginLeft: 13 }}
              onPress={() => navigation.openDrawer()}
            />
          ),
        }}
      >
        <TranslateStack.Screen
          name="Translate"
          component={TranslateScreen}
          options={({ route }) => ({
            title: "翻訳",
            headerStyle: {
              backgroundColor: "#03dffc",
            },
            headerTintColor: "#fff",
            headerTitleStyle: {
              fontWeight: "bold",
            },
          })}
        />
      </TranslateStack.Navigator>
    );
  }

  return (
    <NavigationContainer>
      <Drawer.Navigator>
        <Drawer.Screen
          name="ホーム"
          component={HomeStackScreen}
          options={{
            drawerIcon: ({}) => <Ionicons name="home-outline" size={20} />,
          }}
        />
        <Drawer.Screen
          name="ブックマーク"
          component={FavoriteStackScreen}
          options={{
            drawerIcon: ({}) => <Ionicons name="bookmarks-outline" size={20} />,
          }}
        />
        <Drawer.Screen
          name="翻訳"
          component={TranslateStackScreen}
          options={{
            drawerIcon: ({}) => <MaterialIcons name="translate" size={20} />,
          }}
        />
        <Drawer.Screen
          name="SignIn"
          component={SignInStackScreen}
          options={{
            drawerIcon: ({}) => <Ionicons name="log-in-outline" size={20} />,
          }}
        />
      </Drawer.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  HomeButton: {
    paddingBottom: 10,
  },
});
