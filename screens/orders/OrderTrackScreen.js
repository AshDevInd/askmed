import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  ActivityIndicator,
  Text,
  TouchableOpacity,
  Dimensions,
  ScrollView,
  Linking,
  Image
} from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import * as Location from 'expo-location';
import axios from 'axios';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Ionicons } from '@expo/vector-icons';
import colors from '../../constants/colors';

const SHOP_LOCATION = { latitude: 26.8947, longitude: 80.9970 }; // Example: Lucknow

const orderInfo = {
  orderId: 'ORD12345',
  status: 'On The Way',
  eta: '10 mins',
  deliveryType: 'Express Delivery',
  deliveryBoy: {
    name: 'Ravi Kumar',
    phone: '+91 9876543210',
    vehicle: 'Bike',
    vehicleNo: 'UP32 AB 1234',
  },
  shop: {
    name: 'Pappu Store',
    address: '181 Mahanagar Lucknow',
    phone: '0522-123456',
  },
  user: {
    name: 'Amit Sharma',
    address: 'A-23, Gomti Nagar, Lucknow',
    phone: '+91 9999988888',
  },
  items: [
    { name: 'Amul Milk 1L', qty: 2 },
    { name: 'Harvest Bread', qty: 1 },
    { name: 'Eggs (6 pack)', qty: 1 },
  ],
  totalAmount: 192,
  payment: 'Cash on Delivery',
};

