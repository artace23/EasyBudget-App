import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { useEffect } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function SettingsScreen() {
  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const notifSetting = await AsyncStorage.getItem('notifications');
      const biometricSetting = await AsyncStorage.getItem('biometric');
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  };

const handleLogout = async () => {
  try {
    await AsyncStorage.removeItem('userToken');
    await AsyncStorage.clear(); // Clear all stored data
    router.replace('/');  // Navigate to the auth stack explicitly
  } catch (error) {
    console.error('Error during logout:', error);
  }
};  

  return (
    <ThemedView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <ThemedText style={styles.headerTitle}>Settings</ThemedText>
      </View>

      {/* Settings Groups */}
      <View style={styles.settingsContainer}>
        {/* Account Settings */}
        <View style={styles.settingsGroup}>
          <ThemedText style={styles.groupTitle}>Account</ThemedText>
          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingContent}>
              <Ionicons name="person-outline" size={22} color="#666" />
              <ThemedText style={styles.settingText}>Profile</ThemedText>
            </View>
            <Ionicons name="chevron-forward" size={22} color="#666" />
          </TouchableOpacity>
        </View>

        {/* Security Settings */}
        <View style={styles.settingsGroup}>
          <Text style={styles.groupTitle}>Security</Text>
          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingContent}>
              <Ionicons name="lock-closed-outline" size={22} color="#666" />
              <Text style={styles.settingText}>Change Password</Text>
            </View>
            <Ionicons name="chevron-forward" size={22} color="#666" />
          </TouchableOpacity>
        </View>

        {/* App Settings */}
        <View style={styles.settingsGroup}>
          <ThemedText style={styles.groupTitle}>App</ThemedText>
          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingContent}>
              <Ionicons name="language-outline" size={22} color="#666" />
              <ThemedText style={styles.settingText}>Language</ThemedText>
            </View>
            <View style={styles.settingValue}>
              <ThemedText style={styles.valueText}>English</ThemedText>
              <Ionicons name="chevron-forward" size={22} color="#666" />
            </View>
          </TouchableOpacity>
        </View>

        {/* Logout Button */}
        <TouchableOpacity 
          style={styles.logoutButton}
          onPress={handleLogout}
        >
          <Ionicons name="log-out-outline" size={22} color="#FF4B55" />
          <ThemedText style={styles.logoutText}>Logout</ThemedText>
        </TouchableOpacity>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 60,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  settingsContainer: {
    paddingHorizontal: 20,
  },
  settingsGroup: {
    marginBottom: 32,
  },
  groupTitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
    fontWeight: '500',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  settingContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  settingText: {
    fontSize: 16,
    color: '#000',
  },
  settingValue: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  valueText: {
    fontSize: 14,
    color: '#666',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: 32,
  },
  logoutText: {
    fontSize: 16,
    color: '#FF4B55',
  },
});