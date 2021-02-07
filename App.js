import React, { useState, useEffect } from "react";
import { Text, View } from "react-native";
import { NavigationContainer, useFocusEffect } from "@react-navigation/native";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { createStackNavigator } from "@react-navigation/stack";
import Icon5 from "react-native-vector-icons/FontAwesome5";
import Data from "./components/data";
import { Button, ThemeProvider, Header } from "react-native-elements";
import ChineseInterator from "./function/ChineseInterator";
import Amplify, { Auth } from "aws-amplify";
import awsconfig from "./aws-exports";
import * as WebBrowser from "expo-web-browser";
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
  const [username, setUsername] = useState("hi");
  const [userid, setUserid] = useState(null);
  const [data, setData] = useState([]);
  const [favorite, setFavorite] = useState([]);
  const [render, setRender] = useState(true);

  const getData = async () => {
    const res = (await new ChineseInterator().fetchLists()) ?? [];
    if (!res) {
      return <Text>No data</Text>;
    }
    if (userid) {
      checkIsFavorite(data);
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
    setRender(!render);
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
    console.log("mountend");

    let mounted = true;
    if (mounted) {
      getData();
      // getfavorites();
    }
    return () => {
      mounted = false;
    };
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
  const SignInStack = createStackNavigator();
  const FavoriteStack = createStackNavigator();

  function HomeScreen({ navigation }) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <Button
          title="Go to Level1"
          onPress={() => navigation.navigate("Level1")}
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
          getData();
        }
      });
      return () => {
        mounted = false;
      };
    }, [userid]);

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

  function SignInScreen({ navigation }) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <Button
          title="FaceBookでログイン"
          onPress={() => Auth.federatedSignIn({ provider: "Facebook" })}
          style={{ width: 200, marginBottom: 1 }}
        />
        <Button
          title="Googleでログイン"
          onPress={() => Auth.federatedSignIn({ provider: "Google" })}
          style={{ width: 200, marginBottom: 1 }}
        />
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
            headerRight: () =>
              username ? (
                <Text style={{ color: "white" }}>您好!{username}</Text>
              ) : (
                ""
              ),
          })}
        />
        <HomeStack.Screen
          name="Level1"
          component={Level1Screen}
          options={({ route }) => ({
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
        <FavoriteStack.Screen name="Favorite" component={FavoriteScreen} />
      </FavoriteStack.Navigator>
    );
  }

  return (
    <NavigationContainer>
      <Drawer.Navigator>
        <Drawer.Screen name="Home" component={HomeStackScreen} />
        <Drawer.Screen name="SignIn" component={SignInStackScreen} />
        <Drawer.Screen name="Favorite" component={FavoriteStackScreen} />
      </Drawer.Navigator>
    </NavigationContainer>
  );
}
