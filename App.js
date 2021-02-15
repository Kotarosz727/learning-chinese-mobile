import React, { useState, useEffect } from "react";
import { Text, View, StyleSheet, TextInput } from "react-native";
import { NavigationContainer, useFocusEffect } from "@react-navigation/native";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { createStackNavigator } from "@react-navigation/stack";
import Icon5 from "react-native-vector-icons/FontAwesome5";
import Ionicons from "react-native-vector-icons/Ionicons";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import Data from "./components/data";
import ChineseInterator from "./function/ChineseInterator";
import Amplify, { Auth } from "aws-amplify";
import awsconfig from "./aws-exports";
import { getData, getfavorites } from "./screen/function/screen_function";
import HomeComponent from "./screen/HomeScreen";
import TranslateComponent from "./screen/TranslateScreen";
import SignInComponent from "./screen/SigninScreen";
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
      navigation.addListener("focus", async() => {
        const res = await getfavorites(userid);
        if(res){
          setFavorite(res)
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

  function SignInScreen() {
    return <SignInComponent />;
  }

  function getTitle(route) {
    const queryName = route.params.query;
    switch (queryName) {
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
          name="content"
          component={ContentScreen}
          options={({ route }) => ({
            title: getTitle(route),
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
