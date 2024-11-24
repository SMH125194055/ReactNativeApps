import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";

export default function CustomHeader({ title, navigation }) {
  const canGoBack = navigation.canGoBack(); // Check if a back action is available
  return (
    <View style={styles.headerContainer}>
      {canGoBack && (
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
      )}
      {/* Title in the Center */}

      <Text style={styles.headerTitle}>{title}</Text>

      {/* Profile Button */}
      <TouchableOpacity
        style={styles.headerButton}
        onPress={() => navigation.navigate("pro")}
      >
        <Ionicons name="person-circle-outline" size={28} color="white" />
      </TouchableOpacity>

      {/* Notification Button */}
      <TouchableOpacity
        style={styles.headerButton}
        onPress={() => navigation.navigate("not")}
      >
        <MaterialIcons name="notifications" size={28} color="white" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#6200EE",
    height: 60,
    paddingHorizontal: 10,
  },
  backButton: {
    marginRight: 10,
  },
  headerTitle: {
    flex: 1,
    textAlign: "center",
    fontSize: 18,
    color: "white",
    fontWeight: "bold",
  },
  headerButton: {
    marginHorizontal: 10,
  },
});
