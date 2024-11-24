import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";

export default function FootballIndex() {
  const router = useRouter();
  const [data, setData] = useState<any>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        "https://v3.football.api-sports.io/fixtures?live=all",
        {
          method: "GET",
          headers: {
            "x-rapidapi-host": "v3.football.api-sports.io",
            "x-rapidapi-key": "e8bec00c15ee0502a20e0db84a81ac93",
          },
        }
      );
      const res = await response.json();
      setData(res.response);
      await AsyncStorage.setItem("footballData", JSON.stringify(res.response));
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredData = searchQuery
    ? data.filter(
        (item: any) =>
          item.teams.home.name
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          item.teams.away.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : data;

  const handleNavigate = (item: any) => {
    router.push({
      pathname: "/(football)/details",
      params: { fixture: JSON.stringify(item) },
    });
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#f5f5f5", padding: 10 }}>
      {/* Header */}
      <View style={{ marginBottom: 20 }}>
        <Text style={{ fontSize: 24, fontWeight: "bold", textAlign: "center" }}>
          Live Football Matches
        </Text>
        <TextInput
          placeholder="Search teams or leagues"
          value={searchQuery}
          onChangeText={setSearchQuery}
          style={{
            marginTop: 10,
            backgroundColor: "#fff",
            padding: 10,
            borderRadius: 5,
            borderWidth: 1,
            borderColor: "#ddd",
          }}
        />
      </View>

      {/* Refresh Button */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          marginBottom: 10,
        }}
      >
        <Text style={{ fontSize: 16, color: "#666" }}>
          Total Matches: {filteredData.length}
        </Text>
        <TouchableOpacity onPress={fetchData}>
          <Text
            style={{
              fontSize: 16,
              color: "#1E90FF",
              textDecorationLine: "underline",
            }}
          >
            Refresh
          </Text>
        </TouchableOpacity>
      </View>

      {/* Matches List */}
      {loading ? (
        <ActivityIndicator size="large" color="#1E90FF" />
      ) : (
        <ScrollView style={{ flex: 1 }}>
          {filteredData.map((item: any, index: number) => (
            <TouchableOpacity
              key={item.fixture.id}
              onPress={() => {
                handleNavigate(item);
                console.log(item);
              }} // Pass the fixture data to the Details screen
              style={{
                flex: 1,
                marginVertical: 10,
                padding: 15,
                backgroundColor: "#ffffff",
                borderRadius: 10,
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 4,
                elevation: 3,
              }}
            >
              {/* Match Index */}
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: "bold",
                  color: "#555",
                  marginBottom: 5,
                }}
              >
                {index + 1}.
              </Text>

              {/* League */}
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginBottom: 10,
                }}
              >
                <Image
                  source={{ uri: item.league.logo }}
                  style={{ width: 20, height: 20, marginRight: 10 }}
                />
                <Text
                  style={{ fontSize: 14, color: "#666", fontWeight: "600" }}
                >
                  {item.league.name}
                </Text>
              </View>

              {/* Teams and Scores */}
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 10,
                }}
              >
                {/* Home Team */}
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <Image
                    source={{ uri: item.teams.home.logo }}
                    style={{ width: 30, height: 30, marginRight: 10 }}
                  />
                  <Text
                    style={{ fontSize: 10, fontWeight: "600", color: "#333" }}
                  >
                    {item.teams.home.name}
                  </Text>
                </View>

                {/* Score */}
                <Text
                  style={{ fontSize: 16, fontWeight: "bold", color: "#333" }}
                >
                  {item.goals.home !== null
                    ? `${item.goals.home} - ${item.goals.away}`
                    : "vs"}
                </Text>

                {/* Away Team */}
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <Image
                    source={{ uri: item.teams.away.logo }}
                    style={{ width: 30, height: 30, marginRight: 10 }}
                  />
                  <Text
                    style={{ fontSize: 10, fontWeight: "600", color: "#333" }}
                  >
                    {item.teams.away.name}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}
    </View>
  );
}
