import React, { useState, useEffect, useMemo } from "react";
import {
  Text,
  View,
  StyleSheet,
  TextInput,
  Linking,
  Platform,
} from "react-native";
import {
  NavigationContainer,
  useFocusEffect,
  DarkTheme,
  DefaultTheme,
} from "@react-navigation/native";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { createStackNavigator } from "@react-navigation/stack";
import Icon5 from "react-native-vector-icons/FontAwesome5";
import Ionicons from "react-native-vector-icons/Ionicons";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import Data from "./components/data";
import Amplify, { Auth, Hub } from "aws-amplify";
import awsconfig from "./aws-exports";
import {
  getData,
  getfavorites,
  getNotes,
} from "./screen/function/screen_function";
import HomeComponent from "./screen/HomeScreen";
import TranslateComponent from "./screen/TranslateScreen";
import SignInComponent from "./screen/SigninScreen";
import { DrawerContent } from "./screen/DrawerContent";
import * as WebBrowser from "expo-web-browser";
import {
  Drawer,
  Provider as PaperProvider,
  DarkTheme as PaperDarkTheme,
  DefaultTheme as PaperDefaultTheme,
} from "react-native-paper";
import { SharedFunction } from "./components/context";

// Amplify.configure(awsconfig);

async function urlOpener(url, redirectUrl) {
  const { type, url: newUrl } = await WebBrowser.openAuthSessionAsync(
    url,
    redirectUrl
  );

  if (type === "success" && Platform.OS === "ios") {
    WebBrowser.dismissBrowser();
    return Linking.openURL(newUrl);
  }
}

Amplify.configure({
  ...awsconfig,
  oauth: {
    ...awsconfig.oauth,
    urlOpener,
  },
});

