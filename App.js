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

import HomeComponent from "./screen/HomeScreen";
import TranslateComponent from "./screen/TranslateScreen";
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

  const Drawer = createDrawerNavigator();
  const HomeStack = createStackNavigator();
  const Level1Stack = createStackNavigator();
  const TranslateStack = createStackNavigator();
  const SignInStack = createStackNavigator();
  const FavoriteStack = createStackNavigator();

  function HomeScreen({ navigation }) {
    return <HomeComponent navigation={navigation} username={username} />;
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

  function TranslateScreen() {
    return <TranslateComponent userid={userid} />;
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
