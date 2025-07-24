import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialIcons';
import CustomHeader from '../../components/CustomHeader';
import colors from '../../constants/colors';

// Dummy order history data (You can replace this with API data)
const orders = [
  {
    id: '1',
    orderNo: '200321',
    date: '2025-06-10',
    time: '10:45 AM',
    status: 'Delivered',
    amount: 299,
    items: 3,
    address: '101, Green Avenue, Mumbai',
    customer: 'Rahul Sharma',
  },
  {
    id: '2',
    orderNo: '200322',
    date: '2025-06-09',
    time: '12:30 PM',
    status: 'Rejected',
    amount: 189,
    items: 2,
    address: '45, City Center, Pune',
    customer: 'Priya Mehta',
  },
  {
    id: '3',
    orderNo: '200323',
    date: '2025-06-08',
    time: '03:20 PM',
    status: 'Pending',
    amount: 520,
    items: 5,
    address: '12, Rose Lane, Delhi',
    customer: 'Rohan Singh',
  },
];

const statusColors = {
  Delivered: '#4CAF50',
  Pending: '#FFC107',
  Rejected: '#F44336',
};

const statusIcons = {
  Delivered: 'check-circle',
  Pending: 'hourglass-empty',
  Rejected: 'cancel',
};

export default function OrderHistoryScreen({ navigation }) {
  const renderOrder = ({ item }) => (
    <TouchableOpacity
      style={styles.orderCard}
      activeOpacity={0.87}
      onPress={() => navigation.navigate('OrderDetailsScreen', { orderId: item.id })}
    >
      <LinearGradient
        colors={['#f8fafc', '#e4e8ed']}
        style={styles.cardGradient}
      >
        <View style={styles.cardHeader}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Icon
              name={statusIcons[item.status]}
              size={22}
              color={statusColors[item.status]}
              style={{ marginRight: 6 }}
            />
            <Text style={styles.orderNo}>Order #{item.orderNo}</Text>
          </View>
          <View
            style={[
              styles.statusBadge,
              { backgroundColor: statusColors[item.status] },
            ]}
          >
            <Text style={styles.statusText}>{item.status}</Text>
          </View>
        </View>
        <View style={{ marginBottom: 8 }}>
          <View style={styles.cardRow}>
            <Icon name="calendar-today" size={16} color={colors.primary} />
            <Text style={styles.cardInfo}>
              {item.date} | {item.time}
            </Text>
          </View>
          <View style={styles.cardRow}>
            <Icon name="person" size={16} color={colors.primaryDark} />
            <Text style={styles.cardInfo}>{item.customer}</Text>
          </View>
        </View>
        <View style={styles.cardRow}>
          <Icon name="location-on" size={16} color={colors.secondaryDark} />
          <Text style={styles.cardInfo}>{item.address}</Text>
        </View>
        <View style={styles.cardSummaryRow}>
          <View style={styles.summaryItem}>
            <Icon name="shopping-bag" size={16} color={colors.primary} />
            <Text style={styles.summaryText}>{item.items} Items</Text>
          </View>
          <View style={styles.summaryItem}>
            <Icon name="payments" size={16} color={colors.primaryDark} />
            <Text style={styles.summaryText}>₹{item.amount}</Text>
          </View>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <LinearGradient
        colors={['#f5f7fa', '#e4e8ed']}
        style={styles.background}
      />
      <CustomHeader navigation={navigation} title="Order History" isHome={false} />
      <View style={styles.container}>
        <FlatList
          data={orders}
          keyExtractor={item => item.id}
          renderItem={renderOrder}
          contentContainerStyle={{ paddingBottom: 26, paddingTop: 10 }}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={{ alignItems: 'center', marginTop: 48 }}>
              <Icon name="history" size={60} color={colors.primaryLight} />
              <Text style={{ color: colors.textSecondary, fontSize: 18, marginTop: 10 }}>
                No order history found.
              </Text>
            </View>
          }
        />
      </View>
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
    flex: 1,
    paddingHorizontal: 14,
    paddingTop: 4,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 18,
    textAlign: 'center',
    marginTop: 12,
    letterSpacing: 0.5,
  },
  orderCard: {
    marginBottom: 18,
    borderRadius: 18,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
    backgroundColor: '#fff',
  },
  cardGradient: {
    padding: 18,
    borderRadius: 18,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  orderNo: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.primaryDark,
  },
  statusBadge: {
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 2,
    alignSelf: 'flex-start',
  },
  statusText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 12,
    textTransform: 'capitalize',
  },
  cardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  cardInfo: {
    marginLeft: 7,
    color: colors.textSecondary,
    fontSize: 13,
    flexShrink: 1,
  },
  cardSummaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
  },
  summaryItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  summaryText: {
    marginLeft: 5,
    color: colors.textPrimary,
    fontWeight: '600',
    fontSize: 13,
  },
});