export default function App() {
  const [user, setUser] = useState("");
  const [username, setUsername] = useState("");
  const [userid, setUserid] = useState(null);
  const [data, setData] = useState([]);
  const [favorite, setFavorite] = useState([]);
  const [note, setNote] = useState([]);
  const [isDarkTheme, setIsDarkTheme] = useState(false);

  const CustomDefaultTheme = {
    ...DefaultTheme,
    ...PaperDefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      ...PaperDefaultTheme.colors,
      background: "#ffffff",
      text: "#333333",
    },
  };

  const CustomDarkTheme = {
    ...DarkTheme,
    ...PaperDarkTheme,
    colors: {
      ...DarkTheme.colors,
      ...PaperDarkTheme.colors,
      background: "#333333",
      text: "#ffffff",
    },
  };

  const theme = isDarkTheme ? CustomDarkTheme : CustomDefaultTheme;

  useEffect(() => {
    Hub.listen("auth", ({ payload: { event, data } }) => {
      switch (event) {
        case "signIn":
          setUser(data);
          break;
        case "signOut":
          setUser("");
          setUsername("");
          setUserid("");
          break;
      }
    });
    Auth.currentAuthenticatedUser()
      .then((user) => {
        if (user) {
          setUsername(user.attributes.name);
          setUserid(user.attributes.sub);
        }
      })
      .catch((err) => {
        // setUsername("");
        // setUserid("");
        console.log("error", err);
      });
  });

  const sharedFunction = useMemo(() => ({
    toggleTheme: () => {
      setIsDarkTheme(!isDarkTheme);
    },
    isDarkTheme: () => {
      return isDarkTheme;
    },
  }));

  const Drawer = createDrawerNavigator();
  const HomeStack = createStackNavigator();
  const TranslateStack = createStackNavigator();
  const SignInStack = createStackNavigator();
  const FavoriteStack = createStackNavigator();
  const NoteStack = createStackNavigator();

  const errorMsg = <Text>データが取得できませんでした。</Text>;

  function HomeScreen({ navigation }) {
    return <HomeComponent navigation={navigation} username={username} />;
  }

  function ContentScreen({ route, navigation }) {
    const query = route.params.query;
    useEffect(() => {
      let mounted = true;
      navigation.addListener("focus", async () => {
        if (mounted) {
          const res = await getData(query, userid);
          if (res) {
            setData(res);
          } else {
            return errorMsg;
          }
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
      let mounted = true;
      navigation.addListener("focus", async () => {
        const res = await getfavorites(userid);
        if (res) {
          setFavorite(res);
        } else {
          return errorMsg;
        }
      });
      return () => {
        mounted = false;
      };
    });
    return <Data data={favorite} userid={userid} />;
  }

  function TranslateScreen() {
    return <TranslateComponent userid={userid} />;
  }

  function NoteScreen({ navigation }) {
    useEffect(() => {
      let mounted = true;
      navigation.addListener("focus", async () => {
        const res = await getNotes(userid);
        if (res) {
          setNote(res);
        } else {
          return errorMsg;
        }
      });
      return () => {
        mounted = false;
      };
    });
    return <Data data={note} userid={userid} type={"note"} />;
  }

  function SignInScreen() {
    return <SignInComponent />;
  }

  function getTitle(route) {
    const queryName = route.params.query;
    switch (queryName) {
      case "120":
        return "基本120";
      case "nichijo":
        return "日常会話";
      case "dousa":
        return "動詞";
    }
  }

  function HomeStackScreen({ navigation }) {
    return (
      <HomeStack.Navigator initialRouteName="Home">
        <HomeStack.Screen
          name="Home"
          component={HomeScreen}
          options={() => ({
            title: "ホーム",
            // headerStyle: {
            //   backgroundColor: "#0f0f0f",
            // },
            // headerTintColor: "#fff",
            headerTitleStyle: {
              fontWeight: "bold",
            },
            headerLeft: ({ color }) => (
              <Icon5
                name="bars"
                size={23}
                color={color}
                style={{ marginLeft: 13 }}
                onPress={() => navigation.openDrawer()}
              />
            ),
          })}
        />
        <HomeStack.Screen
          name="content"
          component={ContentScreen}
          options={({ route }) => ({
            title: getTitle(route),
            // headerStyle: {
            //   backgroundColor: "#0f0f0f",
            // },
            // headerTintColor: "#fff",
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
            backgroundColor: "#0f0f0f",
          },
          headerTintColor: "#fff",
          headerTitleStyle: {
            fontWeight: "bold",
          },
          headerLeft: () => (
            <Icon5
              name="bars"
              size={23}
              // color={"white"}
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
          // headerStyle: {
          //   backgroundColor: "#0f0f0f",
          // },
          // headerTintColor: "#fff",
          headerTitleStyle: {
            fontWeight: "bold",
          },
          headerLeft: () => (
            <Icon5
              name="bars"
              size={23}
              // color={"white"}
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
            // headerStyle: {
            //   backgroundColor: "#0f0f0f",
            // },
            // headerTintColor: "#fff",
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
          // headerStyle: {
          //   backgroundColor: "#0f0f0f",
          // },
          // headerTintColor: "#fff",
          headerTitleStyle: {
            fontWeight: "bold",
          },
          headerLeft: () => (
            <Icon5
              name="bars"
              size={23}
              // color={"white"}
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
            // headerStyle: {
            //   backgroundColor: "#0f0f0f",
            // },
            // headerTintColor: "#fff",
            headerTitleStyle: {
              fontWeight: "bold",
            },
          })}
        />
      </TranslateStack.Navigator>
    );
  }

  function NoteStackScreen({ navigation }) {
    return (
      <NoteStack.Navigator
        initialRouteName="Home"
        screenOptions={{
          // headerStyle: {
          //   backgroundColor: "#0f0f0f",
          // },
          // headerTintColor: "#fff",
          headerTitleStyle: {
            fontWeight: "bold",
          },
          headerLeft: () => (
            <Icon5
              name="bars"
              size={23}
              // color={"white"}
              style={{ marginLeft: 13 }}
              onPress={() => navigation.openDrawer()}
            />
          ),
        }}
      >
        <NoteStack.Screen
          name="Note"
          component={NoteScreen}
          options={({ route }) => ({
            title: "My単語帳",
            // headerStyle: {
            //   backgroundColor: "#0f0f0f",
            // },
            // headerTintColor: "#fff",
            headerTitleStyle: {
              fontWeight: "bold",
            },
          })}
        />
      </NoteStack.Navigator>
    );
  }

  return (
    <SharedFunction.Provider value={sharedFunction}>
      <PaperProvider theme={theme}>
        <NavigationContainer theme={theme}>
          <Drawer.Navigator
            drawerContent={(props) => (
              <DrawerContent props={props} username={username} />
            )}
          >
            {username ? (
              <>
                <Drawer.Screen
                  name="ホーム"
                  component={HomeStackScreen}
                  options={{
                    drawerIcon: ({}) => (
                      <Ionicons name="home-outline" size={20} />
                    ),
                  }}
                />
                <Drawer.Screen
                  name="ブックマーク"
                  component={FavoriteStackScreen}
                  options={{
                    drawerIcon: ({}) => (
                      <Ionicons name="bookmarks-outline" size={20} />
                    ),
                  }}
                />
                <Drawer.Screen
                  name="翻訳"
                  component={TranslateStackScreen}
                  options={{
                    drawerIcon: ({}) => (
                      <MaterialIcons name="translate" size={20} />
                    ),
                  }}
                />
                <Drawer.Screen
                  name="my単語帳"
                  component={NoteStackScreen}
                  options={{
                    drawerIcon: ({}) => (
                      <Ionicons name="folder-outline" size={20} />
                    ),
                  }}
                />
              </>
            ) : (
              <>
                <Drawer.Screen
                  name="ホーム"
                  component={HomeStackScreen}
                  options={{
                    drawerIcon: ({}) => (
                      <Ionicons name="home-outline" size={20} />
                    ),
                  }}
                />
                <Drawer.Screen
                  name="SignIn"
                  component={SignInStackScreen}
                  options={{
                    drawerIcon: ({}) => (
                      <Ionicons name="log-in-outline" size={20} />
                    ),
                  }}
                />
              </>
            )}
          </Drawer.Navigator>
        </NavigationContainer>
      </PaperProvider>
    </SharedFunction.Provider>
  );
}

const styles = StyleSheet.create({
  HomeButton: {
    paddingBottom: 10,
  },
});
