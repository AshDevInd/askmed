import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Image as RNImage,
  Alert,
  Modal,
  TouchableWithoutFeedback,
  Keyboard,
  ScrollView

} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

import colors from '../../constants/colors';
import CustomHeader from '../../components/CustomHeader';

// Dummy shop info
const shopDetailsNm = {
  name: 'Elite Grocery',
  address: '23 Main St, Downtown',
  rating: 4.7,
  distance: 1.2,
  open: true,
  image: require('../../assets/images/shop1.png'),
  owner: {
    name: 'Mr. John Doe',
    avatar: require('../../assets/images/profile_placeholder.png'),
    online: true,
  },
};

export default function ShopDetails({ navigation }) {
  const [messages, setMessages] = useState([
    {
      id: '1',
      text: 'Hello! 👋\nHow can I help you today?',
      createdAt: new Date(),
      user: {
        id: '2',
        name: shopDetailsNm.owner.name,
        avatar: shopDetailsNm.owner.avatar,
      },
      type: 'text',
      status: 'read',
    },
  ]);
  const [input, setInput] = useState('');
  const [sendingOrder, setSendingOrder] = useState(false);
  const [imageModal, setImageModal] = useState({ visible: false, uri: null });
  const [inputHeight, setInputHeight] = useState(44);
  const flatListRef = useRef(null);
  const insets = useSafeAreaInsets();
  const [inputFocused, setInputFocused] = useState(false);

  // Scroll to bottom when keyboard appears or new message arrives
  useEffect(() => {
    const keyboardShowListener = Keyboard.addListener('keyboardDidShow', scrollToEnd);
    return () => keyboardShowListener.remove();
  }, []);

  useEffect(() => {
    scrollToEnd();
  }, [messages]);

  const scrollToEnd = () => {
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  // Send a message to chat list
  const sendMessage = (msgObj) => {
    setMessages((prev) => [
      ...prev,
      {
        ...msgObj,
        status: shopDetailsNm.owner.online ? 'read' : 'sent',
      },
    ]);
  };

  const handleSend = () => {
    if (input.trim().length === 0) return;
    sendMessage({
      id: Date.now().toString(),
      text: input.trim(),
      createdAt: new Date(),
      user: { id: '1', name: 'You' },
      type: 'text',
    });
    setInput('');
    Keyboard.dismiss();
  };

  // Handle picked image
  const handleImage = (uri) => {
    sendMessage({
      id: Date.now().toString(),
      image: uri,
      createdAt: new Date(),
      user: { id: '1', name: 'You' },
      type: 'image',
    });
  };

  // Open image library picker
  const onPickImage = async () => {
    Keyboard.dismiss();
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.7,
    });
    if (!result.canceled && result.assets.length > 0) {
      handleImage(result.assets[0].uri);
    }
  };

  // Open camera picker
  const onPickCamera = async () => {
    Keyboard.dismiss();
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission required', 'Camera permission is required to take photos.');
      return;
    }
    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.7,
    });
    if (!result.canceled && result.assets.length > 0) {
      handleImage(result.assets[0].uri);
    }
  };

  // Simulate order creation with messages and alert
  const handleCreateOrder = () => {
    setSendingOrder(true);
    setTimeout(() => {
      setSendingOrder(false);
      Alert.alert('Order Placed!', 'Your order has been created successfully.', [{ text: 'OK' }]);
      sendMessage({
        id: Date.now().toString(),
        text: '🛒 A new order has been placed by you!',
        createdAt: new Date(),
        user: { id: '1', name: 'You' },
        type: 'text',
      });
      sendMessage({
        id: (Date.now() + 1).toString(),
        text: 'Thank you for your order! 🙏 We will process it shortly.',
        createdAt: new Date(),
        user: { id: '2', name: shopDetailsNm.owner.name, avatar: shopDetailsNm.owner.avatar },
        type: 'text',
        status: 'read',
      });
    }, 1200);
  };

  // Render each chat bubble (text or image)
  const renderMessage = ({ item }) => {
    const isMe = item.user.id === '1';
    return (
      <View style={[styles.bubbleRow, isMe ? styles.bubbleRowMe : styles.bubbleRowOther]}>
        <View style={[styles.bubble, isMe ? styles.bubbleMe : styles.bubbleOther]}>
          {item.type === 'text' ? (
            <Text style={[styles.bubbleText, isMe ? styles.bubbleTextMe : styles.bubbleTextOther]}>
              {item.text}
            </Text>
          ) : (
            <TouchableWithoutFeedback onPress={() => setImageModal({ visible: true, uri: item.image })}>
              <RNImage source={{ uri: item.image }} style={styles.bubbleImage} />
            </TouchableWithoutFeedback>
          )}
          <View style={styles.bubbleTimeRow}>
            <Text style={styles.bubbleTime}>
              {item.createdAt instanceof Date
                ? item.createdAt.toLocaleTimeString().slice(0, 5)
                : new Date(item.createdAt).toLocaleTimeString().slice(0, 5)}
            </Text>
            {isMe && (
              <View style={styles.tickWrapper}>
                <Icon
                  name="done"
                  size={16}
                  color={item.status === 'read' ? '#0dcaf0' : colors.mediumGray}
                  style={{ marginLeft: 2, marginRight: item.status === 'read' ? -6 : 0 }}
                />
                {item.status === 'read' && (
                  <Icon
                    name="done"
                    size={16}
                    color="#0dcaf0"
                    style={{ marginLeft: -8, marginRight: 0 }}
                  />
                )}
              </View>
            )}
          </View>
        </View>
      </View>
    );
  };

  // Header with shop info and order button
  function ShopHeader() {
    return (
      <LinearGradient colors={colors.primaryGradient} style={styles.shopHeaderGradient}>
        <CustomHeader
          navigation={navigation}
          title="Shop Details"
          isHome={false}
          style={{ backgroundColor: 'transparent' }}
        />
        <View style={styles.shopTopRow}>
          <RNImage source={shopDetailsNm.image} style={styles.shopImage} resizeMode="cover" />
          <View style={styles.shopInfoBox}>
            <Text style={styles.shopName}>{shopDetailsNm.name}</Text>
            <Text style={styles.shopAddress}>{shopDetailsNm.address}</Text>
            <View style={styles.metaRow}>
              <View style={styles.metaItem}>
                <Icon name="star" size={17} color="#FFD700" />
                <Text style={styles.metaText}>{shopDetailsNm.rating}</Text>
              </View>
              <View style={styles.metaItem}>
                <Icon name="place" size={16} color={colors.textOnPrimary} />
                <Text style={styles.metaText}>{shopDetailsNm.distance} km</Text>
              </View>
              <View style={styles.metaItem}>
                <Icon
                  name={shopDetailsNm.open ? 'schedule' : 'lock'}
                  size={17}
                  color={shopDetailsNm.open ? '#B8FFB5' : '#FF8A80'}
                />
                <Text style={styles.metaText}>{shopDetailsNm.open ? 'Open' : 'Closed'}</Text>
              </View>
            </View>
          </View>
        </View>
        <TouchableOpacity
          style={styles.orderBtn}
          onPress={handleCreateOrder}
          disabled={sendingOrder}
          activeOpacity={0.85}
        >
          <LinearGradient colors={colors.primaryGradient} style={styles.orderBtnGradient}>
            <Icon name="add-shopping-cart" size={20} color={colors.textOnPrimary} />
            <Text style={styles.orderBtnText}>
              {sendingOrder ? 'Creating Order...' : 'Create Order'}
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      </LinearGradient>
    );
  }

  return (
    <View style={styles.container}>
      <ShopHeader />

      {/* Fullscreen Image Modal */}
      <Modal
        visible={imageModal.visible}
        transparent
        animationType="fade"
        onRequestClose={() => setImageModal({ visible: false, uri: null })}
      >
        <TouchableWithoutFeedback onPress={() => setImageModal({ visible: false, uri: null })}>
          <View style={styles.modalBackdrop}>
            <RNImage source={{ uri: imageModal.uri }} style={styles.fullscreenImage} resizeMode="contain" />
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
        keyboardVerticalOffset={0}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView
            contentContainerStyle={{flexGrow: 1}}
            keyboardShouldPersistTaps="handled">
            <View style={styles.flex1}>
              <FlatList
                ref={flatListRef}
                data={messages}
                renderItem={renderMessage}
                keyExtractor={(item) => item.id}
                contentContainerStyle={[
                  styles.messageListContent,
                ]}
                keyboardShouldPersistTaps="handled"
                onContentSizeChange={scrollToEnd}
              />

              {/* Input Row */}
              <View style={styles.inputRow}>

                <View style={styles.inputContainer}>
                  <TextInput
                    style={styles.inputAndroid}
                    placeholder="Type a message"
                    placeholderTextColor={colors.mediumGray}
                    value={input}
                    onChangeText={setInput}
                    blurOnSubmit={false}
                    returnKeyType="send"
                    onSubmitEditing={handleSend}
                    onFocus={() => setInputFocused(true)}
                    onBlur={() => setInputFocused(false)}
                  />
                  <TouchableOpacity onPress={onPickCamera} style={styles.inputIconInside}>
                    <Icon name="photo-camera" size={22} color={colors.primary} />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={onPickImage} style={styles.inputIconInside}>
                    <Icon name="image" size={22} color={colors.primary} />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={handleSend} style={styles.sendBtnInside}>
                    <LinearGradient colors={colors.primaryGradient} style={styles.sendBtnGradientInside}>
                      <Icon name="send" size={19} color={colors.textOnPrimary} />
                    </LinearGradient>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>

    </View>
  );
}

