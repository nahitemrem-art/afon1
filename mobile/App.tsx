import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';

import FundsScreen from './src/screens/FundsScreen';
import FavoritesScreen from './src/screens/FavoritesScreen';
import PortfolioScreen from './src/screens/PortfolioScreen';
import LiveScreen from './src/screens/LiveScreen';

const Tab = createBottomTabNavigator();
const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <NavigationContainer>
        <StatusBar style="auto" />
        <Tab.Navigator
          screenOptions={({ route }) => ({
            tabBarIcon: ({ focused, color, size }) => {
              let iconName: any;

              if (route.name === 'Fonlar') {
                iconName = focused ? 'list' : 'list-outline';
              } else if (route.name === 'Favoriler') {
                iconName = focused ? 'star' : 'star-outline';
              } else if (route.name === 'Portföy') {
                iconName = focused ? 'wallet' : 'wallet-outline';
              } else if (route.name === 'Canlı') {
                iconName = focused ? 'pulse' : 'pulse-outline';
              }

              return <Ionicons name={iconName} size={size} color={color} />;
            },
            tabBarActiveTintColor: '#2563eb',
            tabBarInactiveTintColor: 'gray',
            headerStyle: {
              backgroundColor: '#2563eb',
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          })}
        >
          <Tab.Screen name="Fonlar" component={FundsScreen} />
          <Tab.Screen name="Canlı" component={LiveScreen} />
          <Tab.Screen name="Favoriler" component={FavoritesScreen} />
          <Tab.Screen name="Portföy" component={PortfolioScreen} />
        </Tab.Navigator>
      </NavigationContainer>
    </QueryClientProvider>
  );
}
