import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { RootStackParamList, MainTabParamList } from '../types';
import {
  FundsScreen,
  CompareScreen,
  PortfoliosScreen,
  FavoritesScreen,
} from '../screens';

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();

const MainTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: '#2196f3',
        tabBarInactiveTintColor: '#666',
      }}
    >
      <Tab.Screen
        name="Funds"
        component={FundsScreen}
        options={{ title: 'All Funds' }}
      />
      <Tab.Screen
        name="Compare"
        component={CompareScreen}
        options={{ title: 'Compare' }}
      />
      <Tab.Screen
        name="Portfolios"
        component={PortfoliosScreen}
        options={{ title: 'My Portfolios' }}
      />
      <Tab.Screen
        name="Favorites"
        component={FavoritesScreen}
        options={{ title: 'Favorites' }}
      />
    </Tab.Navigator>
  );
};

export const MainNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="MainTabs"
          component={MainTabs}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
