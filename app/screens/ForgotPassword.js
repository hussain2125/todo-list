import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity, Image } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import firebase from "firebase/compat/app";
import "firebase/compat/auth";

export default function ForgotPassword({ navigation }) {
  const [email, setEmail] = useState("");

  const handleForgotPassword = () => {
    if (email) {
      firebase.auth().sendPasswordResetEmail(email)
        .then(() => {
          alert("Password reset email sent!");
          navigation.navigate("Login");
        })
        .catch((error) => {
          alert(error.message);
        });
    } else {
      alert("Please enter your email address.");
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.navigate("Login")}>
        <Ionicons name="arrow-back" size={24} color="black" />
        <Text style={styles.backButtonText}> Back</Text>
      </TouchableOpacity>
      <Image source={require('../assets/forgot.png')} style={styles.image} />
      <Text style={styles.title}>Forgot Password?</Text>
      <Text style={styles.label}>Email:</Text>
      <TextInput
        style={styles.input}
        placeholder="e.g. john@example.com"
        placeholderTextColor="#ccc"
        value={email}
        onChangeText={setEmail}
      />
      <TouchableOpacity style={styles.button} onPress={handleForgotPassword}>
        <Text style={styles.buttonText}>Reset Password</Text>
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
  backButton: {
    position: "absolute",
    top: 50,
    left: 10,
    flexDirection: "row",
    alignItems: "center",
  },
  backButtonText: {
    marginLeft: 5,
    fontSize: 16,
    color: "#000",
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
  button: {
    backgroundColor: "#ff7e27",
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
});