const styles = StyleSheet.create({
  flex1: { flex: 1 },
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  shopHeaderGradient: {
    paddingBottom: 15,
    paddingTop: Platform.OS === 'ios' ? 50 : 0,
  },
  shopTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    marginBottom: 15,
  },
  shopImage: {
    width: 100,
    height: 100,
    borderRadius: 10,
  },
  shopInfoBox: {
    marginLeft: 15,
    flex: 1,
  },
  shopName: {
    fontWeight: 'bold',
    fontSize: 20,
    color: colors.textOnPrimary,
    marginBottom: 5,
  },
  shopAddress: {
    color: colors.textOnPrimary,
    marginBottom: 8,
    fontSize: 14,
  },
  metaRow: {
    flexDirection: 'row',
    gap: 10,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  metaText: {
    color: colors.textOnPrimary,
    fontSize: 13,
  },
  orderBtn: {
    marginHorizontal: 15,
  },
  orderBtnGradient: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 10,
    borderRadius: 25,
    gap: 8,
  },
  orderBtnText: {
    fontWeight: '600',
    color: colors.textOnPrimary,
    fontSize: 16,
  },
  messageListContent: {
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  bubbleRow: {
    marginVertical: 4,
    maxWidth: '80%',
  },
  bubbleRowMe: {
    alignSelf: 'flex-end',
  },
  bubbleRowOther: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    gap: 8,
  },
  bubble: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    justifyContent: 'center',
  },
  bubbleMe: {
    backgroundColor: colors.primary,
  },
  bubbleOther: {
    backgroundColor: '#e5e5ea',
  },
  bubbleText: {
    fontSize: 15,
  },
  bubbleTextMe: {
    color: colors.textOnPrimary,
  },
  bubbleTextOther: {
    color: colors.textPrimary,
  },
  bubbleImage: {
    width: 200,
    height: 140,
    borderRadius: 10,
  },
  bubbleTimeRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginTop: 4,
  },
  bubbleTime: {
    fontSize: 11,
    color: colors.mediumGray,
  },
  tickWrapper: {
    flexDirection: 'row',
    marginLeft: 4,
  },


  inputRow: {
    flexDirection: 'row',
    alignItems: 'center', // vertically center content
    paddingHorizontal: 10,
    paddingBottom: 30,
    backgroundColor: colors.white,
  },
  inputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center', // center icon and input vertically
    backgroundColor: '#f0f0f0',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ccc',
    paddingHorizontal: 12,
    paddingVertical: 6, // less vertical padding for fixed height
    marginVertical: 8,
  },
  inputAndroid: {
    flex: 1,
    fontSize: 16,
    height: 44,
    textAlignVertical: 'center',
    paddingVertical: Platform.OS === 'android' ? 6 : 10,
  },

  inputIconInside: {
    paddingHorizontal: 8,
  },
  sendBtnInside: {
    marginLeft: 6,
    borderRadius: 20,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendBtnGradientInside: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },

  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.85)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullscreenImage: {
    width: '95%',
    height: '70%',
  },
});
