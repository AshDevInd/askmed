import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
  FlatList,
  Dimensions,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialIcons';
import * as Location from 'expo-location';
import colors from '../../constants/colors';
import CustomHeader from '../../components/CustomHeader';
import { Image } from 'expo-image';
import { getDataList } from '../../app/useApi';
// Demo confirmed order for pinning
const confirmedOrder = {
  orderId: "ORD12345",
  status: "confirmed",
  eta: "12:15 PM",
};

const { data, error, isLoading } = usePostData('/your-endpoint', formData);

const shops = [
  {
    id: '1',
    name: 'Pappu Store',
    address: '181 Mahanagar Lucknow',
    distance: 1.2,
    rating: 4.7,
    image: require('../../assets/images/shop1.png'),
  },
  {
    id: '2',
    name: 'Fresh Mart',
    address: '12 Gomti Nagar Lucknow',
    distance: 2.5,
    rating: 4.5,
    image: require('../../assets/images/shop1.png'),
  },
  {
    id: '3',
    name: 'Daily Mart',
    address: '15 Indira Nagar Lucknow',
    distance: 4.8,
    rating: 4.8,
    image: require('../../assets/images/shop1.png'),
  },
  {
    id: '4',
    name: 'Quick Stop',
    address: '88 Nawabganj Lucknow',
    distance: 3.3,
    rating: 4.2,
    image: require('../../assets/images/shop1.png'),
  },
  {
    id: '5',
    name: 'Organic Hub',
    address: 'Engineering College Lucknow',
    distance: 2.0,
    rating: 4.9,
    image: require('../../assets/images/shop1.png'),
  },
  {
    id: '6',
    name: 'Organic Hub',
    address: '12 Tedipulia Lucknow',
    distance: 2.0,
    rating: 4.9,
    image: require('../../assets/images/shop1.png'),
  },
  {
    id: '7',
    name: 'Organic Hub',
    address: 'Nishat Ganj 5 Gali Lucknow',
    distance: 2.0,
    rating: 4.9,
    image: require('../../assets/images/shop1.png'),
  },
  {
    id: '8',
    name: 'Organic Hub',
    address: '10 IT Chauraha Lucknow',
    distance: 2.0,
    rating: 4.9,
    image: require('../../assets/images/shop1.png'),
  },
];

const { width } = Dimensions.get('window');
const CARD_MARGIN = 10;
const CARD_WIDTH = (width - CARD_MARGIN * 3) / 2; // two columns, with margins

