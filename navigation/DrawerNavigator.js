import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';

import { Ionicons } from '@expo/vector-icons';

import ProfileScreen from '../screens/profile/ProfileScreen';
import HomeScreen from '../screens/home/HomeScreen';
import BottomTabNavigator from './BottomTabNavigator';
import colors from '../constants/colors';

import DrawerContent from '../components/DrawerContent'; // Adjust path as needed

const Drawer = createDrawerNavigator();

export default function DrawerNavigator() {
  return (
    <Drawer.Navigator
      drawerContent={props => <DrawerContent {...props} />}
      screenOptions={{
        headerShown: false,
        drawerActiveTintColor: colors.primary,
        drawerInactiveTintColor: '#000',
        drawerLabelStyle: {
          fontSize: 16,
          fontWeight: '600',
        },
      }}
    >
      <Drawer.Screen name="HomeTab" component={BottomTabNavigator} />
      {/* <Drawer.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          drawerIcon: ({ color }) => <Ionicons name="person" size={24} color={color} />,
        }}
      /> */}
    </Drawer.Navigator>
  );
}
