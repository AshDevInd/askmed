import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, ScrollView
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { Image } from 'expo-image'; // Or use 'react-native' Image if preferred
import colors from '../../constants/colors'; // You need to create/provide your colors file

export default function RegisterScreen({ navigation }) {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [securePass, setSecurePass] = useState(true);
  const [secureConfirm, setSecureConfirm] = useState(true);

  const handleSignUp = () => {
    // Add your sign up logic here
  };

  return (
    <LinearGradient colors={[colors.white, colors.primary]} style={styles.gradient}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
          <View style={styles.container}>
            {/* Top Image */}
            <View style={styles.imageWrapper}>
              <Image
            source={require('../../assets/images/register_illustration.svg')}
            style={styles.signupImage}
                contentFit="contain"
              />
            </View>

            {/* Title */}
            <Text style={styles.title}>Sign Up</Text>
            <Text style={styles.subtitle}>Create your account to get started</Text>

            {/* Full Name */}
            <View style={styles.inputWrapper}>
              <Ionicons name="person-outline" size={22} color={colors.primary} style={styles.icon} />
              <TextInput
                style={styles.input}
                placeholder="Full Name"
                placeholderTextColor={colors.mediumGray}
                value={fullName}
                onChangeText={setFullName}
                autoCapitalize="words"
                returnKeyType="next"
              />
            </View>
            {/* Email */}
            <View style={styles.inputWrapper}>
              <Ionicons name="mail-outline" size={22} color={colors.primary} style={styles.icon} />
              <TextInput
                style={styles.input}
                placeholder="Email Address"
                placeholderTextColor={colors.mediumGray}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                returnKeyType="next"
              />
            </View>
            {/* Phone Number */}
            <View style={styles.inputWrapper}>
              <Ionicons name="call-outline" size={22} color={colors.primary} style={styles.icon} />
              <TextInput
                style={styles.input}
                placeholder="Phone Number"
                placeholderTextColor={colors.mediumGray}
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad"
                maxLength={15}
                returnKeyType="next"
              />
            </View>
            {/* Password */}
            <View style={styles.inputWrapper}>
              <Ionicons name="lock-closed-outline" size={22} color={colors.primary} style={styles.icon} />
              <TextInput
                style={styles.input}
                placeholder="Password"
                placeholderTextColor={colors.mediumGray}
                value={password}
                onChangeText={setPassword}
                secureTextEntry={securePass}
                autoCapitalize="none"
                returnKeyType="next"
              />
              <TouchableOpacity onPress={() => setSecurePass(!securePass)}>
                <Ionicons name={securePass ? "eye-off-outline" : "eye-outline"} size={20} color={colors.mediumGray} />
              </TouchableOpacity>
            </View>
           

            {/* Sign Up Button */}
            <TouchableOpacity
              style={styles.button}
              onPress={handleSignUp}
              activeOpacity={0.9}
            >
              <LinearGradient colors={colors.primaryGradient} style={styles.buttonGradient}>
                <Text style={styles.buttonText}>Sign Up</Text>
              </LinearGradient>
            </TouchableOpacity>

            {/* Already Registered */}
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text style={styles.link}>Already registered? <Text style={{ color: colors.primaryDark }}>Login</Text></Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: { flex: 1 },
  scroll: { flexGrow: 1, justifyContent: 'center' },
  container: {
    backgroundColor: colors.withOpacity(colors.white, 0.85),

    margin: 14,
    borderRadius: 22,
    padding: 16,
    marginTop: 20,
    marginBottom: 20,
    alignItems: 'center',
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 14,
    elevation: 7,
  },
  imageWrapper: {
    alignItems: 'center',
    width: '100%',
    marginBottom: 20,
  },
  signupImage: {
    width: 180,
    height: 180,

    borderRadius: 18,
    backgroundColor: colors.withOpacity(colors.primaryLight, 0.04),
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.primaryDark,
    marginBottom: 2,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 15,
    color: colors.darkGray,
    marginBottom: 18,
    fontWeight: '500',
    textAlign: 'center',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.lightGray,
    borderRadius: 8,
    marginBottom: 16,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: colors.borderLight,
    minHeight: 48,
    width: '100%',
  },
  icon: { marginRight: 8 },
  input: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 15,
    color: colors.textPrimary,
  },
  button: {
    width: '100%',
    borderRadius: 8,
    marginTop: 2,
    marginBottom: 16,
    overflow: 'hidden',
    elevation: 2,
  },
  buttonGradient: {
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: colors.textOnPrimary,
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 1,
  },
  link: {
    color: colors.secondaryDark,
    fontSize: 15,
    marginTop: 8,
    textAlign: 'center',
    fontWeight: '600',
  }
});