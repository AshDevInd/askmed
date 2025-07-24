import React, { useEffect, useState } from 'react';

import { NavigationContainer } from '@react-navigation/native';

import SplashScreen from './screens/common/SplashScreen';

import DrawerNavigator from './navigation/DrawerNavigator';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from './screens/auth/LoginScreen';
import RegisterScreen from './screens/auth/RegisterScreen';
import ProfileScreen from './screens/profile/ProfileScreen';

import OrderDetailsScreen from './screens/orders/OrderDetailsScreen';

import WalletScreen from './screens/home/WalletScreen';
import OnboardingScreen from './screens/common/OnboardingScreen';
import ShopDetails from './screens/common/ShopDetails';
import OrderHistoryScreen from './screens/orders/OrderHistoryScreen';
import OrderTrackScreen from './screens/orders/OrderTrackScreen';
import OrderDetails from './screens/orders/OrderDetails';

const Stack = createStackNavigator();
function LoginStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name='OnboardingScreen' component={OnboardingScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />


      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen name="MainApp" component={DrawerNavigator} />
      <Stack.Screen name='ProfileScreen' component={ProfileScreen} />

      <Stack.Screen name='OrderDetailsScreen' component={OrderDetailsScreen} />


      <Stack.Screen name='WalletScreen' component={WalletScreen} />
      <Stack.Screen name='ShopDetails' component={ShopDetails} />
      <Stack.Screen name='OrderHistoryScreen' component={OrderHistoryScreen} />
      <Stack.Screen name='OrderTrackScreen' component={OrderTrackScreen} />
      <Stack.Screen name='OrderDetails' component={OrderDetails} />

      {/* <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} /> */}
    </Stack.Navigator>
  );
}
function MyStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false, // You can control this from DrawerNavigator
      }}
    >
      <Stack.Screen name="MainApp" component={DrawerNavigator} />
      <Stack.Screen name='ProfileScreen' component={ProfileScreen} />
    </Stack.Navigator>
  );
}
export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Simulate splash + auth check
  useEffect(() => {
    const timeout = setTimeout(() => {
      setIsLoading(false);
    }, 4000);
    return () => clearTimeout(timeout);
  }, []);

  if (isLoading) return <SplashScreen />;

  return (
    <NavigationContainer>
      {/* {isLoggedIn ? (
        <DrawerNavigator />
      ) : (
        <AuthStack />
      )} */}
      <LoginStack />
    </NavigationContainer>
  );
}
