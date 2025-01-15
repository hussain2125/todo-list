import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, StatusBar, FlatList } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import BouncyCheckbox from "react-native-bouncy-checkbox";
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";

export default function CompletedTasks({ navigation }) {
  const [completedNotes, setCompletedNotes] = useState([]);

  useEffect(() => {
    const user = firebase.auth().currentUser;
    if (user) {
      const unsubscribe = firebase.firestore()
        .collection("notes")
        .where("userId", "==", user.uid)
        .where("completed", "==", true)
        .onSnapshot((snapshot) => {
          const notesList = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }));
          setCompletedNotes(notesList);
        });
      return () => unsubscribe();
    }
  }, []);

  const handleUncompleteNote = (id, completed) => {
    firebase.firestore().collection("notes").doc(id).update({
      completed: !completed
    });
  };

  const handleViewNote = (note) => {
    navigation.navigate("ViewNote", { note });
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case 'Personal':
        return '#d4edda'; // light green
      case 'Work':
        return '#d1ecf1'; // light blue
      case 'Important':
        return '#f8d7da'; // light red
      case 'Birthday':
        return '#ffe4b5'; // light orange
      default:
        return '#f9f9f9'; // default color
    }
  };

  const calculateDaysRemaining = (dueDate) => {
    const today = new Date();
    const timeDiff = dueDate.getTime() - today.getTime();
    const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
    if (daysDiff === 0) return "Today";
    if (daysDiff === 1) return "Tomorrow";
    if (daysDiff === -1) return "Yesterday";
    if (daysDiff < -1) return null;
    return `${daysDiff} days remaining`;
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#FAF9F6" barStyle="dark-content" />
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="#000" />
          </TouchableOpacity>
          <Text style={styles.title}>Completed Tasks</Text>
        </View>
      </View>
      <FlatList
        data={completedNotes}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => handleViewNote(item)}>
            <View style={[styles.noteContainer, { backgroundColor: getCategoryColor(item.category) }]}>
              <View style={styles.noteContent}>
                <View style={styles.noteRow}>
                  <Text style={[styles.noteTitle, item.completed && styles.completedText]} numberOfLines={1}>
                    {item.title}
                  </Text>
                  <BouncyCheckbox
                    isChecked={item.completed}
                    onPress={() => handleUncompleteNote(item.id, item.completed)}
                    fillColor="#006bff"
                    text=""
                    iconStyle={styles.checkboxIcon}
                    style={styles.checkbox} // Align checkbox vertically center
                  />
                </View>
                <View style={styles.dateContainer}>
                  <Ionicons name="calendar" size={16} color="#888" />
                  <Text style={styles.noteDate}>{new Date(item.date.toDate()).toLocaleDateString('en-GB')}</Text>
                  {calculateDaysRemaining(new Date(item.date.toDate())) && (
                    <Text style={styles.daysRemaining}>
                      ({calculateDaysRemaining(new Date(item.date.toDate()))})
                    </Text>
                  )}
                </View>
                {/* <View style={styles.separator} />
                <Text style={styles.noteBody} numberOfLines={1}>{item.body}</Text>
                <Text style={styles.noteCategory}>{item.category}</Text> */}
              </View>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: StatusBar.currentHeight + 20,
    padding: 16,
    backgroundColor: '#FAF9F6',
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#000",
    marginLeft: 20,
  },
  iconButton: {
    borderRadius: 5,
    marginHorizontal: 5,
    width: 50,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f0f0f0",
    padding: 5,
  },
  noteContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
    marginVertical: 10,
    borderRadius: 10,
    backgroundColor: "#FAF9F6",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  noteContent: {
    flex: 1,
  },
  noteRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  noteTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
    width: "90%",
  },
  dateContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 5,
  },
  noteDate: {
    fontSize: 14,
    color: "#888",
    marginLeft: 5,
  },
  daysRemaining: {
    fontSize: 14,
    color: "#888",
    marginLeft: 10,
  },
  separator: {
    height: 1,
    backgroundColor: "#ccc",
    marginVertical: 10,
  },
  noteBody: {
    fontSize: 14,
    color: "#888",
  },
  noteCategory: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#000",
    marginTop: 5,
  },
  checkboxIcon: {
    borderColor: "#006bff",
  },
  checkbox: {
    position: "absolute",
    right: 0,
    top: "100%", // Move the checkbox further down
    transform: [{ translateY: -12 }], // Adjust based on checkbox height
  },
  completedText: {
    textDecorationLine: 'line-through',
    color: '#888',
  },
});
