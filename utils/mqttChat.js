import mqtt from 'mqtt';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Buffer } from 'buffer';
import process from 'process';
import EventEmitter from 'events';

// Polyfill for React Native
global.Buffer = Buffer;
global.process = process;
global.EventEmitter = EventEmitter;

// Save/retrieve messages per topic
export const saveMessages = async (topic, messages) => {
  try {
    await AsyncStorage.setItem(`chat_${topic}`, JSON.stringify(messages));
  } catch (e) { /* handle error */ }
};

export const loadMessages = async (topic) => {
  try {
    const data = await AsyncStorage.getItem(`chat_${topic}`);
    return data ? JSON.parse(data) : [];
  } catch (e) { return []; }
};

export const createMQTTClient = (userId, recipientId, onMessage, onStatus) => {
  const publishTopic = `chat/${userId}/${recipientId}`;
  const subscribeTopic = `chat/${recipientId}/${userId}`;
  const client = mqtt.connect('wss://webx.askmed.in/mqtt', {
    will: { topic: `status/${userId}`, payload: 'offline', qos: 1, retain: true },
  });

  client.on('connect', () => {
    client.subscribe(subscribeTopic);
    client.subscribe(`status/${recipientId}`);
    client.publish(`status/${userId}`, 'online', { retain: true });
  });

  client.on('message', (topic, message) => {
    if (topic === subscribeTopic) {
      try {
        const data = JSON.parse(message.toString());
        onMessage(data);
      } catch (e) {}
    } else if (topic === `status/${recipientId}`) {
      onStatus(message.toString() === 'online');
    }
  });

  return { client, publishTopic, subscribeTopic };
};