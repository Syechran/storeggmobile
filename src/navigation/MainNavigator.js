import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import HomeScreen from '../screens/HomeScreen';
import DetailScreen from '../screens/DetailScreen';
import LuckyEggScreen from '../screens/LuckyEggScreen';
import MyProductsScreen from '../screens/MyProductsScreen';

const Stack = createNativeStackNavigator();

export default function MainNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        
        <Stack.Screen 
          name="Home" 
          component={HomeScreen} 
          options={{ headerShown: false }} 
        />
        
        <Stack.Screen 
          name="Detail" 
          component={DetailScreen} 
          options={{ headerShown: false }} 
        />
        
        <Stack.Screen 
          name="LuckyEgg" 
          component={LuckyEggScreen} 
          options={{ headerShown: false }} 
        />

        <Stack.Screen 
          name="MyProducts" 
          component={MyProductsScreen} 
          options={{ headerShown: false }} 
        />

      </Stack.Navigator>
    </NavigationContainer>
  );
}