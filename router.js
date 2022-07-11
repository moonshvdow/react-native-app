import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

const AuthStack = createNativeStackNavigator();
const MainTab = createBottomTabNavigator();

import { AntDesign } from '@expo/vector-icons'; 
// <AntDesign name="plus" size={24} color="black" />
import { Feather } from '@expo/vector-icons'; 
// <Feather name="grid" size={24} color="black" />
// <Feather name="user" size={24} color="black" />



import LoginScreen from './screens/auth/LoginScreen';
import RegistrationScreen from './screens/auth/RegistrationScreen';
import CreatePostsScreen from './screens/main/CreatePostsScreen';
import ProfileScreen from './screens/main/ProfileScreen';
import HomeScreen from './screens/main/HomeScreen';


export const useRoute = (isAuth) => {
    if (!isAuth) {
      return (
        <AuthStack.Navigator>
        <AuthStack.Screen options={{headerShown: false}} name="Login" component={LoginScreen} />
        <AuthStack.Screen options={{headerShown: false}} name="Registration" component={RegistrationScreen} />
        </AuthStack.Navigator>
      );
    }
    return (
        <MainTab.Navigator>
        <MainTab.Screen options={{headerShown: false, tabBarShowLabel: false, tabBarIcon: ({ focused, size, color }) => <Feather name="grid" size={size} color={color} />}} name="Home" component={HomeScreen} />
        <MainTab.Screen options={{headerShown: false, tabBarShowLabel: false, tabBarIcon: ({ focused, size, color }) => <AntDesign name="plus" size={size} color={color} />}} name="CreatePosts" component={CreatePostsScreen} />
        <MainTab.Screen options={{headerShown: false, tabBarShowLabel: false, tabBarIcon: ({ focused, size, color }) => <Feather name="user" size={size} color={color} />}} name="Profile" component={ProfileScreen} />
      </MainTab.Navigator>
    );
  };