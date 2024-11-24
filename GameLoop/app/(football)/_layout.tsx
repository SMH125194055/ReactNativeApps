import CustomHeader from '@/Components/customHeader';
import { Stack } from "expo-router";
export default function FootballLayout() {
  return <Stack 
  screenOptions={{
    headerShown: true, // Hide the header
      headerBackVisible: true, // Hide the back button title
      headerTitle: "GameLoop", // Set the header title
      headerTitleAlign: "center", // Center the header title
      headerTitleStyle:{
        backgroundColor:'white',
        shadowColor:'transparent',
        paddingHorizontal:20,
        // marginHorizontal:100,
        fontWeight :'bold',
        fontSize:20,
        headerTitleAlign: "center", // Center the header title
        elevation:0,
      },
      header: ({ navigation }) => (
        <CustomHeader title="GameLoop" navigation={navigation} />
      ),    
  }}
>
  <Stack.Screen name="index" />
  <Stack.Screen name="details" />
  </Stack>;
}
