import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
  Modal,
  Alert,
  ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialIcons';
import CustomHeader from '../../components/CustomHeader';
import colors from '../../constants/colors';

export default function WalletScreen({ navigation }) {
  // Dummy wallet info
  const [walletAmount, setWalletAmount] = useState(3540.75);
  const [modalVisible, setModalVisible] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [loading, setLoading] = useState(false);

  const recentTransactions = [
    { id: '1', type: 'Credit', amount: 1500, date: '2025-06-16', desc: 'Order Delivery', icon: 'arrow-downward' },
    { id: '2', type: 'Debit', amount: 400, date: '2025-06-15', desc: 'Withdrawal', icon: 'arrow-upward' },
    { id: '3', type: 'Credit', amount: 2000, date: '2025-06-14', desc: 'Order Delivery', icon: 'arrow-downward' },
    { id: '4', type: 'Debit', amount: 100, date: '2025-06-13', desc: 'Service Fee', icon: 'arrow-upward' },
  ];

  const openWithdrawModal = () => {
    setWithdrawAmount('');
    setModalVisible(true);
  };

  const closeWithdrawModal = () => setModalVisible(false);

  const handleWithdrawRequest = () => {
    const amount = parseFloat(withdrawAmount);
    if (isNaN(amount) || amount <= 0) {
      Alert.alert('Invalid Amount', 'Enter a valid withdrawal amount.');
      return;
    }
    if (amount > walletAmount) {
      Alert.alert('Insufficient Balance', 'Withdrawal exceeds wallet balance.');
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setWalletAmount(walletAmount - amount);
      closeWithdrawModal();
      Alert.alert('Withdrawal Requested', `₹${amount} withdrawal request submitted!`);
    }, 1200);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <LinearGradient colors={['#f5f7fa', '#e4e8ed']} style={styles.background} />
      <CustomHeader navigation={navigation} title="Wallet" isHome={false} />
      <ScrollView contentContainerStyle={styles.container}>
        {/* Wallet Card */}
        <LinearGradient colors={[colors.primary, colors.primaryLight]} style={styles.walletCard}>
          <View style={styles.walletTopRow}>
            <Icon name="account-balance-wallet" size={42} color="#fff" />
            <TouchableOpacity onPress={openWithdrawModal} style={styles.withdrawBtn}>
              <LinearGradient
                colors={[colors.primaryLight, colors.primaryDark]}
                style={styles.withdrawBtnGradient}
              >
                <Icon name="request-quote" size={18} color="#fff" />
                <Text style={styles.withdrawBtnText}>Request Withdrawal</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
          <Text style={styles.walletLabel}>Wallet Balance</Text>
          <Text style={styles.walletAmount}>₹{walletAmount.toFixed(2)}</Text>
        </LinearGradient>

        {/* Recent Transactions */}
        <Text style={styles.title}>Recent Transactions</Text>
        <View style={styles.txnList}>
          {recentTransactions.map(txn => (
            <View style={styles.txnItem} key={txn.id}>
              <View style={[
                styles.txnIconWrap,
                { backgroundColor: txn.type === 'Credit' ? '#e4fbe5' : '#fff4f1' }
              ]}>
                <Icon
                  name={txn.icon}
                  size={22}
                  color={txn.type === 'Credit' ? '#2ecc71' : '#f44336'}
                />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.txnDesc}>{txn.desc}</Text>
                <Text style={styles.txnDate}>{txn.date}</Text>
              </View>
              <Text
                style={[
                  styles.txnAmount,
                  { color: txn.type === 'Credit' ? '#2ecc71' : '#f44336' }
                ]}
              >
                {txn.type === 'Credit' ? '+' : '-'}₹{txn.amount}
              </Text>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Withdraw Modal */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={closeWithdrawModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Request Withdrawal</Text>
            <Text style={styles.modalSub}>Available: ₹{walletAmount.toFixed(2)}</Text>
            <TextInput
              keyboardType="numeric"
              style={styles.input}
              placeholder="Enter amount"
              placeholderTextColor={colors.textSecondary}
              value={withdrawAmount}
              onChangeText={setWithdrawAmount}
              editable={!loading}
            />
            <View style={styles.modalBtns}>
              <TouchableOpacity
                style={[styles.modalBtn, styles.cancelBtn]}
                onPress={closeWithdrawModal}
                disabled={loading}
              >
                <Text style={styles.modalBtnText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalBtn, styles.confirmBtn]}
                onPress={handleWithdrawRequest}
                disabled={loading}
              >
                <Text style={styles.modalBtnText}>{loading ? 'Requesting...' : 'Request'}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: 'transparent' },
  background: {
    position: 'absolute', left: 0, right: 0, top: 0, bottom: 0,
  },
  container: {
    flexGrow: 1,
    padding: 18,
    paddingTop: 6,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  walletCard: {
    width: '100%',
    borderRadius: 18,
    padding: 22,
    marginBottom: 26,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 7 },
    shadowOpacity: 0.10,
    shadowRadius: 12,
    elevation: 3,
  },
  walletTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  walletLabel: {
    color: '#fff',
    marginTop: 20,
    fontSize: 15,
    letterSpacing: 0.2,
    fontWeight: '500',
  },
  walletAmount: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 34,
    marginTop: 4,
    letterSpacing: 1,
  },
  withdrawBtn: {
    borderRadius: 9,
    overflow: 'hidden',
    elevation: 2,
  },
  withdrawBtnGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    paddingVertical: 9,
    paddingHorizontal: 10,
    borderRadius: 9,
    backgroundColor: colors.secondary,
  },
  withdrawBtnText: {
    color: '#fff',
    fontWeight: '500',
    fontSize: 14,
    marginLeft: 5,
  },
  title: {
    fontSize: 19,
    fontWeight: '700',
    color: colors.primaryDark,
    marginTop: 10,
    marginBottom: 12,
    textAlign: 'left',
    alignSelf: 'flex-start',
  },
  txnList: {
    width: '100%',
    marginBottom: 20,
  },
  txnItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    borderRadius: 14,
    paddingVertical: 13,
    paddingHorizontal: 14,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 1,
  },
  txnIconWrap: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 15,
  },
  txnDesc: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  txnDate: {
    fontSize: 12.5,
    color: colors.textSecondary,
    marginTop: 1,
  },
  txnAmount: {
    fontSize: 17,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  // Modal
  modalOverlay: {
    flex: 1, backgroundColor: '#000000AA', justifyContent: 'center', alignItems: 'center',
  },
  modalContent: {
    width: '88%',
    backgroundColor: colors.white,
    borderRadius: 18,
    paddingVertical: 28,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: colors.primaryDark,
    marginBottom: 6,
  },
  modalSub: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 14,
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: colors.primaryLight,
    borderRadius: 9,
    padding: 12,
    fontSize: 17,
    marginBottom: 22,
    color: colors.textPrimary,
    backgroundColor: '#f9fafb',
  },
  modalBtns: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    gap: 12,
  },
  modalBtn: {
    flex: 1,
    borderRadius: 8,
    paddingVertical: 11,
    alignItems: 'center',
    elevation: 2,
  },
  confirmBtn: {
    backgroundColor: colors.primary,
  },
  cancelBtn: {
    backgroundColor: colors.secondary,
  },
  modalBtnText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
});