import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/home/HomeScreen';
import OrderListScreen from '../screens/orders/OrderListScreen';

import { Ionicons } from '@expo/vector-icons';
import colors from '../constants/colors';
import OrderHistoryScreen from '../screens/orders/OrderHistoryScreen';

const Tab = createBottomTabNavigator();

export default function BottomTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: '#000',
        headerShown: false,
        tabBarStyle: { backgroundColor: '#fff' },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{ tabBarIcon: ({ color }) => <Ionicons name="home" size={24} color={color} /> }}
      />
      <Tab.Screen
        name="Orders"
        component={OrderListScreen}
        options={{ tabBarIcon: ({ color }) => <Ionicons name="list" size={24} color={color} /> }}
      />
      <Tab.Screen
        name="Order History"
        component={OrderHistoryScreen}
        options={{ tabBarIcon: ({ color }) => <Ionicons name="car" size={24} color={color} /> }}
      />
    </Tab.Navigator>
  );
}
