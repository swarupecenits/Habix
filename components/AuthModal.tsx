import { BlurView } from 'expo-blur';
import React, { useState } from 'react';
import { ActivityIndicator, Alert, Modal, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { supabase } from '../utils/supabase';

type AuthModalProps = {
  visible: boolean;
  onClose: () => void;
};

export default function AuthModal({ visible, onClose }: AuthModalProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [isLogin, setIsLogin] = useState(true);

  async function signInWithEmail() {
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) Alert.alert('Error', error.message);
    else onClose();
    setLoading(false);
  }

  async function signUpWithEmail() {
    setLoading(true);
    const {
      data: { session },
      error,
    } = await supabase.auth.signUp({
      email,
      password,
    });
    if (error) Alert.alert('Error', error.message);
    else if (!session) Alert.alert('Success', 'Please check your inbox for email verification!');
    else onClose();
    setLoading(false);
  }

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <BlurView intensity={40} tint="dark" className="flex-1 justify-center px-6">
        <View className="bg-zinc-900/90 border border-zinc-800 rounded-[32px] p-6 shadow-2xl">
          <View className="items-center mb-6">
            <View className="w-16 h-16 bg-emerald-900/30 rounded-full items-center justify-center mb-3">
              <Text className="text-3xl">☁️</Text>
            </View>
            <Text className="text-2xl font-bold text-white tracking-tight">
              {isLogin ? 'Welcome Back' : 'Join Habix'}
            </Text>
            <Text className="text-zinc-400 text-sm mt-1 text-center">
              {isLogin ? 'Log in to backup your garden to the cloud.' : 'Create an account to keep your habits safe.'}
            </Text>
          </View>

          <View className="mb-4">
            <TextInput
              className="bg-black/50 border border-zinc-800 rounded-[20px] px-5 py-4 text-white text-base font-medium mb-3"
              onChangeText={(text) => setEmail(text)}
              value={email}
              placeholder="email@address.com"
              placeholderTextColor="#52525b"
              autoCapitalize="none"
              keyboardType="email-address"
            />
            <TextInput
              className="bg-black/50 border border-zinc-800 rounded-[20px] px-5 py-4 text-white text-base font-medium mb-1"
              onChangeText={(text) => setPassword(text)}
              value={password}
              secureTextEntry
              placeholder="Password"
              placeholderTextColor="#52525b"
              autoCapitalize="none"
            />
          </View>

          <View className="mt-2 space-y-3">
            <TouchableOpacity 
              className="bg-emerald-600 rounded-[20px] py-4 items-center mb-3 disabled:opacity-50"
              disabled={loading}
              onPress={isLogin ? signInWithEmail : signUpWithEmail}
            >
              {loading ? <ActivityIndicator color="white" /> : (
                <Text className="text-white font-bold text-lg">{isLogin ? 'Sign in' : 'Create Account'}</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity 
              className="py-3 items-center" 
              onPress={() => setIsLogin(!isLogin)}
            >
              <Text className="text-zinc-400 font-semibold">
                {isLogin ? "Don't have an account? " : "Already have an account? "}
                <Text className="text-emerald-400">{isLogin ? 'Sign up' : 'Log in'}</Text>
              </Text>
            </TouchableOpacity>
          </View>
          
          <TouchableOpacity className="absolute top-6 right-6 p-2 bg-zinc-800/80 rounded-full" onPress={onClose}>
            <Text className="text-white text-xs font-bold px-1">✕</Text>
          </TouchableOpacity>
        </View>
      </BlurView>
    </Modal>
  );
}