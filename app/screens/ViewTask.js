import React, { useState, useRef } from "react";
import { View, Text, TextInput, StyleSheet, ScrollView, TouchableOpacity, StatusBar } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
import { Picker } from '@react-native-picker/picker';

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

export default function ViewTask({ route, navigation }) {
  const { note } = route.params;
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(note.title);
  const [body, setBody] = useState(note.body);
  const [date, setDate] = useState(note.date ? note.date.toDate() : new Date());
  const [category, setCategory] = useState(note.category);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showCategoryPicker, setShowCategoryPicker] = useState(false);
  const titleInputRef = useRef(null);

  const categoryColor = getCategoryColor(category);

  const handleSaveNote = () => {
    const user = firebase.auth().currentUser;
    if (user) {
      firebase.firestore().collection("notes").doc(note.id).update({
        title: title.trim(),
        body: body.trim(),
        date: date || new Date(),
        category: category,
        completed: false, // Make the task unchecked when edited
        updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
      })
      .then(() => {
        alert("Note updated!");
        setIsEditing(false);
        navigation.navigate("Home");
      })
      .catch((error) => {
        alert(error.message);
      });
    } else {
      alert("No user is logged in.");
    }
  };

  const handleDeleteNote = () => {
    const user = firebase.auth().currentUser;
    if (user) {
      firebase.firestore().collection("notes").doc(note.id).delete()
      .then(() => {
        alert("Note deleted!");
        navigation.navigate("Home");
      })
      .catch((error) => {
        alert(error.message);
      });
    } else {
      alert("No user is logged in.");
    }
  };

  const handleEditNote = () => {
    setIsEditing(true);
    setTimeout(() => {
      titleInputRef.current.focus();
    }, 100);
  };

  return (
    <View style={[styles.container, { backgroundColor: categoryColor }]}>
      <StatusBar backgroundColor={categoryColor} barStyle="dark-content" />
      {isEditing ? (
        <TextInput
          ref={titleInputRef}
          style={styles.titleInput}
          placeholder="Enter note title"
          placeholderTextColor="#888"
          value={title}
          onChangeText={text => setTitle(text.slice(0, 60))}
        />
      ) : (
        <Text style={styles.title}>{title}</Text>
      )}
      <View style={styles.dateContainer}>
        <Ionicons name="calendar" size={16} color="#888" onPress={() => isEditing && setShowDatePicker(true)} />
        <Text style={styles.noteDate} onPress={() => isEditing && setShowDatePicker(true)}>{date.toLocaleDateString('en-GB')}</Text>
      </View>
      {showDatePicker && (
        <DateTimePicker
          value={date}
          mode="date"
          display="default"
          onChange={(event, selectedDate) => {
            const currentDate = selectedDate || date;
            setShowDatePicker(false);
            setDate(currentDate);
          }}
        />
      )}
      <View style={styles.separator} />
      <ScrollView style={styles.bodyContainer}>
        {isEditing ? (
          <TextInput
            style={styles.bodyInput}
            placeholder="Enter note body"
            placeholderTextColor="#888"
            value={body}
            onChangeText={setBody}
            multiline
          />
        ) : (
          <Text style={styles.body}>{body}</Text>
        )}
      </ScrollView>
      {isEditing && (
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={category}
            style={styles.picker}
            itemStyle={styles.pickerItem}
            onValueChange={(itemValue) => setCategory(itemValue)}
          >
            <Picker.Item label="Personal" value="Personal" />
            <Picker.Item label="Work" value="Work" />
            <Picker.Item label="Important" value="Important" />
            <Picker.Item label="Birthday" value="Birthday" />
          </Picker>
        </View>
      )}
      <TouchableOpacity
        style={styles.floatingButton}
        onPress={isEditing ? handleSaveNote : handleEditNote}
      >
        <Ionicons name={isEditing ? "checkmark" : "pencil"} size={30} color="white" />
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={handleDeleteNote}
      >
        <Ionicons name="trash" size={30} color="white" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20, // Add padding to the overall edit screen
    backgroundColor: '#FAF9F6',
    paddingTop: StatusBar.currentHeight + 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 10,
  },
  titleInput: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#000",
  },
  dateContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  noteDate: {
    fontSize: 14,
    color: "#888",
    marginLeft: 5,
  },
  separator: {
    height: 1,
    backgroundColor: "#ccc",
    marginVertical: 10,
  },
  bodyContainer: {
    flex: 1,
  },
  body: {
    fontSize: 18,
    color: "#000",
  },
  bodyInput: {
    fontSize: 18,
    flex: 1,
    color: "#000",
  },
  pickerContainer: {
    borderColor: "rgba(138, 138, 138, 0.88)", // Increase the opacity of the border
    borderWidth: 1, // Make the border thinner
    borderRadius: 10, // Make more curved
    backgroundColor: "#FAF9F6",
    marginBottom: 20, // Add margin between inputs
    width: "70%", // Make the picker horizontally short
    alignSelf: "flex-start", // Stick to the left side
  },
  picker: {
    width: "100%",
    justifyContent: "center", // Center the text vertically
  },
  pickerItem: {
    height: 40,
  },
  floatingButton: {
    position: "absolute",
    right: 20,
    bottom: 90,
    backgroundColor: "#006bff",
    borderRadius: 50,
    width: 60,
    height: 60,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
    marginVertical: 10,
  },
  deleteButton: {
    position: "absolute",
    right: 20,
    bottom: 20,
    backgroundColor: "red",
    borderRadius: 50,
    width: 60,
    height: 60,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
  },
});
