import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity, Image } from "react-native";
import BouncyCheckbox from "react-native-bouncy-checkbox";
import firebase from "firebase/compat/app";
import "firebase/compat/auth";

export default function Signup({ navigation }) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSignup = () => {
    firebase.auth().createUserWithEmailAndPassword(email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        firebase.firestore().collection("users").doc(user.uid).set({
          username: username,
          email: email,
        })
        .then(() => {
          navigation.reset({
            index: 0,
            routes: [{ name: "Home" }],
          });
        })
        .catch((error) => {
          alert(error.message);
        });
      })
      .catch((error) => {
        alert(error.message);
      });
  };

  return (
    <View style={styles.container}>
      <Image source={require('../assets/signup.png')} style={styles.image} />
      <Text style={styles.title}>Create your free account</Text>
      <Text style={styles.label}>Username:</Text>
      <TextInput
        style={styles.input}
        placeholder="e.g. john_doe"
        placeholderTextColor="#ccc"
        value={username}
        onChangeText={setUsername}
      />
      <Text style={styles.label}>Email:</Text>
      <TextInput
        style={styles.input}
        placeholder="e.g. john@example.com"
        placeholderTextColor="#ccc"
        value={email}
        onChangeText={setEmail}
      />
      <Text style={styles.label}>Set New Password:<Text style={{fontWeight:'400', color:'grey',}}> (Don't forget your password)</Text></Text>
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
          fillColor="#f4c531"
          textStyle={styles.checkboxText}
          iconStyle={styles.checkboxIcon}
        />
      </View>
      <TouchableOpacity style={styles.button} onPress={handleSignup}>
        <Text style={styles.buttonText}>Signup</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate("Login")}>
        <Text style={styles.textButton}>Already have an account?<Text style={{color:'#f4c531', fontWeight:'bold'}}> Login</Text></Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 16,
    backgroundColor: '#FAF9F6',
  },
  image: {
    width: 250,
    height: 250,
    alignSelf: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 25,
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
    borderColor: "#f4c531",
  },
  button: {
    backgroundColor: "#f4c531",
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
});
