import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Modal, Pressable, Platform } from 'react-native';
import { DrawerContentScrollView } from '@react-navigation/drawer';
import { AntDesign, MaterialIcons, FontAwesome5, Feather, Entypo } from '@expo/vector-icons';
import colors from '../constants/colors';
import { StatusBar } from 'expo-status-bar';

export default function DrawerContent(props) {
  const user = {
    name: 'John Doe',
    email: 'john.doe@example.com',
    userId: 'JD1234',
    profileImage: null,
  };
  const { setIsLoggedIn } = props;

  const [logoutModalVisible, setLogoutModalVisible] = useState(false);

  const toggleLogoutModal = () => setLogoutModalVisible(!logoutModalVisible);

  const signOut = () => {
    // TODO: Add real sign out logic here
    toggleLogoutModal();
    setIsLoggedIn(false);
  };

  // Drawer menu items
  const drawerMenus = [
    {
      label: 'Home',
      icon: <AntDesign name="home" size={22} color={colors.primary} />,
      onPress: () => props.navigation.navigate('Home'),
    },
    {
      label: 'My Profile',
      icon: <AntDesign name="user" size={22} color={colors.primary} />,
      onPress: () => props.navigation.navigate('ProfileScreen'),
    },
    {
      label: 'Earnings / Wallet',
      icon: <FontAwesome5 name="wallet" size={20} color={colors.primary} />,
      onPress: () => props.navigation.navigate('WalletScreen'),
    },
    {
      label: 'Contact Support',
      icon: <Feather name="help-circle" size={22} color={colors.primary} />,
      onPress: () => props.navigation.navigate('ShopDetails'),
    },
    {
      label: 'OrderTrackScreen',
      icon: <MaterialIcons name="privacy-tip" size={22} color={colors.primary} />,
      onPress: () => props.navigation.navigate('OrderTrackScreen'),
    },
    {
      label: 'Terms & Conditions',
      icon: <Entypo name="text-document" size={22} color={colors.primary} />,
      onPress: () => props.navigation.navigate('TermsConditions'),
    },
  ];

  return (
    <View style={{ flex: 1, backgroundColor: colors.white }}>
      <StatusBar />
      <DrawerContentScrollView
        {...props}
        contentContainerStyle={{ paddingTop: 0 }}
        style={{ backgroundColor: colors.white }}
      >
        {/* Header */}
        <LinearGradient
          colors={[colors.primary, colors.primaryLight]}
          style={styles.headerContainer}
        >
          <View style={styles.profileImageContainer}>
            {user.profileImage ? (
              <Image source={{ uri: user.profileImage }} style={styles.profileImage} />
            ) : (
              <View style={styles.profilePlaceholder}>
                <Text style={styles.profileInitial}>{user.name.charAt(0)}</Text>
              </View>
            )}
          </View>
          <View style={styles.userInfo}>
            <Text style={styles.userName}>{user.name}</Text>
            <Text style={styles.userEmail}>{user.email}</Text>
            <View style={styles.userIdRow}>
              <FontAwesome5 name="id-badge" size={14} color={colors.white} style={{ marginRight: 6 }} />
              <Text style={styles.userId}>ID: {user.userId}</Text>
            </View>
          </View>
        </LinearGradient>

        {/* Divider */}
        <View style={styles.divider} />

        {/* Drawer Items */}
        <View style={styles.drawerSection}>
          {drawerMenus.map((item, idx) => (
            <TouchableOpacity
              key={item.label}
              style={styles.drawerItem}
              activeOpacity={0.75}
              onPress={item.onPress}
            >
              <View style={styles.menuIconWrap}>{item.icon}</View>
              <Text style={styles.drawerLabel}>{item.label}</Text>
              <AntDesign name="right" size={16} color={colors.primaryLight} style={{ marginLeft: 'auto' }} />
            </TouchableOpacity>
          ))}
        </View>
      </DrawerContentScrollView>

      {/* Logout Button */}
      <View style={styles.logoutSection}>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={toggleLogoutModal}
          style={styles.logoutButton}
        >
          <AntDesign name="logout" size={22} color={colors.secondary} />
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>
      </View>

      {/* Logout Confirmation Modal */}
      <Modal
        visible={logoutModalVisible}
        transparent
        animationType="fade"
        onRequestClose={toggleLogoutModal}
      >
        <Pressable style={styles.modalOverlay} onPress={toggleLogoutModal}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Confirm Logout</Text>
            <Text style={styles.modalMessage}>Are you sure you want to log out?</Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity style={[styles.modalBtn, styles.confirmBtn]} onPress={signOut}>
                <Text style={styles.modalBtnText}>Yes</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.modalBtn, styles.cancelBtn]} onPress={toggleLogoutModal}>
                <Text style={styles.modalBtnText}>No</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}

import { LinearGradient } from 'expo-linear-gradient';

const styles = StyleSheet.create({
  headerContainer: {
    marginTop:30,
    paddingVertical: 30,
    paddingHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomRightRadius: 50,
    borderBottomLeftRadius: 10,
    elevation: 8,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  profileImageContainer: {
    marginRight: 10,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 2,
    borderColor: colors.white,
  },
  profilePlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.white,
  },
  profileInitial: {
    fontSize: 36,
    fontWeight: '900',
    color: colors.white,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.white,
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: colors.white,
    marginBottom: 2,
  },
  userIdRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  userId: {
    fontSize: 12,
    color: colors.white,
    fontWeight: '600',
  },
  divider: {
    height: 1,
    backgroundColor: colors.primaryLight,
    marginHorizontal: 20,
    marginVertical: 15,
    opacity: 0.2,
  },
  drawerSection: {
    flex: 1,
    paddingHorizontal: 5,
    paddingTop: 10,
  },
  drawerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 18,
    marginVertical: 2,
    borderRadius: 14,
    backgroundColor: '#f8fafc',
    shadowColor: colors.primaryLight,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  menuIconWrap: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#e4e8ed',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 15,
  },
  drawerLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.primaryDark,
    letterSpacing: 0.2,
  },
  logoutSection: {
    borderTopWidth: 1,
    borderTopColor: colors.primaryLight,
    paddingVertical: 16,
    marginBottom:20,
    paddingHorizontal: 24,
    backgroundColor: colors.white,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 6,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoutText: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.primary,
    marginLeft: 10,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: '#000000AA',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
  },
  modalContent: {
    width: '100%',
    backgroundColor: colors.white,
    borderRadius: 20,
    paddingVertical: 25,
    paddingHorizontal: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 15 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 20,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: '900',
    color: colors.black,
    marginBottom: 15,
    textAlign: 'center',
  },
  modalMessage: {
    fontSize: 16,
    color: colors.black,
    textAlign: 'center',
    marginBottom: 25,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  modalBtn: {
    paddingVertical: Platform.OS === 'ios' ? 14 : 12,
    paddingHorizontal: 35,
    borderRadius: 12,
    elevation: 4,
  },
  confirmBtn: {
    backgroundColor: '#2ecc71',
  },
  cancelBtn: {
    backgroundColor: colors.primaryLight,
  },
  modalBtnText: {
    color: colors.white,
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'center',
  },
});