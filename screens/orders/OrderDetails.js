import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Image,
} from "react-native";
import CustomHeader from '../../components/CustomHeader';
import colors from '../../constants/colors';

// Set dummy info for demo
const exampleOrder = {
  orderId: "ORD12345",
  items: [
    { name: "Amul Milk 1L", qty: 2, price: 32 },
    { name: "Harvest Bread", qty: 1, price: 45 },
    { name: "Eggs (6 pack)", qty: 1, price: 55 },
    { name: "Tomato (1kg)", qty: 1, price: 28 }
  ],
  status: "pending",
  deliveryAddress: "12, Main Street, Downtown City, 110011",
  customerName: "Rahul Sharma",
  customerPhone: "+91 98765 43210",
  handlingCharge: 12,
  gstPercent: 5,
  paymentMethod: null, // Will be set on submit
};

const dummyUserInfo = {
  avatar: "https://randomuser.me/api/portraits/men/31.jpg",
  name: "Rahul Sharma",
  phone: "+91 98765 43210",
  address: "12, Main Street, Downtown City, 110011"
};

export default function OrderDetails({ navigation, route }) {
  const [order, setOrder] = useState(exampleOrder);
  const [payment, setPayment] = useState(order.paymentMethod || null);

  // Calculate amount (sum of item prices), GST and total
  const amount = order.items.reduce((sum, item) => sum + item.qty * (item.price || 0), 0);
  const gstCharge = Math.round((amount + (order.handlingCharge || 0)) * (order.gstPercent || 0) / 100);
  const total = amount + (order.handlingCharge || 0) + gstCharge;

  // Handler for payment method selection
  const handlePayment = (method) => setPayment(method);

  // Demo edit handler
  const handleEdit = () => {
    Alert.alert("Edit", "Edit order info feature coming soon.");
  };

  const handleSubmit = () => {
    if (!payment) {
      Alert.alert("Select Payment", "Please select a payment method.");
      return;
    }
    Alert.alert(
      "Order Confirmed!",
      `Order #${order.orderId} confirmed.\nPayment: ${payment === "online" ? "Pay Online" : "Cash on Delivery"}`,
      [
        {
          text: "OK",
          onPress: () => {
            navigation.goBack();
          },
        },
      ]
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#f4f6fb" }}>
      <CustomHeader
        navigation={navigation}
        title={`Order #${order.orderId}`}
        isHome={false}
      />
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        {/* Order Status */}
        <View style={styles.statusRow}>
          <Text
            style={[
              styles.statusText,
              order.status === "confirmed" && styles.statusConfirmed,
              order.status === "pending" && styles.statusPending,
            ]}
          >
            {order.status === "pending"
              ? "🕒 Pending"
              : order.status === "confirmed"
              ? "✅ Confirmed"
              : order.status}
          </Text>
        </View>

        {/* Items List */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>🛒 Order Items</Text>
          {order.items.map((item, idx) => (
            <View style={styles.itemRow} key={idx}>
              <View style={styles.dotCircle} />
              <Text style={styles.itemName}>{item.name}</Text>
              <Text style={styles.qtyText}>× {item.qty}</Text>
              <Text style={styles.priceText}>₹{item.price || 0}</Text>
              <Text style={styles.totalText}>₹{item.qty * (item.price || 0)}</Text>
            </View>
          ))}
          <View style={styles.line} />
          <View style={styles.summaryRow}>
            <Text style={styles.label}>Subtotal</Text>
            <Text style={styles.value}>₹{amount}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.label}>Handling Charge</Text>
            <Text style={styles.value}>₹{order.handlingCharge || 0}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.label}>GST ({order.gstPercent || 0}%)</Text>
            <Text style={styles.value}>₹{gstCharge}</Text>
          </View>
          <View style={styles.line} />
          <View style={styles.summaryRow}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>₹{total}</Text>
          </View>
        </View>

        {/* User/Delivery Info */}
        <View style={styles.card}>
          <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 10 }}>
            <Image source={{ uri: dummyUserInfo.avatar }} style={styles.avatar} />
            <View style={{ flex: 1, marginLeft: 10 }}>
              <Text style={styles.userName}>{dummyUserInfo.name}</Text>
              <Text style={styles.userPhone}>{dummyUserInfo.phone}</Text>
            </View>
            <TouchableOpacity onPress={handleEdit}>
              <Text style={styles.editBtn}>Edit</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.addressLabel}>Delivery Address</Text>
          <Text style={styles.infoText}>{dummyUserInfo.address}</Text>
        </View>

        {/* Payment Mode */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>💳 Payment Method</Text>
          <View style={styles.paymentRow}>
            <TouchableOpacity
              style={[
                styles.payBtn,
                payment === "online" && styles.payBtnSelected,
              ]}
              onPress={() => handlePayment("online")}
            >
              <Text
                style={[
                  styles.payBtnText,
                  payment === "online" && styles.payBtnTextSelected,
                ]}
              >
                Pay Online
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.payBtn,
                payment === "cod" && styles.payBtnSelected,
              ]}
              onPress={() => handlePayment("cod")}
            >
              <Text
                style={[
                  styles.payBtnText,
                  payment === "cod" && styles.payBtnTextSelected,
                ]}
              >
                Cash on Delivery
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Submit Button */}
        <TouchableOpacity
          style={[
            styles.submitBtn,
            !payment && { backgroundColor: "#e1e1e1" },
          ]}
          onPress={handleSubmit}
          disabled={!payment}
        >
          <Text style={styles.submitText}>CONFIRM ORDER</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 18, paddingBottom: 32 },
  statusRow: {
    alignItems: "center",
    marginBottom: 14,
    marginTop: 2,
  },
  statusText: {
    fontSize: 16,
    fontWeight: "bold",
    backgroundColor: "#f7f7ff",
    paddingHorizontal: 16,
    paddingVertical: 7,
    borderRadius: 16,
    letterSpacing: 0.3,
    color: "#b57d16",
  },
  statusPending: {
    color: "#b57d16",
    backgroundColor: "#fff4e3",
    borderWidth: 1,
    borderColor: "#ffe2b2",
  },
  statusConfirmed: {
    color: "#2e8b57",
    backgroundColor: "#e2ffe6",
    borderWidth: 1,
    borderColor: "#97e6b7",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    marginBottom: 22,
    padding: 18,
    elevation: 2,
    shadowColor: "#e0e0e0",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.16,
    shadowRadius: 6,
    borderWidth: 1,
    borderColor: "#f2f3f5",
  },
  sectionTitle: {
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 11,
    color: colors.primaryDark,
    letterSpacing: 0.3,
  },
  itemRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
    paddingVertical: 3,
  },
  dotCircle: {
    width: 8,
    height: 8,
    borderRadius: 5,
    backgroundColor: "#ffe0b2",
    marginRight: 9,
  },
  itemName: { flex: 2, color: "#222", fontSize: 15 },
  qtyText: { flex: 0.8, textAlign: "center", color: "#444", fontSize: 15 },
  priceText: { flex: 0.9, textAlign: "right", color: "#888", fontSize: 15 },
  totalText: { flex: 1, textAlign: "right", color: "#222", fontSize: 15, fontWeight: "600" },
  line: {
    borderBottomColor: "#ededed",
    borderBottomWidth: 1,
    marginVertical: 12,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 3,
    marginTop: 2,
  },
  label: { color: "#888", fontSize: 14 },
  value: { color: "#333", fontWeight: "500", fontSize: 14 },
  totalLabel: { fontWeight: "bold", color: colors.primary, fontSize: 16 },
  totalValue: { fontWeight: "bold", color: colors.primary, fontSize: 16 },
  avatar: {
    width: 46,
    height: 46,
    borderRadius: 23,
    marginRight: 5,
    backgroundColor: "#f2f3f5",
  },
  userName: {
    fontWeight: "bold",
    color: colors.primaryDark,
    fontSize: 15.5,
    marginBottom: 1,
  },
  userPhone: {
    color: "#777",
    fontSize: 13.5,
  },
  addressLabel: {
    marginTop: 4,
    color: "#999",
    fontWeight: "600",
    fontSize: 13,
    marginBottom: 2,
  },
  infoText: {
    marginBottom: 4,
    color: "#333",
    fontSize: 14.5,
    letterSpacing: 0.1,
    paddingLeft: 1,
  },
  editBtn: {
    color: colors.primary,
    fontWeight: "700",
    fontSize: 14,
    textDecorationLine: "underline",
    padding: 2,
  },
  paymentRow: {
    flexDirection: "row",
    marginTop: 14,
    gap: 17,
    justifyContent: "center",
  },
  payBtn: {
    flex: 1,
    backgroundColor: "#f7f7f7",
    borderRadius: 9,
   paddingVertical:15,
   paddingHorizontal:6,
    alignItems: "center",
    borderWidth: 1.7,
    borderColor: "#e0e0e0",
  },
  payBtnSelected: {
    borderColor: colors.primary,
    backgroundColor: "#f1f7ff",
    elevation: 2,
    shadowColor: "#e1e7fa",
  },
  payBtnText: {
    color: "#888",
    fontWeight: "700",
    fontSize: 14,
  },
  payBtnTextSelected: {
    color: colors.primary,
  },
  submitBtn: {
    marginTop: 8,
    backgroundColor: colors.primary,
    borderRadius: 14,
    paddingVertical: 17,
    alignItems: "center",
    elevation: 2,
    shadowColor: "#c0c0c0",
  },
  submitText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 17,
    letterSpacing: 0.8,
  },
});