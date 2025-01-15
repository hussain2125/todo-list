import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity, Image, KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import BouncyCheckbox from "react-native-bouncy-checkbox";
import firebase from "firebase/compat/app";
import "firebase/compat/auth";

export default function Login({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = () => {
    firebase.auth().signInWithEmailAndPassword(email, password)
      .then((userCredential) => {
        navigation.reset({
          index: 0,
          routes: [{ name: "Home" }],
        });
      })
      .catch((error) => {
        alert(error.message);
      });
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Image source={require('../assets/login.png')} style={styles.image} />
        <Text style={styles.title}>Login</Text>
        <Text style={styles.label}>Email:</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. john@example.com"
          placeholderTextColor="#ccc"
          value={email}
          onChangeText={setEmail}
        />
        <Text style={styles.label}>Password:</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your password"
          placeholderTextColor="#ccc"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={!showPassword}
        />
        <View style={styles.checkboxContainer}>
          <BouncyCheckbox
            isChecked={showPassword}
            onPress={() => setShowPassword(!showPassword)}
            text="Show Password"
            fillColor="#006bff"
            textStyle={styles.checkboxText}
            iconStyle={styles.checkboxIcon}
          />
        </View>
        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate("ForgotPassword")}>
          <Text style={styles.textButton}>Forgot Password?</Text>
        </TouchableOpacity>
      </ScrollView>
      <TouchableOpacity onPress={() => navigation.navigate("Signup")} style={styles.bottomTextButton}>
        <Text style={styles.textButton}>Don't have any account?<Text style={{color:'#006bff', fontWeight:'bold'}}> Signup</Text></Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAF9F6',
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 16,
  },
  image: {
    width: 250,
    height: 250,
    alignSelf: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: "center",
    fontWeight: "bold",
    color: "#000",
  },
  label: {
    marginLeft: 10,
    marginBottom: 5,
    fontWeight: "bold",
    color: "#000",
  },
  input: {
    height: 50,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 12,
    padding: 8,
    marginLeft: 10,
    marginRight: 10,
    backgroundColor: "#f9f9f9",
    color: "#000",
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 10,
    marginBottom: 18,
    left: 5,
  },
  checkboxText: {
    textDecorationLine: "none",
    color: "#000",
  },
  checkboxIcon: {
    borderColor: "#006bff",
  },
  button: {
    backgroundColor: "#006bff",
    padding: 15,
    borderRadius: 30,
    marginBottom: 10,
    alignItems: "center",
    marginHorizontal: 20,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  textButton: {
    color: "#000",
    textAlign: "center",
    marginTop: 10,
  },
  bottomTextButton: {
    marginBottom: 20,
    alignSelf: "center",
  },
});
