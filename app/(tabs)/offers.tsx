import { StyleSheet, View, Text, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function BillScreen() {
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity>
          <Ionicons name="chevron-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Bill</Text>
        <TouchableOpacity>
          <Ionicons name="add" size={24} color="#000" />
        </TouchableOpacity>
      </View>

      {/* Monthly Payment Section */}
      <View style={styles.paymentSection}>
        <Text style={styles.paymentLabel}>Your monthly payment</Text>
        <Text style={styles.paymentSubLabel}>for subcriptions</Text>
        <Text style={styles.totalAmount}>₱2,447</Text>
      </View>

      {/* Subscriptions List */}
      <View style={styles.subscriptionsList}>
        {/* Globe Fiber Plan */}
        <TouchableOpacity style={styles.subscriptionItem}>
          <View style={styles.subscriptionContent}>
            <Image
              source={{ uri: 'https://upload.wikimedia.org/wikipedia/en/thumb/4/45/Globe_Telecom.svg/1200px-Globe_Telecom.svg.png' }}
              style={styles.subscriptionIcon}
            />
            <View style={styles.subscriptionDetails}>
              <Text style={styles.subscriptionName}>Globe Fiber Plan</Text>
              <Text style={styles.subscriptionPrice}>₱1,499/mo</Text>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={24} color="#666" />
        </TouchableOpacity>

        {/* Netflix */}
        <TouchableOpacity style={styles.subscriptionItem}>
          <View style={styles.subscriptionContent}>
            <Image
              source={{ uri: 'https://assets.nflxext.com/us/ffe/siteui/common/icons/nficon2016.png' }}
              style={styles.subscriptionIcon}
            />
            <View style={styles.subscriptionDetails}>
              <Text style={styles.subscriptionName}>Netflix</Text>
              <Text style={styles.subscriptionPrice}>₱560/mo</Text>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={24} color="#666" />
        </TouchableOpacity>

        {/* Vivamax */}
        <TouchableOpacity style={styles.subscriptionItem}>
          <View style={styles.subscriptionContent}>
            <Image
              source={{ uri: 'https://play-lh.googleusercontent.com/GhGX8GN8pqZjhkZQywu2hvq9rHUGh7ZGYJg_4KHHtTZI0WUx5FrLkS6IlgJqus6gLg' }}
              style={styles.subscriptionIcon}
            />
            <View style={styles.subscriptionDetails}>
              <Text style={styles.subscriptionName}>Vivamax payment</Text>
              <Text style={styles.subscriptionPrice}>₱149/mo</Text>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={24} color="#666" />
        </TouchableOpacity>

        {/* Spotify */}
        <TouchableOpacity style={styles.subscriptionItem}>
          <View style={styles.subscriptionContent}>
            <Image
              source={{ uri: 'https://storage.googleapis.com/pr-newsroom-wp/1/2018/11/Spotify_Logo_RGB_Green.png' }}
              style={styles.subscriptionIcon}
            />
            <View style={styles.subscriptionDetails}>
              <Text style={styles.subscriptionName}>Spotify</Text>
              <Text style={styles.subscriptionPrice}>₱239/mo</Text>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={24} color="#666" />
        </TouchableOpacity>
      </View>
    </View>
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  paymentSection: {
    alignItems: 'center',
    marginBottom: 30,
  },
  paymentLabel: {
    fontSize: 16,
    color: '#666',
  },
  paymentSubLabel: {
    fontSize: 16,
    color: '#666',
    marginBottom: 8,
  },
  totalAmount: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#000',
  },
  subscriptionsList: {
    paddingHorizontal: 20,
  },
  subscriptionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  subscriptionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  subscriptionIcon: {
    width: 40,
    height: 40,
    borderRadius: 8,
    marginRight: 12,
  },
  subscriptionDetails: {
    flex: 1,
  },
  subscriptionName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000',
    marginBottom: 4,
  },
  subscriptionPrice: {
    fontSize: 14,
    color: '#666',
  },
});