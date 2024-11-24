import BatAndBallAnimation from '@/Components/animation';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import * as Animatable from 'react-native-animatable';

export default function HomeIndex() {
  const router = useRouter();
  const [footballData, setFootballData] = useState<any>([]);
  const [baseballData, setBaseballData] = useState<any>([]);
  const [loadingFootball, setLoadingFootball] = useState(true);
  const [loadingBaseball, setLoadingBaseball] = useState(true);
  const [footballError, setFootballError] = useState(false); // Add state for error handling
  const [baseballError, setBaseballError] = useState(false); // Add state for error handling

  const fetchFootballData = async () => {
    setLoadingFootball(true);
    setFootballError(false); // Reset error on each fetch
    try {
      const storedFootballData = await AsyncStorage.getItem('footballData');
      if (storedFootballData) {
        setFootballData(JSON.parse(storedFootballData));
      } else {
        const response = await fetch(
          'https://v3.football.api-sports.io/fixtures?live=all',
          {
            method: 'GET',
            headers: {
              'x-rapidapi-host': 'v3.football.api-sports.io',
              'x-rapidapi-key': 'e8bec00c15ee0502a20e0db84a81ac93',
            },
          }
        );
        const data = await response.json();
        setFootballData(data.response);
        await AsyncStorage.setItem('footballData', JSON.stringify(data.response));
      }
    } catch (error) {
      console.error('Error fetching football data:', error);
      setFootballError(true); // Set error state if fetch fails
    } finally {
      setLoadingFootball(false);
    }
  };
  
  const fetchBaseballData = async () => {
    
    const today = new Date();
    const formattedDate = today.toISOString().split("T")[0];
    console.log(formattedDate);
    setLoadingBaseball(true);
    setBaseballError(false); // Reset error on each fetch
    try {
      const storedBaseballData = await AsyncStorage.getItem('baseballData');
      if (storedBaseballData) {
        setBaseballData(JSON.parse(storedBaseballData));
        console.log("Loaded data from local storage.");
      } else {
        console.log("No data in local storage. Fetching from API...");
        const response = await fetch(
          `https://v1.baseball.api-sports.io/games?date=${formattedDate}`,
          {
            method: "GET",
            headers: {
              "x-rapidapi-host": "v1.baseball.api-sports.io",
              "x-rapidapi-key": "e8bec00c15ee0502a20e0db84a81ac93",
            },
          }
        );
        const data = await response.json();
        if (data.response && data.response.length > 0) {
          setBaseballData(data.response);
          await AsyncStorage.setItem('baseballData', JSON.stringify(data.response));
        } else {
          console.error("No matches found in baseball data.");
        }
      }
    } catch (error) {
      console.error('Error fetching baseball data:', error);
      setBaseballError(true); // Set error state if fetch fails
    } finally {
      setLoadingBaseball(false);
    }
  };
  
  
  useEffect(() => {
    fetchFootballData();
    fetchBaseballData();
  }, []);

  const handleNavigate = (sport: string) => {
    router.push(`/(${sport})`);
  };
  const [refreshKey, setRefreshKey] = useState(0);  // This state will be toggled every 5 seconds

  useEffect(() => {
    // Set interval to refresh every 5 seconds
    const intervalId = setInterval(() => {
      setRefreshKey(prevKey => prevKey + 1);  // Change the key to force a re-render
    }, 5000);  // 5000 milliseconds = 5 seconds

    // Clear interval when component unmounts
    return () => clearInterval(intervalId);
  }, []);


  return (
    <View style={{ flex: 1, backgroundColor: '#f5f5f5', padding: 20, marginTop: 50 }}>
      {/* Header Section */}
      {/* <Animatable.View animation="fadeIn" duration={1500} style={{ marginBottom: 20 }}> */}
      {/* <Animatable.View key={refreshKey} animation="fadeIn" duration={1500} style={{ marginBottom: 20 }}> */}
        <View style={{flex:1, height: 100, width: '100%', justifyContent: 'center', alignItems: 'center', paddingTop: 20}}>
        <BatAndBallAnimation key={refreshKey} />
        </View>

      {/* </Animatable.View> */}
      {/* </Animatable.View> */}
      
      {/* Football Section */}
      <View style={{ marginBottom: 0 }}>
        <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Football</Text>
        {footballError && !loadingFootball ? (
          <View style={{ alignItems: 'center', marginBottom: 0 }}>
            <Text style={{ color: 'red' }}>Football data is unavailable.</Text>
            <TouchableOpacity onPress={fetchFootballData} style={{ marginTop: 5 }}>
              <Text style={{ color: '#1E90FF' }}>Tap to refresh</Text>
            </TouchableOpacity>
          </View>
        ) : null}
        {loadingFootball ? (
          <ActivityIndicator size="large" color="#1E90FF" />
        ) : (
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {footballData.length > 0 ? (
              footballData.slice(0, 3).map((match: any) => (
                <Animatable.View
                  key={match.fixture.id}
                  animation="slideInUp"
                  duration={1000}
                  style={{
                    marginRight: 15,
                    backgroundColor: '#fff',
                    borderRadius: 10,
                    padding: 10,
                    width: 180,
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.1,
                    shadowRadius: 4,
                    elevation: 3,
                    marginTop: 5,
                  }}
                >
                  <Text style={{ fontSize: 14, fontWeight: 'bold', color: '#555' }}>
                    {match.teams.home.name} vs {match.teams.away.name}
                  </Text>
                  <Image source={{ uri: match.league.logo }} style={{ width: 30, height: 30 }} />
                  <Text style={{ fontSize: 12, color: '#888' }}>{match.league.name}</Text>
                  <Text style={{ fontSize: 16, fontWeight: 'bold', marginTop: 5 }}>
                    {match.goals.home} - {match.goals.away}
                  </Text>
                  <TouchableOpacity
                    onPress={() => handleNavigate('football')}
                    style={{
                      marginTop: 10,
                      backgroundColor: '#1E90FF',
                      paddingVertical: 5,
                      borderRadius: 5,
                    }}
                  >
                    <Text style={{ color: '#fff', textAlign: 'center' }}>View More</Text>
                  </TouchableOpacity>
                </Animatable.View>
              ))
            ) : (
              <Text>No football data available.</Text>
            )}
          </ScrollView>
        )}
      </View>

      {/* Baseball Section */}
      <View style={{ marginBottom: 20 }}>
        <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Baseball</Text>
        {baseballError && !loadingBaseball ? (
          <View style={{ alignItems: 'center', marginBottom: 10 }}>
            <Text style={{ color: 'red' }}>Baseball data is unavailable.</Text>
            <TouchableOpacity onPress={fetchBaseballData} style={{ marginTop: 5 }}>
              <Text style={{ color: '#ff6347' }}>Tap to refresh</Text>
            </TouchableOpacity>
          </View>
        ) : null}
        {loadingBaseball ? (
          <ActivityIndicator size="large" color="#ff6347" />
        ) : (
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {baseballData.length > 0 ? (
              baseballData.slice(0, 3).map((match, index) => (
                <Animatable.View
                  key={index}
                  animation="slideInUp"
                  duration={1000}
                  style={{
                    marginRight: 15,
                    backgroundColor: '#fff',
                    borderRadius: 10,
                    padding: 10,
                    width: 180,
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.1,
                    shadowRadius: 4,
                    elevation: 3,
                    marginTop: 5,
                  }}
                >
                  <Text style={{ fontSize: 14, fontWeight: 'bold', color: '#555' }}>
                    {match?.teams?.home?.name || 'N/A'} vs {match?.teams?.away?.name || 'N/A'}
                  </Text>
                  {match?.league?.logo && (
                    <Image
                      source={{ uri: match.league.logo }}
                      style={{ width: 30, height: 30 }}
                    />
                  )}
                  <Text style={{ fontSize: 12, color: '#888' }}>Baseball League</Text>
                  <Text style={{ fontSize: 16, fontWeight: 'bold', marginTop: 5 }}>
                    {match?.scores?.home?.total || 0} - {match?.scores?.away?.total || 0}
                  </Text>
                  <TouchableOpacity
                    onPress={() => handleNavigate('baseball')}
                    style={{
                      marginTop: 10,
                      backgroundColor: '#ff6347',
                      paddingVertical: 5,
                      borderRadius: 5,
                    }}
                  >
                    <Text style={{ color: '#fff', textAlign: 'center' }}>View More</Text>
                  </TouchableOpacity>
                </Animatable.View>
              ))
            ) : (
              <Text>No baseball data available.</Text>
            )}
          </ScrollView>
        )}
      </View>
    </View>
  );
}