export default function HomeScreen({ navigation }) {
  const [search, setSearch] = useState('');
  const [location, setLocation] = useState(null);
  const [locationLoading, setLocationLoading] = useState(false);
  const [locationError, setLocationError] = useState(null);
  const [address, setAddress] = useState(null);

  useEffect(() => {
    // Request location permission and get location
    const getLocation = async () => {
      setLocationLoading(true);
      setLocationError(null);
      try {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          setLocationError('Permission to access location was denied');
          setLocationLoading(false);
          return;
        }
        let loc = await Location.getCurrentPositionAsync({});
        setLocation(loc);
      } catch (error) {
        setLocationError('Could not fetch location');
      } finally {
        setLocationLoading(false);
      }
    };

    getLocation();
  }, []);
  // After fetching location:
  useEffect(() => {
    if (location) {
      (async () => {
        const geo = await Location.reverseGeocodeAsync({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        });
        if (geo && geo.length > 0) {
          // You can format as you like. Example:
          const addr = geo[0];
          setAddress(
            [addr.name, addr.street, addr.city, addr.region, addr.postalCode]
              .filter(Boolean)
              .join(', ')
          );
        }
      })();
    }
  }, [location]);

  // Filter shops by search and within 5km
  const filteredShops = shops.filter(
    shop =>
      shop.name.toLowerCase().includes(search.toLowerCase()) &&
      shop.distance <= 5
  );

  const renderShop = ({ item }) => (
    <TouchableOpacity
      style={styles.shopCard}
      activeOpacity={0.85}
      onPress={() => navigation.navigate('ShopDetails', { shopId: item.id })}
    >
      <View style={styles.shopImageWrapper}>
        <Image
          source={item.image}
          style={styles.image}
        />
      </View>
      {/* Badge on top-right */}
      <View style={styles.imageBadge}>
        <Text style={styles.badgeText}>Open</Text>
      </View>
      <View style={styles.shopInfo}>
        <Text style={styles.shopName} numberOfLines={1}>{item.name}</Text>
        <Text style={styles.shopAddress} numberOfLines={2}>{item.address}</Text>
        <View style={styles.shopMetaRow}>
          <View style={styles.metaItem}>
            <Icon name="place" size={15} color={colors.primary} />
            <Text style={styles.metaText}>{item.distance} km</Text>
          </View>
          <View style={styles.metaItem}>
            <Icon name="star" size={15} color="#FFD700" />
            <Text style={styles.metaText}>{item.rating}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );


   // --- PINNED ORDER CARD ---
  const renderPinnedOrder = () => (
    <TouchableOpacity
      style={styles.pinnedOrderCard}
      onPress={() => navigation.navigate('OrderTrackScreen', { order: confirmedOrder })}
      activeOpacity={0.93}
    >
      <Image
        source={{ uri: "https://assets-v2.lottiefiles.com/a/7b4d25ca-1187-11ee-976f-1f8e4524fefe/nSKZ9mhUfT.gif" }}
        style={styles.pinnedGif}
       
      />
      <View style={{ flex: 1 }}>
        <Text style={styles.pinnedOrderTitle}>
          Tracking Order #{confirmedOrder.orderId}
        </Text>
        <Text style={styles.pinnedOrderStatus}>
          {confirmedOrder.status === "confirmed" ? "Confirmed" : "Pending"}
          {confirmedOrder.eta ? ` • ETA ${confirmedOrder.eta}` : ""}
        </Text>
      </View>
      <Icon name="chevron-right" size={28} color={colors.primary} />
    </TouchableOpacity>
  );

  return (
    <LinearGradient colors={[colors.white, colors.primaryLight]} style={{ flex: 1 }}>
      <SafeAreaView style={styles.safeArea}>
        <CustomHeader navigation={navigation} title="Store" isHome={true} />

        <View style={styles.headerRow}>
          <Text style={styles.title}>Find Shops Near You</Text>
          <TouchableOpacity
            style={styles.profileBtn}
            onPress={() => navigation.navigate('ProfileScreen')}
          >
            <Icon name="account-circle" size={38} color={colors.primary} />
          </TouchableOpacity>
        </View>

        {/* Location info */}
        <View style={styles.locationRow}>
          <Icon name="my-location" size={18} color={colors.primary} />
          {location ? (
            <Text style={styles.locationText}>
              {address
                ? `${address}`
                : `${location.coords.latitude.toFixed(4)}, ${location.coords.longitude.toFixed(4)}`}
            </Text>
          ) : (
            <Text style={styles.locationText}>Location not available</Text>
          )}
         
        </View>

        {/* Search Bar */}
        <View style={styles.searchBarWrapper}>
          <Icon name="search" size={22} color={colors.mediumGray} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search shop name"
            placeholderTextColor={colors.mediumGray}
            value={search}
            onChangeText={setSearch}
            returnKeyType="search"
          />
          {search.length > 0 && (
            <TouchableOpacity onPress={() => setSearch('')}>
              <Icon name="close" size={22} color={colors.mediumGray} />
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionHeader}>Shops within 5km</Text>
        </View>

        <FlatList
          data={filteredShops}
          renderItem={renderShop}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.shopsList}
          showsVerticalScrollIndicator={false}
          numColumns={2}
          ListEmptyComponent={
            <Text style={styles.noResultText}>No shops found near you.</Text>
          }
        />
         {confirmedOrder && renderPinnedOrder()}
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: 'transparent' },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
    marginHorizontal: 18,
  
  },
  title: {
    fontSize: 24,
    color: colors.primaryDark,
    fontWeight: '800',
    letterSpacing: 0.2,
  },
  profileBtn: {
    borderRadius: 24,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 18,
    marginBottom: 8,
    gap: 5,
  },
  locationText: {
    fontSize: 14,
    color: colors.primaryDark,
    marginLeft: 6,
    flex: 1,
  },
  locationRefresh: {
    marginLeft: 8,
    padding: 4,
  },
  searchBarWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 10,
    marginHorizontal: 16,
    paddingHorizontal: 13,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: colors.borderLight,
    minHeight: 46,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 1,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: colors.textPrimary,
    marginLeft: 7,
    marginRight: 7,
    paddingVertical: 9,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: 18,
    marginTop: 8,
    marginBottom: 1,
  },
  sectionHeader: {
    fontSize: 18,
    color: colors.primaryDark,
    fontWeight: '700',
  },
  seeAll: {
    fontSize: 15,
    color: colors.primary,
    fontWeight: '600',
    opacity: 0.85,
  },
  shopsList: {
    paddingHorizontal: CARD_MARGIN,
    paddingTop: 6,
    paddingBottom: 20,
    minHeight: 200,
  },
  shopCard: {
    width: CARD_WIDTH,
    backgroundColor: colors.withOpacity(colors.white, 0.96),
    borderRadius: 13,
    marginBottom: CARD_MARGIN,
    marginRight: CARD_MARGIN,
    padding: 12,
    elevation: 3,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.11,
    shadowRadius: 9,
    borderWidth: 1,
    borderColor: colors.withOpacity(colors.primary, 0.09),
  },
  shopImageWrapper: {
    width: 'auto',
    height: 'auto',
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },
  shopImageBg: {
    width: 46,
    height: 46,
    borderRadius: 13,
    justifyContent: 'center',
    alignItems: 'center',
  },
  shopInfo: { flex: 1, alignItems: 'center' },
  shopName: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.primaryDark,
    marginBottom: 1,
  },
  shopAddress: {
    fontSize: 12,
    color: '#000000',
    marginBottom: 4,
    textAlign: 'center'
  },
  shopMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 2,
  },
  image: {
    width: 80,
    height: 80,
    marginBottom: 10,
    resizeMode: 'contain'
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 6,
  },
  metaText: {
    marginLeft: 2,
    fontSize: 12,
    color: colors.mediumGray,
    fontWeight: '600',
  },
  noResultText: {
    textAlign: 'center',
    color: colors.secondaryDark,
    fontSize: 15,
    marginTop: 24,
    fontWeight: '500',
    opacity: 0.7,
    width: '100%',
  },
  imageBadge: {
    position: 'absolute',
    top: -4,
    left: -4,
    backgroundColor: '#008000', // or any theme color
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
    zIndex: 10,
    elevation: 2,
  },

  badgeText: {
    color: 'white',
    fontSize: 10,
    fontWeight: '700',
  },
  // PINNED ORDER CARD
  pinnedOrderCard: {
    backgroundColor: "#fff",
    marginHorizontal: 16,
    marginBottom: 5,
    borderRadius: 14,
    elevation: 2,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderWidth: 1.2,
    borderColor: colors.withOpacity(colors.primary, 0.12),
    shadowColor: colors.primary,
    shadowOpacity: 0.06,
    shadowRadius: 7,
  },
  pinnedGif: {
    width: 40,
    height: 40,
   
    marginRight: 14,
    backgroundColor: "#f8f8f8",
  },
  pinnedOrderTitle: {
    fontWeight: "bold",
    color: colors.primaryDark,
    fontSize: 15,
  },
  pinnedOrderStatus: {
    color: "#38a169",
    fontWeight: "700",
    marginTop: 2,
    fontSize: 13.5,
  },
});