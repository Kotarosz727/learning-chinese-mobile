import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Linking,
  Platform,
} from "react-native";
import { NavigationContainer, useFocusEffect } from "@react-navigation/native";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { createStackNavigator } from "@react-navigation/stack";
import Icon5 from "react-native-vector-icons/FontAwesome5";
import Card from "./components/Card";
import { Button, ThemeProvider, Header } from "react-native-elements";
import ChineseInterator from "./function/ChineseInterator";
import Amplify, { Auth } from "aws-amplify";
import awsconfig from "./aws-exports";
import * as WebBrowser from "expo-web-browser";
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
  const [username, setUsername] = useState("hi");
  const [userid, setUserid] = useState("");
  const [data, setData] = useState([]);
  const [favorite, setFavorite] = useState([]);

  const getData = async () => {
    console.log("getting data");
    const res = (await new ChineseInterator().fetchLists()) ?? [];
    setData(res);
  };

  const getfavorites = async () => {
    const res = (await new ChineseInterator().fetchFavorites(userid)) ?? [];
    setFavorite(res);
  };

  useEffect(() => {
    Auth.currentAuthenticatedUser()
      .then((user) => {
        setUsername(user.attributes.name);
        setUserid(user.attributes.sub);
      })
      .catch((err) => console.log("error", err));
    console.log("mountend!!!!");

    let mounted = true;

    if (mounted) {
      getData();
    }

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    let mounted = true;

    if (mounted) {
      getfavorites();
    }

    return () => {
      mounted = false;
    };
  }, [userid]);

  const Drawer = createDrawerNavigator();
  const HomeStack = createStackNavigator();
  const SignInStack = createStackNavigator();
  const FavoriteStack = createStackNavigator();

  function HomeScreen({ navigation }) {
    return <Card data={data} />;
  }

  function FavoriteScreen({ navigation }) {
    // useEffect(() => {
    //   let mounted = true;
    //   navigation.addListener("focus", () => {
    //     if (mounted) {
    //       getfavorites();
    //     }
    //   });
    //   return () => {
    //     mounted = false;
    //   };
    // }, [userid]);

    return <Card data={favorite} />;
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
        {/* <Card /> */}
      </View>
    );
  }

  function HomeStackScreen({ navigation }) {
    return (
      <HomeStack.Navigator
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
          headerRight: () =>
            username ? (
              <Text style={{ color: "white" }}>您好!{username}</Text>
            ) : (
              ""
            ),
        }}
      >
        <HomeStack.Screen name="Home" component={HomeScreen} />
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
          headerRight: () =>
            username ? (
              <Text style={{ color: "white" }}>您好!{username}</Text>
            ) : (
              ""
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

          headerRight: () => (username ? <Text>您好! {username}</Text> : ""),
        }}
      >
        <FavoriteStack.Screen name="Favorite" component={FavoriteScreen} />
      </FavoriteStack.Navigator>
    );
  }

  return (
    <NavigationContainer>
      <Drawer.Navigator>
        <Drawer.Screen name="Card" component={HomeStackScreen} />
        <Drawer.Screen name="SignIn" component={SignInStackScreen} />
        <Drawer.Screen name="Favorite" component={FavoriteStackScreen} />
      </Drawer.Navigator>
    </NavigationContainer>
  );
}
