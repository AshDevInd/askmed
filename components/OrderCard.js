import React from "react";
import { TouchableOpacity, Text, View, StyleSheet, Image } from "react-native";

// Optionally, you can pass an "avatar" (shop or user) prop, or an order image
export default function OrderCard({ order, onPress }) {
    return (
        <TouchableOpacity style={orderCardStyles.card} onPress={onPress} activeOpacity={0.93}>
            <View style={orderCardStyles.headerRow}>
                <View style={orderCardStyles.statusBadge}>
                    <Text style={orderCardStyles.statusText}>Order Pending</Text>
                </View>
                <Text style={orderCardStyles.orderId}>#{order.orderId}</Text>
            </View>
            <View style={orderCardStyles.body}>
                {order.items.map((item, idx) => (
                    <View key={idx} style={orderCardStyles.itemRow}>
                        <View style={orderCardStyles.dot} />
                        <Text style={orderCardStyles.itemText}>
                            {item.qty} × {item.name}
                        </Text>
                    </View>
                ))}
            </View>
            <View style={orderCardStyles.footerRow}>
                <View style={orderCardStyles.pendingBtn}>
                    <Text style={orderCardStyles.btnText}>Pending</Text>
                </View>
                {order.total && (
                    <View style={orderCardStyles.totalBox}>
                        <Text style={orderCardStyles.totalLabel}>Total</Text>
                        <Text style={orderCardStyles.totalText}>₹{order.total}</Text>
                    </View>
                )}
            </View>
        </TouchableOpacity>
    );
}

const orderCardStyles = StyleSheet.create({
    card: {
        backgroundColor: "#fff",
        borderRadius: 18,
        paddingVertical: 18,
        paddingHorizontal: 22,
        marginVertical: 12,
        marginHorizontal: 16,
        shadowColor: "#b0b0b0",
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.14,
        shadowRadius: 9,
        elevation: 6,
        borderWidth: 1.5,
        borderColor: "#f2f2f2",
    },
    headerRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 12,
    },
    statusBadge: {
        backgroundColor: "#fff4e3",
        paddingHorizontal: 14,
        paddingVertical: 5,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: "#ffe1b1",
        shadowColor: "#ffc97a",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.10,
        shadowRadius: 2,
        elevation: 2,
    },
    statusText: {
        color: "#ff9800",
        fontWeight: "bold",
        fontSize: 13.5,
    },
    orderId: {
        color: "#aaa",
        fontSize: 13,
        fontWeight: "600",
    },
    body: {
        marginBottom: 12,
    },
    itemRow: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 4,
    },
    dot: {
        width: 7,
        height: 7,
        borderRadius: 4,
        backgroundColor: "#ffe0b2",
        marginRight: 10,
        marginLeft: 2,
    },
    itemText: {
        color: "#222",
        fontSize: 15,
        fontWeight: "500",
        letterSpacing: 0.2,
    },
    footerRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    pendingBtn: {
        backgroundColor: "#f7f7f7",
        borderRadius: 9,
        paddingVertical: 8,
        paddingHorizontal: 24,
        borderWidth: 1.2,
        borderColor: "#e0e0e0",
    },
    btnText: {
        color: "#b58a53",
        fontWeight: "700",
        fontSize: 14.5,
        letterSpacing: 0.18,
    },
    totalBox: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#f9f9f9",
        borderRadius: 8,
        paddingVertical: 6,
        paddingHorizontal: 11,
        borderWidth: 1,
        borderColor: "#e4e4e4",
    },
    totalLabel: {
        color: "#999",
        fontWeight: "bold",
        fontSize: 12.5,
        marginRight: 6,
    },
    totalText: {
        color: "#388e3c",
        fontWeight: "bold",
        fontSize: 15,
        letterSpacing: 0.14,
    },
});