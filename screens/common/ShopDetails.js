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
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import mqtt from 'mqtt';
import { Buffer } from 'buffer';
import process from 'process';
import EventEmitter from 'events';
import colors from '../../constants/colors';
import CustomHeader from '../../components/CustomHeader';
import OrderCard from '../../components/OrderCard';
global.Buffer = Buffer;
global.process = process;
global.EventEmitter = EventEmitter;
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


// Set dynamically as per your own auth/user system!
const userId = 'user456';
const recipientId = 'user123';

const publishTopic = `chat/${userId}/${recipientId}`;
const subscribeTopic = `chat/${recipientId}/${userId}`;
const statusTopic = `status/${recipientId}`;
const myStatusTopic = `status/${userId}`;
const localChatKey = `chat_${userId}_${recipientId}`;

export default function ShopDetails({ navigation }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [sendingOrder, setSendingOrder] = useState(false);
  const [imageModal, setImageModal] = useState({ visible: false, uri: null });
  const flatListRef = useRef(null);
  const inputRef = useRef(null);
  const insets = useSafeAreaInsets();
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
  const [selectedMessageId, setSelectedMessageId] = useState(null);
  const [userBubbleColor, setUserBubbleColor] = useState('#B5FF96');
  const [client, setClient] = useState(null);
  const [connected, setConnected] = useState(false);
  const [isRecipientOnline, setIsRecipientOnline] = useState(false);
  const [otherTyping, setOtherTyping] = useState(false);
  const typingTimeout = useRef(null);
  const [loading, setLoading] = useState(true);
  const [activeOrder, setActiveOrder] = useState({
    orderId: 'ORD12345',
    items: [
      { name: 'Milk', qty: 2 },
      { name: 'Bread', qty: 1 },
    ]
  });
  // Keyboard events
  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      (e) => {
        setKeyboardHeight(e.endCoordinates.height);
        setIsKeyboardVisible(true);
        scrollToEnd();
      }
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        setKeyboardHeight(0);
        setIsKeyboardVisible(false);
      }
    );
    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  // Load messages from local storage
  useEffect(() => {
    (async () => {
      const local = await AsyncStorage.getItem(localChatKey);
      if (local) setMessages(JSON.parse(local));
      setLoading(false);
    })();
  }, []);

  // MQTT connect & events
  useEffect(() => {
    const mqttClient = mqtt.connect('wss://webx.askmed.in/mqtt', {
      will: { topic: myStatusTopic, payload: 'offline', qos: 1, retain: true },
    });

    mqttClient.on('connect', () => {
      setConnected(true);
      mqttClient.subscribe(subscribeTopic);
      mqttClient.subscribe(statusTopic);
      mqttClient.publish(myStatusTopic, 'online', { retain: true });
    });

    mqttClient.on('message', (topic, message) => {
      const msg = message.toString();
      if (topic === subscribeTopic) {
        try {
          const data = JSON.parse(msg);
          if (data.type === 'typing') {
            setOtherTyping(true);
            if (typingTimeout.current) clearTimeout(typingTimeout.current);
            typingTimeout.current = setTimeout(() => setOtherTyping(false), 2000);
          } else {
            const chatMsg = {
              id: Date.now().toString() + Math.random(),
              ...data,
              user: {
                id: '2',
                name: shopDetailsNm.owner.name,
                avatar: shopDetailsNm.owner.avatar,
              },
              createdAt: new Date(),
              status: 'read',
            };
            setMessages(prev => {
              const updated = [...prev, chatMsg];
              AsyncStorage.setItem(localChatKey, JSON.stringify(updated));
              return updated;
            });
          }
        } catch (e) { }
      } else if (topic === statusTopic) {
        setIsRecipientOnline(msg === 'online');
        if (msg === 'offline') setOtherTyping(false);
      }
    });

    mqttClient.on('close', () => {
      setConnected(false);
      setIsRecipientOnline(false);
    });

    setClient(mqttClient);

    return () => {
      mqttClient.end();
    };
  }, []);

  // Save messages to local storage on change
  useEffect(() => {
    AsyncStorage.setItem(localChatKey, JSON.stringify(messages));
    scrollToEnd();
  }, [messages]);

  const scrollToEnd = () => {
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  const sendMessage = (msgObj) => {
    const myMsg = {
      id: Date.now().toString(),
      ...msgObj,
      user: { id: '1', name: 'You' },
      createdAt: new Date(),
      status: isRecipientOnline ? 'read' : 'sent',
    };
    setMessages(prev => {
      const updated = [...prev, myMsg];
      AsyncStorage.setItem(localChatKey, JSON.stringify(updated));
      return updated;
    });
    // MQTT
    if (client && connected) {
      client.publish(publishTopic, JSON.stringify(msgObj));
    }
  };

  const handleSend = () => {
    if (input.trim().length === 0) return;
    sendMessage({ type: 'text', text: input.trim() });
    setInput('');
  };

  const handleCreateOrder = () => {
    setSendingOrder(true);
    setTimeout(() => {
      setSendingOrder(false);
      Alert.alert('Order Placed!', 'Your order has been created successfully.', [{ text: 'OK' }]);
      sendMessage({
        type: 'text',
        text: '🛒 A new order has been placed by you!',
      });
      sendMessage({
        type: 'text',
        text: 'Thank you for your order! 🙏 We will process it shortly.',
      });
      scrollToEnd();
    }, 1200);
  };

  const handleImage = (uri) => {
    sendMessage({ type: 'image', image: uri });
  };

  const onPickImage = async () => {
    Keyboard.dismiss();
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.7,
    });
    if (!result.canceled && result.assets && result.assets.length > 0) {
      handleImage(result.assets[0].uri);
    }
  };

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
    if (!result.canceled && result.assets && result.assets.length > 0) {
      handleImage(result.assets[0].uri);
    }
  };

  const renderMessage = ({ item }) => {
    const isMe = item.user.id === '1';
    const isSelected = selectedMessageId === item.id;
    return (
      <View style={[styles.bubbleRow, isMe ? styles.bubbleRowMe : styles.bubbleRowOther]}>
        <TouchableOpacity
          activeOpacity={0.8}
          onLongPress={() => isMe && setSelectedMessageId(item.id)}
          onPressOut={() => !isMe && setSelectedMessageId(null)}
          style={[
            styles.bubble,
            isMe
              ? [styles.bubbleMe, { backgroundColor: userBubbleColor }]
              : styles.bubbleOther,
            isSelected && { borderColor: 'red', borderWidth: 2 },
          ]}
        >
          {item.type === 'text' ? (
            <Text
              style={[
                styles.bubbleText,
                isMe ? styles.bubbleTextMe : styles.bubbleTextOther,
              ]}
            >
              {item.text}
            </Text>
          ) : item.type === 'image' && item.image ? (
            <TouchableWithoutFeedback
              onPress={() =>
                setImageModal({ visible: true, uri: item.image })
              }
            >
              <RNImage
                source={{ uri: item.image }}
                style={styles.bubbleImage}
              />
            </TouchableWithoutFeedback>
          ) : null}
          <View style={styles.bubbleTimeRow}>
            <Text style={[styles.bubbleTime, isMe && styles.bubbleTimeMe]}>
              {item.createdAt
                ? new Date(item.createdAt).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                })
                : ''}
            </Text>
            {isMe && (
              <View style={styles.tickWrapper}>
                <Icon
                  name="done-all"
                  size={16}
                  color={
                    item.status === 'read'
                      ? colors.darkGray
                      : colors.mediumGray
                  }
                />
              </View>
            )}
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  // Typing indicator
  const TypingIndicator = () => (
    <View style={{ flexDirection: 'row', alignItems: 'center', marginLeft: 12, marginBottom: 8 }}>
      <View style={{
        backgroundColor: '#eee', borderRadius: 16, paddingHorizontal: 14, paddingVertical: 6, marginBottom: 2,
      }}>
        <Text style={{ color: '#999' }}>typing...</Text>
      </View>
    </View>
  );

  // Typing event send
  const handleInputChange = (text) => {
    setInput(text);
    if (client && connected) {
      client.publish(publishTopic, JSON.stringify({ type: 'typing' }));
    }
  };

  return (
    <KeyboardAvoidingView style={styles.container} edges={['top']}>
      <CustomHeader
        navigation={navigation}
        title={shopDetailsNm.name}
        isHome={false}
      />
      {/* Shop Info Bar */}
      <View style={styles.shopInfoBar}>
        <RNImage source={shopDetailsNm.image} style={styles.shopImage} />
        <View style={{ flex: 1, marginLeft: 10 }}>
          <Text style={styles.shopName}>{shopDetailsNm.name}</Text>
          <Text style={styles.shopAddress}>{shopDetailsNm.address}</Text>
          <View style={styles.shopMeta}>
            <Icon name="star" color="#f8b400" size={15} />
            <Text style={styles.shopRating}>{shopDetailsNm.rating}</Text>
            <Icon name="location-on" color={colors.primary} size={15} style={{ marginLeft: 10 }} />
            <Text style={styles.shopDistance}>{shopDetailsNm.distance} km</Text>
            {shopDetailsNm.open ? (
              <Text style={styles.shopOpen}>Open</Text>
            ) : (
              <Text style={styles.shopClosed}>Closed</Text>
            )}
          </View>
        </View>
        <TouchableOpacity style={styles.orderBtn} onPress={handleCreateOrder}>
          <LinearGradient colors={colors.primaryGradient} style={styles.orderBtnGradient}>
            {sendingOrder ? (
              <Icon name="hourglass-top" size={19} color="#fff" />
            ) : (
              <Icon name="add-shopping-cart" size={19} color="#fff" />
            )}
            <Text style={styles.orderBtnText}>{sendingOrder ? 'Placing...' : 'Order'}</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
      <KeyboardAvoidingView
        style={styles.flex1}
        behavior={Platform.OS === 'ios' ? 'padding' : null}
        keyboardVerticalOffset={Platform.OS === 'ios' ? insets.top + 44 : 0}
      >
        {/* Chat messages area */}
        <View style={styles.messagesContainer}>
          {loading ? (
            <ActivityIndicator size="large" style={{ marginTop: 20 }} />
          ) : (
            <>
              <FlatList
                ref={flatListRef}
                data={messages}
                renderItem={renderMessage}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.messageListContent}
                showsVerticalScrollIndicator={false}
                keyboardDismissMode="interactive"
                onContentSizeChange={scrollToEnd}
                onLayout={scrollToEnd}
                ListFooterComponent={otherTyping ? <TypingIndicator /> : null}
              />
              {/* Order Card below chat list */}
              {activeOrder && (
                <OrderCard
                  order={activeOrder}
                  onPress={() => navigation.navigate('OrderDetails', { order: activeOrder })}
                />
              )}
            </>
          )}
          {selectedMessageId && (
            <View style={{ padding: 10, backgroundColor: '#ffeeee', alignItems: 'center' }}>
              <TouchableOpacity
                onPress={() => {
                  Alert.alert(
                    'Delete Message',
                    'Are you sure you want to delete this message?',
                    [
                      { text: 'Cancel', onPress: () => setSelectedMessageId(null), style: 'cancel' },
                      {
                        text: 'Delete',
                        onPress: () => {
                          setMessages((prev) => {
                            const updated = prev.filter((m) => m.id !== selectedMessageId);
                            AsyncStorage.setItem(localChatKey, JSON.stringify(updated));
                            return updated;
                          });
                          setSelectedMessageId(null);
                        },
                        style: 'destructive',
                      },
                    ]
                  );
                }}
              >
                <Text style={{ color: 'red', fontWeight: 'bold' }}>🗑️ Delete Selected Message</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Input area */}
        <View
          style={[
            styles.inputContainer,
            { paddingBottom: insets.bottom + (isKeyboardVisible ? 50 : 10) }
          ]}
        >
          <View style={styles.inputRow}>
            <TouchableOpacity onPress={onPickCamera} style={styles.attachmentButton}>
              <Icon name="photo-camera" size={24} color={colors.primary} />
            </TouchableOpacity>

            <TouchableOpacity onPress={onPickImage} style={styles.attachmentButton}>
              <Icon name="image" size={24} color={colors.primary} />
            </TouchableOpacity>

            <TextInput
              ref={inputRef}
              style={styles.input}
              placeholder="Type a message..."
              placeholderTextColor={colors.mediumGray}
              value={input}
              onChangeText={handleInputChange}
              multiline
              blurOnSubmit={false}
              returnKeyType="send"
              onSubmitEditing={handleSend}
              onFocus={() => setIsKeyboardVisible(true)}
            />

            <TouchableOpacity
              onPress={handleSend}
              style={styles.sendButton}
              disabled={input.trim().length === 0}
            >
              <LinearGradient
                colors={input.trim().length > 0 ? colors.primaryGradient : [colors.lightGray, colors.lightGray]}
                style={styles.sendButtonGradient}
              >
                <Icon
                  name="send"
                  size={20}
                  color={input.trim().length > 0 ? colors.textOnPrimary : colors.mediumGray}
                />
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>

        {/* Spacer for keyboard */}
        {isKeyboardVisible && Platform.OS === 'android' && (
          <View style={{ height: keyboardHeight - insets.bottom }} />
        )}
      </KeyboardAvoidingView>

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
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F1E7DF',
  },
  flex1: {
    flex: 1,
  },
  shopInfoBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    elevation: 4,
    borderBottomColor: '#f3f3f3',
    borderBottomWidth: 1,
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  shopImage: {
    width: 60,
    height: 60,
    borderRadius: 10,
    backgroundColor: '#eee',
  },
  shopName: {
    fontWeight: 'bold',
    fontSize: 18,
    color: colors.primaryDark,
  },
  shopAddress: {
    color: colors.textSecondary,
    fontSize: 13,
    marginBottom: 2,
  },
  shopMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    marginTop: 2,
  },
  shopRating: {
    fontWeight: 'bold',
    color: '#f8b400',
    marginLeft: 3,
    fontSize: 13,
  },
  shopDistance: {
    color: colors.primary,
    marginLeft: 3,
    fontSize: 13,
    fontWeight: '500',
  },
  shopOpen: {
    marginLeft: 12,
    color: '#15c177',
    fontWeight: 'bold',
    fontSize: 13,
  },
  shopClosed: {
    marginLeft: 12,
    color: '#e74c3c',
    fontWeight: 'bold',
    fontSize: 13,
  },
  orderBtn: {
    marginLeft: 10,
    borderRadius: 10,
    overflow: 'hidden',
  },
  orderBtnGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 10,
    gap: 5,
  },
  orderBtnText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 15,
    marginLeft: 6,
  },
  messagesContainer: {
    flex: 1,
    paddingHorizontal: 12,
  },
  messageListContent: {
    paddingTop: 10,
    paddingBottom: 10,
  },
  bubbleRow: {
    marginVertical: 6,
    maxWidth: '80%',
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  bubbleRowMe: {
    alignSelf: 'flex-end',
    marginRight: 8,
  },
  bubbleRowOther: {
    alignSelf: 'flex-start',
    marginLeft: 8,
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 8,
  },
  bubble: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 18,
  },
  bubbleMe: {
    backgroundColor: colors.primary,
    borderBottomRightRadius: 4,
  },
  bubbleOther: {
    backgroundColor: '#ffffff',
    borderBottomLeftRadius: 4,
  },
  bubbleText: {
    fontSize: 16,
    lineHeight: 22,
  },
  bubbleTextMe: {
    color: colors.black,
  },
  bubbleTextOther: {
    color: colors.darkGray,
  },
  bubbleImage: {
    width: 200,
    height: 150,
    borderRadius: 12,
    marginBottom: 4,
  },
  bubbleTimeRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginTop: 4,
  },
  bubbleTime: {
    fontSize: 12,
    color: colors.mediumGray,
  },
  bubbleTimeMe: {
    color: '#888',
  },
  tickWrapper: {
    flexDirection: 'row',
    marginLeft: 4,
  },
  inputContainer: {
    paddingHorizontal: 12,
    paddingTop: 8,
    backgroundColor: '#F1E7DF',
    borderTopWidth: 1,
    elevation: 5,
    borderTopColor: colors.lightGray,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 24,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  attachmentButton: {
    padding: 6,
  },
  input: {
    flex: 1,
    fontSize: 16,
    maxHeight: 120,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  sendButton: {
    marginLeft: 6,
    borderRadius: 20,
    overflow: 'hidden',
  },
  sendButtonGradient: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullscreenImage: {
    width: '100%',
    height: '80%',
  },
});