export default function OrderTrackScreen({ navigation }) {
  const [userLoc, setUserLoc] = useState(null);
  const [routeCoords, setRouteCoords] = useState([]);
  const [loading, setLoading] = useState(true);


  const lightMapStyle = [
    {
      elementType: "geometry",
      stylers: [{ color: "#f5f5f5" }],
    },
    {
      elementType: "labels.icon",
      stylers: [{ visibility: "off" }],
    },
    {
      elementType: "labels.text.fill",
      stylers: [{ color: "#616161" }],
    },
    {
      elementType: "labels.text.stroke",
      stylers: [{ color: "#f5f5f5" }],
    },
    {
      featureType: "administrative",
      elementType: "geometry",
      stylers: [{ color: "#d6d6d6" }],
    },
    {
      featureType: "poi",
      elementType: "geometry",
      stylers: [{ color: "#eeeeee" }],
    },
    {
      featureType: "poi.park",
      elementType: "geometry",
      stylers: [{ color: "#d0e8d0" }],
    },
    {
      featureType: "road",
      elementType: "geometry",
      stylers: [{ color: "#ffffff" }],
    },
    {
      featureType: "road.arterial",
      elementType: "geometry",
      stylers: [{ color: "#eeeeee" }],
    },
    {
      featureType: "road.highway",
      elementType: "geometry",
      stylers: [{ color: "#dadada" }],
    },
    {
      featureType: "water",
      elementType: "geometry",
      stylers: [{ color: "#c9e3f5" }],
    },
  ];



  // Get current user location
  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        let loc = await Location.getCurrentPositionAsync({});
        setUserLoc({
          latitude: loc.coords.latitude,
          longitude: loc.coords.longitude,
        });
      } else {
        setUserLoc({ latitude: 26.8754, longitude: 80.9556 });
      }
    })();
  }, []);

  useEffect(() => {
    async function fetchRoute() {
      if (!userLoc) return;
      const apiKey = 'a389c09e75f54555a1ec976b429d6a1e'; // Replace this!
      const url = `https://api.geoapify.com/v1/routing?waypoints=${SHOP_LOCATION.latitude},${SHOP_LOCATION.longitude}|${userLoc.latitude},${userLoc.longitude}&mode=road_bike&apiKey=${apiKey}`;
      try {
        const res = await axios.get(url);
        if (
          res.data &&
          res.data.features &&
          res.data.features.length > 0 &&
          res.data.features[0].geometry.coordinates.length > 0
        ) {
          const coordinates = res.data.features[0].geometry.coordinates[0];
          const points = coordinates.map(coord => ({
            latitude: coord[1],
            longitude: coord[0],
          }));
          setRouteCoords(points);
        }
      } catch (e) {
        console.log('Routing API error', e?.response?.data || e.message);
      }

      setLoading(false);
    }
    fetchRoute();
  }, [userLoc]);

  if (loading || !userLoc)
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={{ color: colors.primary, marginTop: 12 }}>
          Loading map & order info...
        </Text>
      </View>
    );

  return (
    <View style={{ flex: 1, backgroundColor: '#f5f7fa' }}>
      {/* Back Button Overlay */}
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={{
          position: 'absolute',
          top: 36,
          left: 20,
          zIndex: 10,
          backgroundColor: '#fff',
          borderRadius: 20,
          elevation: 6,
          shadowColor: '#222',
          shadowOpacity: 0.1,
          shadowRadius: 5,
          padding: 2,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <Ionicons name={'chevron-back-circle-outline'} size={35} color={colors.primary} />
      </TouchableOpacity>

      <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}>
        <View style={styles.cardContainer}>
          <View style={styles.trackingCard}>
            {/* Map inside card */}
            <View style={styles.mapCard}>
              <MapView
                style={StyleSheet.absoluteFill}
                // customMapStyle={lightMapStyle} // 👈 Use custom style here
                initialRegion={{
                  latitude: (SHOP_LOCATION.latitude + userLoc.latitude) / 2,
                  longitude: (SHOP_LOCATION.longitude + userLoc.longitude) / 2,
                  latitudeDelta: Math.abs(SHOP_LOCATION.latitude - userLoc.latitude) + 0.035,
                  longitudeDelta: Math.abs(SHOP_LOCATION.longitude - userLoc.longitude) + 0.035,
                }}
                showsUserLocation={true}
                showsMyLocationButton={false}       // ❌ Hides bottom-right location icon (Android)
                showsCompass={false}                // ❌ Hides compass icon (top-right)
                toolbarEnabled={false}              // ❌ Hides Google Maps toolbar (Android)
                zoomControlEnabled={false}          // ❌ Hides zoom buttons (Android only)
                rotateEnabled={false}               // Optional: disables rotation
                pitchEnabled={false}                // Optional: disables 3D tilt
              >
                <Marker
                  coordinate={SHOP_LOCATION}
                  title={orderInfo.shop.name}
                  description={orderInfo.shop.address}
                  pinColor={colors.primary}
                />
                <Marker
                  coordinate={userLoc}
                  title="Your Location"
                  pinColor="#4381ff"
                >
                  {/* <Image
                    source={require('../../assets/delivery_boy.png')}
                    style={{ width: 40, height: 40, resizeMode: 'contain' }}
                  /> */}
                </Marker>
                {routeCoords.length > 1 && (
                  <Polyline
                    coordinates={routeCoords}
                    strokeColor={'#639EF7'}
                    strokeWidth={8}
                  />
                )}
              </MapView>
            </View>
            {/* Tracking Info Below Map */}
            <View style={{ marginTop: 16, padding: 10 }}>
              {/* ETA and order status */}
              <View style={styles.statusRow}>
                <View style={styles.etaBox}>
                  <Icon name="timer" size={20} color="#fff" />
                  <Text style={styles.etaText}>{orderInfo.eta} Delivery</Text>
                </View>
                <View style={styles.statusChip}>
                  <Icon name="local-shipping" size={16} color={colors.primary} />
                  <Text style={styles.statusText}>{orderInfo.status}</Text>
                </View>
              </View>
              <Text style={styles.orderId}>
                Order ID: <Text style={{ color: colors.primary }}>{orderInfo.orderId}</Text>
              </Text>
              {/* Delivery Boy Info */}
              <View style={styles.row}>
                <Icon name="person" size={18} color={colors.primary} />
                <Text style={styles.boldText}>{orderInfo.deliveryBoy.name}</Text>
                <Text style={styles.lightText}>
                  ({orderInfo.deliveryBoy.vehicle} • {orderInfo.deliveryBoy.vehicleNo})
                </Text>
                <TouchableOpacity
                  style={styles.phoneBtn}
                  onPress={() => {
                    Linking.openURL(`tel:${orderInfo.deliveryBoy.phone.replace(/ /g, '')}`);
                  }}>
                  <Icon name="phone" size={18} color="#fff" />
                </TouchableOpacity>
              </View>
              {/* Progress Bar */}
              <View style={styles.progressBarBg}>
                {/* <View style={styles.progressBarFill} /> */}
                <Text style={styles.progressText}>Express ({orderInfo.eta})</Text>
              </View>
              {/* Delivery Address */}
              <View style={styles.infoRow}>
                <Icon name="home" size={18} color={colors.primary} style={{ marginTop: 2 }} />
                <View style={{ marginLeft: 7, flex: 1 }}>
                  <Text style={styles.sectionLabel}>Deliver to</Text>
                  <Text style={styles.valueText}>{orderInfo.user.name}</Text>
                  <Text style={styles.valueText}>{orderInfo.user.address}</Text>
                  <Text style={styles.valueText}>{orderInfo.user.phone}</Text>
                </View>
              </View>
              {/* Shop Info */}
              <View style={styles.infoRow}>
                <Icon name="store" size={18} color="#2e8b57" style={{ marginTop: 2 }} />
                <View style={{ marginLeft: 7, flex: 1 }}>
                  <Text style={styles.sectionLabel}>From</Text>
                  <Text style={styles.valueText}>{orderInfo.shop.name}</Text>
                  <Text style={styles.valueText}>{orderInfo.shop.address}</Text>
                  <Text style={styles.valueText}>{orderInfo.shop.phone}</Text>
                </View>
              </View>
              {/* Items */}
              <View style={{ marginTop: 8 }}>
                <Text style={styles.sectionLabel}>Order Items</Text>
                {orderInfo.items.map((item, idx) => (
                  <Text style={styles.itemRow} key={idx}>
                    <Text style={styles.itemQty}>{item.qty} × </Text>
                    <Text style={styles.itemName}>{item.name}</Text>
                  </Text>
                ))}
              </View>
              {/* Order Summary */}
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Total Amount</Text>
                <Text style={styles.summaryAmount}>₹{orderInfo.totalAmount}</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Payment</Text>
                <Text style={styles.summaryAmount}>{orderInfo.payment}</Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const CARD_HEIGHT = 570;
const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  cardContainer: {
    paddingHorizontal: 12,
    paddingBottom: 16,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  trackingCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 0,
    elevation: 7,
    shadowColor: '#90a4ae',
    shadowOffset: { width: 0, height: 7 },
    shadowOpacity: 0.16,
    shadowRadius: 16,
    minHeight: CARD_HEIGHT,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e7eaf1',
    width: width * 0.95,
    overflow: 'hidden',
  },
  mapCard: {
    height: 210,
    width: '100%',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    overflow: 'hidden',
    backgroundColor: '#e4eaf0',
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 7,
  },
  etaBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingHorizontal: 13,
    paddingVertical: 6,
    marginRight: 14,
  },
  etaText: {
    color: '#fff',
    fontWeight: 'bold',
    marginLeft: 8,
    fontSize: 15,
  },
  statusChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e5f7e8',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  statusText: {
    color: '#2e8b57',
    fontWeight: 'bold',
    fontSize: 14,
    marginLeft: 5,
  },
  orderId: {
    marginTop: 8,
    marginBottom: 2,
    color: '#888',
    fontWeight: '700',
    fontSize: 15,
    letterSpacing: 0.08,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    marginBottom: 7,
  },
  boldText: {
    color: '#333',
    fontWeight: '700',
    marginLeft: 7,
    fontSize: 15,
  },
  lightText: {
    color: '#888',
    fontSize: 13,
    marginLeft: 7,
    fontWeight: '500',
  },
  phoneBtn: {
    marginLeft: 'auto',
    backgroundColor: colors.primary,
    borderRadius: 18,
    padding: 7,
  },
  progressBarBg: {
    height: 25,
    backgroundColor: colors.primary,
    borderRadius: 8,
    marginTop: 8,
    marginBottom: 8,
    justifyContent: 'center',
  },
  progressBarFill: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    backgroundColor: colors.primary,
    borderRadius: 8,
    width: width - 70,
  },
  progressText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 13,
    textAlign: 'center',
    zIndex: 2,
  },
  infoRow: {
    marginTop: 8,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  sectionLabel: {
    fontWeight: 'bold',
    color: colors.primary,
    fontSize: 13,
    marginBottom: 1,
  },
  valueText: {
    color: '#222',
    fontSize: 14,
    marginBottom: 1,
  },
  itemRow: {
    color: '#2e2e2e',
    fontSize: 14.5,
    marginBottom: 2,
    marginLeft: 4,
  },
  itemQty: {
    color: colors.primary,
    fontWeight: 'bold',
  },
  itemName: {
    color: '#333',
    fontWeight: '500',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 7,
  },
  summaryLabel: {
    color: '#888',
    fontSize: 14,
    fontWeight: '600',
  },
  summaryAmount: {
    color: colors.primary,
    fontWeight: 'bold',
    fontSize: 15.5,
  },

});