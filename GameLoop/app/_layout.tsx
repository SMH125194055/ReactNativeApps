
import AntDesign from '@expo/vector-icons/AntDesign';
import Entypo from '@expo/vector-icons/Entypo';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Tabs, } from "expo-router";


export default function RootLayout() {
  return (
    <Tabs 
    screenOptions={{
      headerTitle:'GameLoop',
      headerStyle:{
        backgroundColor:'white',
        shadowColor:'transparent',
        alignContent:'center',
        justifyContent:'center',
        elevation:0,
      },
      tabBarStyle:{
        backgroundColor:'white',
        shadowColor:'transparent',
        alignContent:'center',
        justifyContent:'center',
        elevation:0,
      },
      headerTitleStyle:{
        backgroundColor:'white',
        shadowColor:'transparent',
        paddingHorizontal:20,
        marginHorizontal:100,
        fontWeight :'bold',
        fontSize:20,
        alignContent:'center',
        justifyContent:'center',
        elevation:0,
      },
      headerShown: false, // Hide the header
      // headerBackVisible: true, // Hide the back button title
    }}
    initialRouteName="(ahome)"
    >
      
      
      <Tabs.Screen name="(baseball)" options={{ 
        title: "BaseBall",
        tabBarIcon: ({ color }) => <FontAwesome6 name="baseball-bat-ball" size={24} color="black" />
         }} />
      <Tabs.Screen name="(ahome)" options={{
         title: "Home" ,
         tabBarIcon: ({ color }) => <AntDesign name="home" size={24} color="black" />


      }} />
      <Tabs.Screen name="(football)" options={{ 
        title: "Football" ,
        tabBarIcon: ({ color }) => <Ionicons name="football" size={24} color="black" />
        
        }} />
    </Tabs>
  );
}
