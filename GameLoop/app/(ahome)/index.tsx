import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import * as Animatable from 'react-native-animatable'; 
import BatAndBallAnimation from '@/Components/animation';

export default function HomeIndex() {
  const router = useRouter();
  const [footballData, setFootballData] = useState<any>([]);
  const [baseballData, setBaseballData] = useState<any>([]);
  const [loadingFootball, setLoadingFootball] = useState(true);
  const [loadingBaseball, setLoadingBaseball] = useState(true);

  const fetchFootballData = async () => {
    setLoadingFootball(true);
    try {
      // Check if football data is already available in AsyncStorage
      const storedFootballData = await AsyncStorage.getItem('footballData');
      if (storedFootballData) {
        console.log('Using stored football data');
        // If data exists, use it
        setFootballData(JSON.parse(storedFootballData));
      } else {
        // If no data in AsyncStorage, fetch new data
        console.log('Fetching new football data');
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
        // Store fetched data in AsyncStorage
        await AsyncStorage.setItem('footballData', JSON.stringify(data.response));
      }
    } catch (error) {
      console.error('Error fetching football data:', error);
    } finally {
      setLoadingFootball(false);
    }
  };
  
  const fetchBaseballData = async () => {
    setLoadingBaseball(true);
    const today = new Date();
    const formattedDate = today.toISOString().split("T")[0]; // Extract YYYY-MM-DD
    console.log(formattedDate);
    try {
      // Check if baseball data is already available in AsyncStorage
      const storedBaseballData = await AsyncStorage.getItem('baseballData');
      if (storedBaseballData) {
        console.log('Using stored baseball data');
        // If data exists, use it
        setBaseballData(JSON.parse(storedBaseballData));
      } else {
        // If no data in AsyncStorage, fetch new data
        console.log('Fetching new baseball data');
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
        const data = await response.json();
        setBaseballData(data.matches);
        // Store fetched data in AsyncStorage
        await AsyncStorage.setItem('baseballData', JSON.stringify(data.matches));
      }
    } catch (error) {
      console.error('Error fetching baseball data:', error);
    } finally {
      setLoadingBaseball(false);
    }
  };
  
  useEffect(() => {
    fetchFootballData();
    fetchBaseballData();
    console.log("Baseball data:", baseballData);
    console.log("Football data:", footballData);
  }, []);

  const handleNavigate = (sport: string) => {
    router.push(`/(${sport})`);
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#f5f5f5', padding: 20 }}>
      {/* Header Section */}
      <Animatable.View animation="fadeIn" duration={1500} style={{ marginBottom: 20 }}>
        {/* <Text style={{ fontSize: 24, fontWeight: 'bold', textAlign: 'center' }}>GameLoop</Text>
        <Text style={{ textAlign: 'center', fontSize: 16, color: '#666' }}>Live Updates on Football & Baseball</Text> */}
        <BatAndBallAnimation/>
      </Animatable.View>

      {/* Football Section */}
      <View style={{ marginBottom: 20 }}>
        <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Football</Text>
        {loadingFootball ? (
          <ActivityIndicator size="large" color="#1E90FF" />
        ) : (
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {footballData.slice(0, 3).map((match: any, index: number) => (
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
                  marginTop:5,
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
            ))}
          </ScrollView>
        )}
      </View>

      {/* Baseball Section */}
      <View style={{ marginBottom: 20 }}>
        <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Baseball</Text>
        {loadingBaseball ? (
          <ActivityIndicator size="large" color="#ff6347" />
        ) : (
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            
            {baseballData.slice(0, 3).map((match: any, index: number) => (
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
                  marginTop:5,
                }}
              >
                <Text style={{ fontSize: 14, fontWeight: 'bold', color: '#555' }}>
                  {match.teams.home.name}     vs    {match.teams.away.name}
                </Text>
                <Image
                  source={{ uri: match.league.logo }} // Replace with actual logo if needed
                  style={{ width: 30, height: 30 }}
                />
                <Text style={{ fontSize: 12, color: '#888' }}>Baseball League</Text>
                <Text style={{ fontSize: 16, fontWeight: 'bold', marginTop: 5 }}>
                  {match.scores.home.total} - {match.scores.away.total}
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
            ))}
          </ScrollView>
        )}
      </View>

      {/* Footer */}
      <View style={{ alignItems: 'center', marginTop: 20 }}>
        <Text style={{ color: '#888' }}>© 2024 GameLoop. All rights reserved.</Text>
      </View>
    </View>
  );
}
