import {
  ActivityIndicator,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  TextInput,
  View,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";

export default function BaseballIndex() {
  const router = useRouter();
  const [data, setData] = useState<any>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const handleNavigate = (item: any) => {
    console.log('sending Item',item);
    router.push({
      pathname: "/(baseball)/details",
      params: { fixture : JSON.stringify(item) },
    });
  };

  const fetchFreshData = async () => {
    setLoading(true);
    const today = new Date();
    const formattedDate = today.toISOString().split("T")[0]; // Extract YYYY-MM-DD
    console.log(formattedDate);
    try {
      const response = await fetch(
        `https://v1.baseball.api-sports.io/games?date=${formattedDate}`,
        {
          method: "GET",
          headers: {
            "x-rapidapi-host": "v1.baseball.api-sports.io",
            "x-rapidapi-key": "e8bec00c15ee0502a20e0db84a81ac93", // Replace with your key
          },
        }
      );
      const res = await response.json();
      setData(res.response);
      console.log(res.response);
      await AsyncStorage.setItem("baseballData", JSON.stringify(res.response));
    } catch (error) {
      console.error("Error fetching fresh data:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchData = async () => {
    const today = new Date();
    const formattedDate = today.toISOString().split("T")[0]; // Extract YYYY-MM-DD
    console.log(formattedDate);
    try {
      const storedData = await AsyncStorage.getItem("baseballData");
      if (storedData) {
        setData(JSON.parse(storedData));
        setLoading(false);
        console.log("Loaded data from local storage.");
      } else {
        console.log("No data in local storage. Fetching from API...");
        const response = await fetch(
          `https://v1.baseball.api-sports.io/games?date=${formattedDate}`,
          {
            method: "GET",
            headers: {
              "x-rapidapi-host": "v1.baseball.api-sports.io",
              "x-rapidapi-key": "e8bec00c15ee0502a20e0db84a81ac93", // Replace with your key
            },
          }
        );
        const res = await response.json();
        setData(res.response);
        console.log("Data fetched from API.", res.response);
        await AsyncStorage.setItem("baseballData", JSON.stringify(res.response));
        console.log("Data fetched and saved to local storage.");
        setLoading(false);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
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


  return (
    <View style={{ flex: 1, justifyContent: "center" }}>
      <View style={{ marginBottom: 20 }}>
        <Text style={{ fontSize: 24, fontWeight: "bold", textAlign: "center" }}>
          Live BaseBall Matches
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
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 10,
          paddingVertical: 5,
          paddingHorizontal: 10,
        }}
      >
        <Text style={{ fontSize: 14, color: "#666" }}>
          Total Records: {data.length}
        </Text>
        <TouchableOpacity onPress={fetchFreshData}>
          <Text
            style={{
              fontSize: 14,
              color: "#1E90FF",
              textDecorationLine: "underline",
            }}
          >
            Refresh
          </Text>
        </TouchableOpacity>
      </View>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <ScrollView style={{ flex: 1, padding: 10 }}>
          {data.map((item: any, index: number) => (
            <TouchableOpacity
              key={item.id}
              onPress={() => handleNavigate(item)}
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
                  style={{
                    fontSize: 14,
                    color: "#666",
                    fontWeight: "600",
                  }}
                >
                  {item.league.name} - {item.country.name}
                </Text>
              </View>
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
      style={{
        fontSize: 10,
        fontWeight: "600",
        color: "#333",
      }}
    >
      {item.teams.home.name}
    </Text>
  </View>

  {/* Score */}
  <Text style={{ fontSize: 16, fontWeight: "bold", color: "#333" }}>
    {item.scores?.home.total !== null && item.scores?.away.total !== null
      ? `${item.scores.home.total} - ${item.scores.away.total}`
      : "vs"}
  </Text>

  {/* Away Team */}
  <View style={{ flexDirection: "row", alignItems: "center" }}>
    <Image
      source={{ uri: item.teams.away.logo }}
      style={{ width: 30, height: 30, marginRight: 10 }}
    />
    <Text
      style={{
        fontSize: 10,
        fontWeight: "600",
        color: "#333",
      }}
    >
      {item.teams.away.name}
    </Text>
    
  </View>
</View>
      <Text
                style={{
                  fontSize: 14,
                  color: "#555",
                  textAlign: "right",
                }}
              >
                {item.date}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}
    </View>
  );
}
