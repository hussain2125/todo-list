import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import Login from "./app/screens/Login";
import Signup from "./app/screens/Signup";
import Home from "./app/screens/Home";
import ForgotPassword from "./app/screens/ForgotPassword";
import AddNote from "./app/screens/AddTask";
import ViewTask from "./app/screens/ViewTask"; // Update import
import CompletedTasks from "./app/screens/CompletedTasks";
import React, { useEffect, useState } from "react";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBNlqrGzBSV5zmsZSQo4igBGXbgnCFaWgA",
  authDomain: "todo-kamran.firebaseapp.com",
  projectId: "todo-kamran",
  storageBucket: "todo-kamran.firebasestorage.app",
  messagingSenderId: "619287879723",
  appId: "1:619287879723:web:9974377c53bf30a2cbca6e"
};

// Initialize Firebase
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const Stack = createNativeStackNavigator();
export default function App() {
  const [initialRoute, setInitialRoute] = useState(null);

  useEffect(() => {
    const unsubscribe = firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        setInitialRoute("Home");
      } else {
        setInitialRoute("Login");
      }
    });
    return () => unsubscribe();
  }, []);

  if (initialRoute === null) {
    return null; // or a loading spinner
  }

  return (
    <NavigationContainer>
      <StatusBar backgroundColor="#1f1f1f" style="light" />
      <Stack.Navigator initialRouteName={initialRoute}>
        <Stack.Screen
          name="Signup"
          component={Signup}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Login"
          component={Login}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Home"
          component={Home}
          options={{ 
            headerShown: false,
            gestureEnabled: false,
          }}
        />
        <Stack.Screen
          name="ForgotPassword"
          component={ForgotPassword}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="AddNote"
          component={AddNote}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="ViewTask"
          component={ViewTask}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="CompletedTasks"
          component={CompletedTasks}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
