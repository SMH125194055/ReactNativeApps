import React from "react";
import { View, Text, StyleSheet, FlatList } from "react-native";

export default function Notifications() {
  const notifications = [
    { id: "1", message: "You have a new message!" },
    { id: "2", message: "Your profile was updated successfully." },
    { id: "3", message: "A new event is available near you!" },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Notifications</Text>
      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <Text style={styles.notification}>{item.message}</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f9f9f9",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  notification: {
    fontSize: 16,
    marginVertical: 10,
    backgroundColor: "#e0e0e0",
    padding: 10,
    borderRadius: 8,
  },
});
