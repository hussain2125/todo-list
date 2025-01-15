import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, StatusBar, FlatList, Modal, Image } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import BouncyCheckbox from "react-native-bouncy-checkbox";
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";

export default function Home({ navigation }) {
  const [notes, setNotes] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [username, setUsername] = useState("");

  useEffect(() => {
    const user = firebase.auth().currentUser;
    if (user) {
      firebase.firestore().collection("users").doc(user.uid).get()
        .then((doc) => {
          if (doc.exists) {
            setUsername(doc.data().username);
          }
        })
        .catch((error) => {
          alert(error.message);
        });

      const unsubscribe = firebase.firestore()
        .collection("notes")
        .where("userId", "==", user.uid)
        .where("completed", "==", false)
        .onSnapshot((snapshot) => {
          const notesList = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }));
          setNotes(notesList);
        });
      return () => unsubscribe();
    }
  }, []);

  const handleLogout = () => {
    firebase.auth().signOut()
      .then(() => {
        navigation.reset({
          index: 0,
          routes: [{ name: "Login" }],
        });
      })
      .catch((error) => {
        alert(error.message);
      });
  };

  const handleCompleteNote = (id, completed) => {
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
          <TouchableOpacity onPress={() => setModalVisible(true)}>
            <Ionicons name="chevron-down" size={24} color="#000" />
          </TouchableOpacity>
          <Text style={styles.title}>Todo list</Text>
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.iconButton} onPress={() => navigation.navigate("CompletedTasks")}>
            <Ionicons name="checkmark-done" size={24} color="#000" />
            <Text style={styles.iconButtonText}>Completed</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton} onPress={handleLogout}>
            <Ionicons name="exit-outline" size={24} color="#000" />
            <Text style={styles.iconButtonText}>Logout</Text>
          </TouchableOpacity>
        </View>
      </View>
      {notes.length === 0 ? (
        <View style={styles.noTasksContainer}>
          <Text style={styles.noTasksText}>No Task, + button to add task</Text>
        </View>
      ) : (
        <FlatList
          data={notes}
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
                      onPress={() => handleCompleteNote(item.id, item.completed)}
                      fillColor="#006bff"
                      text=""
                      iconStyle={styles.checkboxIcon}
                      style={styles.checkbox} // Align checkbox vertically center
                    />
                  </View>
                  <View style={styles.dateContainer}>
                    <Ionicons name="calendar" size={16} color="#888" />
                    <Text style={styles.noteDate}>{new Date(item.date.toDate()).toLocaleDateString('en-GB')}</Text>
                    {calculateDaysRemaining(new Date(item.date.toDate())) === "Yesterday" && !item.completed ? (
                      <Text style={styles.yesterdayText}>
                        (Yesterday)
                      </Text>
                    ) : (
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
      )}
      <TouchableOpacity style={styles.floatingButton} onPress={() => navigation.navigate("AddNote")}>
        <Ionicons name="add" size={34} color="#fff" />
      </TouchableOpacity>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Hi, {username}</Text>
            <Text style={styles.modalText}><Text style={{fontWeight:'bold'}}>Todo List</Text> Copyright ©2025</Text>
            <Text style={styles.modalText}>Bahauddin Zakariya University Project</Text>
            <View style={styles.separator} />
            <View style={styles.modalSeparator} />
            <View style={styles.modalButtonContainer}>
              <TouchableOpacity style={styles.modalButton} onPress={handleLogout}>
                <Image source={require('../assets/exit.png')} style={styles.icon} />
              </TouchableOpacity>
            </View>
            <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}>
              <Ionicons name="close" size={24} color="black" />
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
  buttonContainer: {
    flexDirection: "row",
  },
  iconButton: {
    borderRadius: 5,
    marginHorizontal: 5,
    width: 60,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f0f0f0",
    padding: 6,
  },
  iconButtonText: {
    fontSize: 10,
    color: "#000",
    textAlign: "center",
  },
  floatingButton: {
    position: "absolute",
    bottom: 20,
    right: 20,
    backgroundColor: "#006bff",
    borderRadius: 50,
    padding: 15,
    elevation: 5,
    paddingHorizontal: 16,
  },
  icon: {
    width: 100,
    height: 100,
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
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(157, 157, 157, 0.57)",
  },
  modalContent: {
    width: "80%",
    backgroundColor: "#FAF9F6",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "black",
    marginBottom: 10,
  },
  modalText: {
    fontSize: 16,
    color: "black",
    textAlign: "center",
    marginBottom: 10,
  },
  modalSeparator: {
    height: 1,
    backgroundColor: "black",
    marginVertical: 10,
    width: "100%",
  },
  modalButtonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    marginTop: 10,
  },
  modalButton: {
    alignItems: "center",
  },
  modalButtonText: {
    fontSize: 14,
    color: "#fff",
    marginTop: 5,
  },
  closeButton: {
    position: "absolute",
    top: 10,
    right: 10,
    color: "black",
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
  noTasksContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  noTasksText: {
    fontSize: 18,
    color: "#888",
  },
  yesterdayText: {
    fontSize: 14,
    color: "red",
    fontWeight: "bold",
    marginLeft: 10,
  },
  completedText: {
    textDecorationLine: 'line-through',
    color: '#888',
  },
});
