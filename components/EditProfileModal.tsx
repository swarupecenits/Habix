import { BlurView } from 'expo-blur';
import * as ImagePicker from 'expo-image-picker';
import React, { useState } from 'react';
import { ActivityIndicator, Alert, Image, Modal, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useAuthStore } from '../store/useAuthStore';
import { useProfileStore } from '../store/useProfileStore';
import { saveProfileToCloud, uploadAvatarToCloud } from '../utils/syncService';

type EditProfileModalProps = {
  visible: boolean;
  onClose: () => void;
};

export default function EditProfileModal({ visible, onClose }: EditProfileModalProps) {
  const { user } = useAuthStore();
  const { name, avatarUri, updateProfile } = useProfileStore();
  const [tempName, setTempName] = useState(name);
  const [tempAvatar, setTempAvatar] = useState(avatarUri);
  const [saving, setSaving] = useState(false);

  // Sync state when modal opens
  React.useEffect(() => {
    if (visible) {
      setTempName(name);
      setTempAvatar(avatarUri);
    }
  }, [visible, name, avatarUri]);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setTempAvatar(result.assets[0].uri);
    }
  };

  const handleSave = async () => {
    if (!tempName.trim()) {
      Alert.alert('Empty Name', 'Please enter a valid name.');
      return;
    }

    setSaving(true);
    let cloudAvatarUri = tempAvatar;

    try {
      if (user) {
        // 1. If user picked a new local image (starts with file://), upload it first
        if (tempAvatar && tempAvatar.startsWith('file://')) {
          cloudAvatarUri = await uploadAvatarToCloud(user.id, tempAvatar);
        }
        
        // 2. Save the metadata to the Postgres DB
        await saveProfileToCloud(user.id, tempName.trim(), cloudAvatarUri);
      }

      // 3. Update the local persistent store so it updates instantly in UI
      updateProfile({ name: tempName.trim(), avatarUri: cloudAvatarUri });
      onClose();
    } catch (e: any) {
      Alert.alert('Failed to save', e.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal visible={visible} animationType="fade" transparent>
      <BlurView intensity={40} tint="dark" className="flex-1 justify-center px-6">
        <View className="bg-zinc-900/90 border border-zinc-800 rounded-[32px] p-6 shadow-2xl">
          <View className="items-center mb-6">
            <TouchableOpacity onPress={pickImage} disabled={saving} className="relative mb-3">
              {tempAvatar ? (
                <Image source={{ uri: tempAvatar }} className="w-24 h-24 rounded-full border-4 border-emerald-900/30" />
              ) : (
                <View className="w-24 h-24 bg-emerald-900/30 rounded-full items-center justify-center border-4 border-[#09090b]">
                  <Text className="text-4xl">🧑‍🌾</Text>
                </View>
              )}
              <View className="absolute bottom-0 right-0 bg-emerald-500 w-8 h-8 rounded-full items-center justify-center border-2 border-zinc-900">
                <Text className="text-white text-xs">📷</Text>
              </View>
            </TouchableOpacity>
            <Text className="text-2xl font-bold text-white tracking-tight">Edit Profile</Text>
            <Text className="text-zinc-400 text-sm mt-1 text-center">Update your name and photo.</Text>
          </View>

          <View className="mb-4">
            <Text className="text-zinc-500 font-bold text-xs uppercase tracking-widest mb-2 pl-1">Your Name</Text>
            <TextInput
              className="bg-black/50 border border-zinc-800 rounded-[20px] px-5 py-4 text-white text-base font-medium mb-1"
              onChangeText={(text) => setTempName(text)}
              value={tempName}
              placeholder="e.g. Swarup"
              placeholderTextColor="#52525b"
              editable={!saving}
            />
          </View>

          <View className="mt-2 space-y-3">
            <TouchableOpacity 
              className={`bg-emerald-600 rounded-[20px] py-4 items-center mb-3 ${saving ? 'opacity-70' : ''}`}
              onPress={handleSave}
              disabled={saving}
            >
              {saving ? <ActivityIndicator color="white" /> : <Text className="text-white font-bold text-lg">Save Changes</Text>}
            </TouchableOpacity>

            <TouchableOpacity 
              className={`py-3 items-center ${saving ? 'opacity-50' : ''}`} 
              onPress={onClose}
              disabled={saving}
            >
              <Text className="text-zinc-400 font-semibold">Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </BlurView>
    </Modal>
  );
}