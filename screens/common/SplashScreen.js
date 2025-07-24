import React from 'react';
import { View, Text, ActivityIndicator, StyleSheet ,Image} from 'react-native';
import colors from '../../constants/colors';

const LOCAL_GIF = require('../../assets/images/splashlogo.webp'); // or splashlogo.gif

export default function SplashScreen() {
  return (
    <View style={styles.container}>
       <Image
          source={LOCAL_GIF}
          style={styles.gif}
          resizeMode="contain"
        />
     
      <Text style={styles.title}>Grocery Chat Order</Text>
      <Text style={styles.subtitle}>Order groceries online with live chat support!</Text>
      <ActivityIndicator size="large" color={colors.primary} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.white,
  },
  logo: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 20,
  },logoBox: {
    width: 200,
    height: 200,
    marginBottom: 20,
  },
  gif: {
    width: 260,
    height: 450,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.primary,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
    paddingHorizontal: 10,
  },
});

