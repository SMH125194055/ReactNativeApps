import AsyncStorage from "@react-native-async-storage/async-storage";

export let footballData = null;
export let baseballData = null;

// Function to fetch new football data
export const fetchNewFootballData = async () => {
  console.log("Fetching fresh football data");
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
  const data = await response.json();
  footballData = data.response;
  await AsyncStorage.setItem("footballData", JSON.stringify(footballData));
  return footballData;
};

// Function to fetch new baseball data
export const fetchNewBaseballData = async () => {
  console.log("Fetching fresh baseball data");
  const today = new Date().toISOString().split("T")[0];
  const response = await fetch(
    `https://v1.baseball.api-sports.io/games?date=${today}`,
    {
      method: "GET",
      headers: {
        "x-rapidapi-host": "v1.baseball.api-sports.io",
        "x-rapidapi-key": "e8bec00c15ee0502a20e0db84a81ac93",
      },
    }
  );
  const data = await response.json();
  baseballData = data.matches;
  await AsyncStorage.setItem("baseballData", JSON.stringify(baseballData));
  return baseballData;
};

// Getters to retrieve existing or stored data
export const getFootballData = async () => {
  if (!footballData) {
    const storedData = await AsyncStorage.getItem("footballData");
    footballData = storedData ? JSON.parse(storedData) : null;
  }
  return footballData;
};

export const getBaseballData = async () => {
  if (!baseballData) {
    const storedData = await AsyncStorage.getItem("baseballData");
    baseballData = storedData ? JSON.parse(storedData) : null;
  }
  return baseballData;
};
