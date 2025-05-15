import { StyleSheet, View, Text, TouchableOpacity, TextInput } from 'react-native';
import { router } from 'expo-router';
import { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    router.replace('/(tabs)');
  };

  return (
    <View style={styles.container}>
      <View style={styles.formContainer}>
        {/* Title and Subtitle */}
        <View style={styles.titleContainer}>
          <Text style={styles.title}>EasyBudget</Text>
          <Text style={styles.subtitle}>Manage your finances with ease</Text>
        </View>

        {/* Input Fields */}
        <View style={styles.inputContainer}>
          <View style={styles.inputWrapper}>
            <Ionicons name="mail-outline" size={20} color="#666" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Email"
              placeholderTextColor="#666"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
            />
          </View>
          
          <View style={styles.inputWrapper}>
            <Ionicons name="lock-closed-outline" size={20} color="#666" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Password"
              placeholderTextColor="#666"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
          </View>
        </View>

        {/* Login Button */}
        <TouchableOpacity 
          style={styles.button}
          onPress={handleLogin}
        >
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>

        {/* Forgot Password */}
        <TouchableOpacity style={styles.forgotPasswordContainer}>
          <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  formContainer: {
    width: '100%',
    maxWidth: 400,
    alignSelf: 'center',
  },
  titleContainer: {
    alignItems: 'center',
    marginBottom: 48,
  },
  title: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#6B4EFF',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 18,
    color: '#666',
    letterSpacing: 0.5,
  },
  inputContainer: {
    gap: 20,
    marginBottom: 32,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 56,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  button: {
    height: 56,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#6B4EFF',
    shadowColor: '#6B4EFF',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#ffffff',
    letterSpacing: 0.5,
  },
  forgotPasswordContainer: {
    alignItems: 'center',
    marginTop: 24,
  },
  forgotPasswordText: {
    color: '#6B4EFF',
    fontSize: 16,
    fontWeight: '500',
  },
});