import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  FlatList,
  SafeAreaView
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Image } from 'expo-image'; // Or use 'react-native' Image if you prefer
import { Ionicons } from '@expo/vector-icons';
import colors from '../../constants/colors'; // Make sure you have your colors file

const { width, height } = Dimensions.get('window');

const slides = [
    {
      id: '1',
      title: 'Welcome to GroceryGo',
      description: 'Your one-stop shop for fresh and affordable groceries.',
      image: require('../../assets/images/onboard1.svg')
    },
    {
      id: '2',
      title: 'Freshness Guaranteed',
      description: 'We deliver farm-fresh fruits, vegetables, and more—straight to your door.',
      image: require('../../assets/images/onboard2.svg')
    },
    {
      id: '3',
      title: 'Fast & Easy Ordering',
      description: 'Order your essentials in just a few taps—anytime, anywhere.',
      image: require('../../assets/images/onboard3.svg')
    },
    {
      id: '4',
      title: 'Live Order Tracking',
      description: 'Track your delivery in real-time and get notified instantly.',
      image: require('../../assets/images/onboard4.svg')
    },
    {
      id: '5',
      title: 'Save Big with Offers',
      description: 'Enjoy daily deals, discounts, and cashback on your favorite items.',
      image: require('../../assets/images/onboard5.svg')
    }
  ];
  

export default function OnboardingScreen({ navigation }) {
  const [current, setCurrent] = useState(0);
  const ref = useRef();

  const onViewableItemsChanged = useRef(({ viewableItems }) => {
    if (viewableItems.length > 0) setCurrent(viewableItems[0].index);
  }).current;

  const viewConfigRef = useRef({ viewAreaCoveragePercentThreshold: 50 });

  const handleNext = () => {
    if (current < slides.length - 1) {
      ref.current.scrollToIndex({ index: current + 1 });
    }
  };

  const handleSkip = () => {
    ref.current.scrollToIndex({ index: slides.length - 1 });
  };

  const handleGetStarted = () => {
    navigation.replace('Login'); // Or your main screen route
  };

  return (
    <LinearGradient colors={[colors.white, colors.primaryLight]} style={styles.gradient}>
      <SafeAreaView style={styles.safe}>
        {/* Skip Button */}
        {current < slides.length - 1 && (
          <TouchableOpacity style={styles.skipBtn} onPress={handleSkip}>
            <Text style={styles.skipText}>Skip</Text>
          </TouchableOpacity>
        )}
        {/* Onboarding Slides */}
        <FlatList
          ref={ref}
          data={slides}
          keyExtractor={item => item.id}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }) => (
            <View style={styles.slide}>
              <Image
                source={item.image}
                style={styles.illustration}
                contentFit="contain"
              />
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.desc}>{item.description}</Text>
            </View>
          )}
          onViewableItemsChanged={onViewableItemsChanged}
          viewabilityConfig={viewConfigRef.current}
        />

        {/* Indicator Dots */}
        <View style={styles.dotsRow}>
          {slides.map((_, i) => (
            <View
              key={i}
              style={[
                styles.dot,
                current === i && styles.activeDot
              ]}
            />
          ))}
        </View>

        {/* Bottom Button */}
        <View style={styles.bottomRow}>
          {current < slides.length - 1 ? (
            <TouchableOpacity style={styles.nextBtn} onPress={handleNext}>
              <LinearGradient colors={colors.primaryGradient} style={styles.nextGradient}>
                <Text style={styles.nextText}>Next</Text>
                <Ionicons name="chevron-forward" size={22} color={colors.textOnPrimary} />
              </LinearGradient>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={styles.getStartedBtn} onPress={handleGetStarted}>
              <LinearGradient colors={colors.primaryGradient} style={styles.getStartedGradient}>
                <Text style={styles.getStartedText}>Get Started</Text>
              </LinearGradient>
            </TouchableOpacity>
          )}
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: { flex: 1 },
  safe: { flex: 1, paddingBottom:20 },
  skipBtn: {
    position: 'absolute',
    top: 36,
    right: 24,
    zIndex: 10,
    padding: 8,
  },
  skipText: {
    fontSize: 16,
    color: colors.primary,
    fontWeight: '700',
    opacity: 0.7,
  },
  slide: {
    width,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: height * 0.10,
    paddingBottom: height * 0.14,
    paddingHorizontal: 32,
  },
  illustration: {
    width: width * 0.75,
    height: height * 0.32,
    marginBottom: 34,
    borderRadius: 22,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.primaryDark,
    marginBottom: 14,
    textAlign: 'center',
    textShadowColor: colors.withOpacity(colors.shadow, 0.08),
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 8,
  },
  desc: {
    fontSize: 15,
    color: colors.darkGray,
    lineHeight: 23,
    textAlign: 'center',
    paddingHorizontal: 10,
  },
  dotsRow: {
    flexDirection: 'row',
    alignSelf: 'center',
    marginBottom: 24,
    marginTop: 10,
    gap: 8,
  },
  dot: {
    width: 9,
    height: 9,
    backgroundColor: colors.borderLight,
    borderRadius: 5,
    marginHorizontal: 3,
  },
  activeDot: {
    width: 24,
    backgroundColor: colors.primary,
  },
  bottomRow: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 28,
    marginTop: 6,
  },
  nextBtn: {
    width: width * 0.5,
    borderRadius: 14,
    overflow: 'hidden',
    elevation: 2,
  },
  nextGradient: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 14,
    borderRadius: 14,
  },
  nextText: {
    color: colors.textOnPrimary,
    fontSize: 18,
    fontWeight: '700',
    marginRight: 8,
  },
  getStartedBtn: {
    width: width * 0.7,
    borderRadius: 14,
    overflow: 'hidden',
    elevation: 2,
  },
  getStartedGradient: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 15,
    borderRadius: 14,
  },
  getStartedText: {
    color: colors.textOnPrimary,
    fontSize: 20,
    fontWeight: '700',
    letterSpacing: 1,
  },
});