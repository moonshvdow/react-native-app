import React from "react";
import {} from 'react-native'
import { createNativeStackNavigator} from '@react-navigation/native-stack'

import PostsScreen from "../nested/PostsScreen";
import MapScreen from "../nested/MapScreen";
import CommentsScreen from "../nested/CommentsScreen";


const NestedStack = createNativeStackNavigator();

const HomeScreen = () => {
return(
    <NestedStack.Navigator>
        <NestedStack.Screen name="Posts" component={PostsScreen}/>
        <NestedStack.Screen name="Map" component={MapScreen}/>
        <NestedStack.Screen name="Comments" component={CommentsScreen}/>
    </NestedStack.Navigator>
)
};

export default HomeScreen;