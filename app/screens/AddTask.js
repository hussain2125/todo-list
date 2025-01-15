import React, { useState } from "react";
import { View, Text, TextInput, StyleSheet, TouchableOpacity, StatusBar } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import firebase from "firebase/compat/app";
import "firebase/compat/firestore";

export default function AddNote({ navigation }) {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [category, setCategory] = useState("Personal");

  const handleSaveNote = () => {
    const user = firebase.auth().currentUser;
    if (user) {
      firebase.firestore().collection("notes").add({
        userId: user.uid,
        title: title.trim(),
        body: body.trim(),
        date: date,
        category: category,
        completed: false, // Save as unchecked by default
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      })
      .then(() => {
        alert("Note saved!");
        navigation.navigate("Home");
      })
      .catch((error) => {
        alert(error.message);
      });
    } else {
      alert("No user is logged in.");
    }
  };

  const hasContent = title.trim().length > 0 || body.trim().length > 0;

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#FAF9F6" barStyle="dark-content" />
      <Text style={styles.heading}>Task</Text>
      <TextInput
        style={styles.titleInput}
        placeholder="Task title"
        placeholderTextColor="#888" // Make the placeholder text darker
        value={title}
        onChangeText={text => setTitle(text.slice(0, 60))}
      />
      <TextInput
        style={styles.bodyInput}
        placeholder="Description"
        placeholderTextColor="#888" // Make the placeholder text darker
        value={body}
        onChangeText={setBody}
        multiline
        textAlignVertical="top" // Ensure text starts from the top
      />
      <Text style={styles.label}>Due Date:</Text>
      <TouchableOpacity onPress={() => setShowDatePicker(true)}>
        <View style={styles.dateInputContainer}>
          <Ionicons name="calendar" size={20} color="#888" style={styles.calendarIcon} />
          <TextInput
            style={styles.dateInput}
            placeholder="Select Due Date"
            placeholderTextColor="#888" // Make the placeholder text darker
            value={date.toLocaleDateString()}
            editable={false}
          />
        </View>
      </TouchableOpacity>
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
      <Text style={styles.label}>Category:</Text>
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
      {hasContent && (
        <TouchableOpacity style={styles.floatingButton} onPress={handleSaveNote}>
          <Ionicons name="checkmark" size={32} color="white" />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    paddingTop: StatusBar.currentHeight + 20,
    backgroundColor: '#FAF9F6',
  },
  heading: {
    fontSize: 30,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#000",
  },
  titleInput: {
    fontSize: 22, // Increase the font size for the title
    fontWeight: "bold",
    marginBottom: 20, // Add margin between inputs
    color: "#000",
    borderColor: "rgba(138, 138, 138, 0.88)", // Increase the opacity of the border
    borderWidth: 1, // Make the border thinner
    borderRadius: 10, // Make more curved
    padding: 10,
    backgroundColor: "#FAF9F6",
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
    color: "#000",
  },
  separator: {
    height: 1,
    backgroundColor: "#444",
    marginVertical: 10,
  },
  bodyInput: {
    fontSize: 20, // Increase the font size for the description
    color: "#000",
    borderColor: "rgba(138, 138, 138, 0.88)", // Increase the opacity of the border
    borderWidth: 1, // Make the border thinner
    borderRadius: 10, // Make more curved
    padding: 10,
    backgroundColor: "#FAF9F6",
    height: 350, // Increase the height of the description box
    marginBottom: 20, // Add margin between inputs
    textAlignVertical: "top", // Ensure text starts from the top
  },
  dateInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderColor: "rgba(138, 138, 138, 0.88)", // Increase the opacity of the border
    borderWidth: 1, // Make the border thinner
    borderRadius: 10, // Make more curved
    padding: 10,
    backgroundColor: "#FAF9F6",
    marginBottom: 20, // Add margin between inputs
  },
  calendarIcon: {
    marginRight: 10,
  },
  dateInput: {
    fontSize: 16,
    color: "#000",
    flex: 1,
  },
  pickerContainer: {
    borderColor: "rgba(138, 138, 138, 0.88)", // Increase the opacity of the border
    borderWidth: 1, // Make the border thinner
    borderRadius: 10, // Make more curved
    backgroundColor: "#FAF9F6",
    marginBottom: 20, // Add margin between inputs
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
    bottom: 20,
    backgroundColor: "#006bff",
    borderRadius: 50,
    width: 60,
    height: 60,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
  },
});
