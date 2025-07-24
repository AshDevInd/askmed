import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialIcons';
import colors from '../../constants/colors';
import CustomHeader from '../../components/CustomHeader';

// Dummy order data - replace with prop or API data as needed
const dummyOrder = {
  orderNo: '100321',
  date: '2025-06-12',
  time: '10:45 AM',
  status: 'Delivered',
  amount: 299,
  items: [
    { name: 'Chini', qty: 1, price: 120 },
    { name: 'Aata', qty: 1, price: 89 },
    { name: 'Oil', qty: 1, price: 40 },
  ],
  address: '101, Green Avenue, Mumbai',
  customer: {
    name: 'Rahul Sharma',
    phone: '+91 9876543210',
  },
  paymentMethod: 'UPI',
  deliveryAgent: 'Amit Kumar',
  specialInstructions: 'Ring the bell twice at delivery.',
};

const statusColors = {
  Delivered: '#4CAF50',
  Rejected: '#F44336',
  Pending: '#FFC107',
};

const statusIcons = {
  Delivered: 'check-circle',
  Rejected: 'cancel',
  Pending: 'hourglass-empty',
};

export default function OrderDetailsScreen({ navigation, route }) {
  // In a real app, use route.params.orderId to fetch order details.
  const order = dummyOrder;

  return (
    <SafeAreaView style={styles.safeArea}>
      <LinearGradient
        colors={['#f5f7fa', '#e4e8ed']}
        style={styles.background}
      />
      <CustomHeader
        navigation={navigation}
        title={`Order #${order.orderNo}`}
        isHome={false}
        rightIcon=""
      />
      <ScrollView contentContainerStyle={styles.container}>
        <LinearGradient
          colors={['#fff', '#f7fafd']}
          style={styles.card}
        >
          {/* Order Header */}
          <View style={styles.headerRow}>
            <View>
              <Text style={styles.orderNo}>Order #{order.orderNo}</Text>
              <View style={styles.statusRow}>
                <View
                  style={[
                    styles.statusBadge,
                    { backgroundColor: statusColors[order.status] || colors.primaryLight },
                  ]}
                >
                  <Text style={styles.statusText}>{order.status}</Text>
                </View>
                <Text style={styles.dateText}>
                  <Icon name="calendar-today" size={15} color={colors.primary} /> {order.date} | {order.time}
                </Text>
              </View>
            </View>
            <LinearGradient
              colors={[colors.primary, colors.primaryLight]}
              style={styles.amountBadge}
            >
              <Icon name="payments" size={19} color="#fff" />
              <Text style={styles.amountText}>₹{order.amount}</Text>
            </LinearGradient>
          </View>

          {/* Divider */}
          <View style={styles.divider} />

          {/* Items List */}
          <Text style={styles.sectionTitle}>Order Items</Text>
          <View style={styles.itemsContainer}>
            {order.items.map((item, idx) => (
              <View key={idx} style={styles.itemRow}>
                <Text style={styles.itemName}>{item.name}</Text>
                <View style={styles.itemMeta}>
                  <Text style={styles.itemQty}>x{item.qty}</Text>
                  <Text style={styles.itemPrice}>₹{item.price}</Text>
                </View>
              </View>
            ))}
          </View>

          {/* Divider */}
          <View style={styles.divider} />

          {/* Delivery Details */}
          <Text style={styles.sectionTitle}>Delivery Details</Text>
          <View style={styles.infoRow}>
            <Icon name="location-on" size={18} color={colors.secondaryDark} />
            <Text style={styles.infoText}>{order.address}</Text>
          </View>
          <View style={styles.infoRow}>
            <Icon name="person" size={18} color={colors.primary} />
            <Text style={styles.infoText}>{order.customer.name} ({order.customer.phone})</Text>
          </View>
          <View style={styles.infoRow}>
            <Icon name="directions-bike" size={18} color={colors.primary} />
            <Text style={styles.infoText}>Delivered by {order.deliveryAgent}</Text>
          </View>

          {/* Divider */}
          <View style={styles.divider} />

          {/* Payment Info */}
          <Text style={styles.sectionTitle}>Payment</Text>
          <View style={styles.infoRow}>
            <Icon name="payment" size={18} color={colors.primary} />
            <Text style={styles.infoText}>{order.paymentMethod}</Text>
          </View>

          {/* Special Instructions */}
          {order.specialInstructions ? (
            <>
              <View style={styles.divider} />
              <Text style={styles.sectionTitle}>Special Instructions</Text>
              <View style={styles.infoRow}>
                <Icon name="info-outline" size={18} color={colors.secondaryDark} />
                <Text style={styles.infoText}>{order.specialInstructions}</Text>
              </View>
            </>
          ) : null}

          {/* Back Button */}
          <TouchableOpacity
            style={styles.actionBtn}
            activeOpacity={0.87}
            onPress={() => navigation.goBack()}
          >
            <LinearGradient colors={colors.primaryGradient} style={styles.actionBtnGradient}>
              <Icon name="arrow-back" size={18} color="#fff" />
              <Text style={styles.actionBtnText}>Back to Orders</Text>
            </LinearGradient>
          </TouchableOpacity>
        </LinearGradient>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  background: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  container: {
    flexGrow: 1,
    padding: 18,
    paddingTop: 6,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  card: {
    width: '100%',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 4,
    backgroundColor: '#fff',
    marginBottom: 18,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  orderNo: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.primaryDark,
    marginBottom: 2,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 3,
  },
  statusBadge: {
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 2,
    marginRight: 8,
    alignSelf: 'flex-start',
  },
  statusText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 12,
  },
  dateText: {
    color: colors.textSecondary,
    fontSize: 13,
  },
  amountBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 12,
    alignSelf: 'flex-start',
    minWidth: 72,
    position:'absolute',top:-10,right:0,
    justifyContent: 'center',
    gap: 7,
  },
  amountText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 18,
    marginLeft: 2,
  },
  divider: {
    height: 1,
    backgroundColor: '#ececec',
    marginVertical: 14,
    borderRadius: 0.5,
  },
  sectionTitle: {
    fontWeight: '700',
    fontSize: 15,
    color: colors.primaryDark,
    marginBottom: 7,
    marginTop: 2,
  },
  itemsContainer: {
    marginBottom: 2,
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
    backgroundColor: colors.lightGray,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  itemName: {
    color: colors.textPrimary,
    fontSize: 14,
    fontWeight: '500',
    flex: 1,
  },
  itemMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  itemQty: {
    color: colors.textSecondary,
    fontSize: 14,
    marginRight: 8,
    fontWeight: '600',
  },
  itemPrice: {
    color: colors.primaryDark,
    fontSize: 15,
    fontWeight: '700',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 6,
    gap: 7,
  },
  infoText: {
    color: colors.textSecondary,
    fontSize: 13,
    flex: 1,
    flexWrap: 'wrap',
    fontWeight: '500',
  },
  actionBtn: {
    marginTop: 26,
    borderRadius: 10,
    overflow: 'hidden',
    elevation: 2,
  },
  actionBtnGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 13,
    borderRadius: 10,
    paddingHorizontal: 17,
    backgroundColor: colors.primary,
  },
  actionBtnText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 15,
    marginLeft: 5,
  },
});