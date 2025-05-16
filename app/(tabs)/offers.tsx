import { Ionicons } from '@expo/vector-icons';
import { addDoc, collection, deleteDoc, doc, getDocs } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { FlatList, Modal, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { db } from '../firebaseConfig'; // Ensure this path is correct

export default function BillScreen() {
  const [subscriptions, setSubscriptions] = useState([]);
  const [newSubscription, setNewSubscription] = useState({ name: '', price: '' });
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    loadSubscriptions();
  }, []);

  const loadSubscriptions = async () => {
    try {
      const subscriptionsRef = collection(db, 'subscriptions');
      const querySnapshot = await getDocs(subscriptionsRef);
      const subscriptionsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setSubscriptions(subscriptionsData);
    } catch (error) {
      console.error('Error loading subscriptions:', error);
    }
  };

  const addSubscription = async () => {
    if (newSubscription.name && newSubscription.price) {
      try {
        const subscriptionsRef = collection(db, 'subscriptions');
        await addDoc(subscriptionsRef, {
          ...newSubscription,
          price: Number(newSubscription.price)
        });
        setNewSubscription({ name: '', price: '' });
        setModalVisible(false);
        loadSubscriptions(); // Refresh the list
      } catch (error) {
        console.error('Error adding subscription:', error);
      }
    }
  };

  const deleteSubscription = async (id) => {
    try {
      const subscriptionRef = doc(db, 'subscriptions', id);
      await deleteDoc(subscriptionRef);
      loadSubscriptions(); // Refresh the list
    } catch (error) {
      console.error('Error deleting subscription:', error);
    }
  };

  const totalMonthlyPayment = subscriptions.reduce((total, sub) => total + sub.price, 0);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Ionicons name="chevron-back" size={24} color="#000" />
        </View>
        <Text style={styles.headerTitle}>Bill</Text>
        <TouchableOpacity onPress={() => setModalVisible(true)}>
          <Ionicons name="add" size={24} color="#000" />
        </TouchableOpacity>
      </View>

      {/* Monthly Payment Section */}
      <View style={styles.paymentSection}>
        <Text style={styles.paymentLabel}>Your monthly payment</Text>
        <Text style={styles.paymentSubLabel}>for subscriptions</Text>
        <Text style={styles.totalAmount}>₱{totalMonthlyPayment.toLocaleString()}</Text>
      </View>

      {/* Add Subscription Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add New Subscription</Text>
            <TextInput
              style={styles.input}
              placeholder="Subscription Name"
              value={newSubscription.name}
              onChangeText={(text) => setNewSubscription(prev => ({ ...prev, name: text }))}
            />
            <TextInput
              style={styles.input}
              placeholder="Price"
              keyboardType="numeric"
              value={newSubscription.price}
              onChangeText={(text) => setNewSubscription(prev => ({ ...prev, price: text }))}
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={[styles.modalButton, styles.cancelButton]} 
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.modalButton, styles.addButton]} 
                onPress={addSubscription}
              >
                <Text style={styles.addButtonText}>Add</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Subscriptions List */}
      <FlatList
        data={subscriptions}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.subscriptionItem}>
            <View style={styles.subscriptionContent}>
              <View style={styles.subscriptionIcon}>
                <Text style={styles.subscriptionIconText}>{item.name.charAt(0)}</Text>
              </View>
              <View style={styles.subscriptionDetails}>
                <Text style={styles.subscriptionName}>{item.name}</Text>
                <Text style={styles.subscriptionPrice}>₱{item.price}/mo</Text>
              </View>
              <TouchableOpacity onPress={() => deleteSubscription(item.id)}>
                <Ionicons name="trash" size={24} color="#666" />
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        )}
      />
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
  input: {
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    fontSize: 16,
    color: '#333',
    width: '100%',
    borderWidth: 1,
    borderColor: '#E5E5E5',
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
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  subscriptionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#6B4EFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  subscriptionIconText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end', // Changed from 'center' to 'flex-end'
    padding: 0, // Remove padding to allow modal to touch bottom
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    padding: 24,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#000',
    textAlign: 'center',
    marginBottom: 20,
  },
  modalSubtitle: {
    fontSize: 18,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
  },
  modalText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 24,
    textAlign: 'center',
    lineHeight: 24,
  },
  modalInput: {
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    fontSize: 16,
    color: '#333',
    width: '100%',
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    marginTop: 8,
  },
  modalButton: {
    flex: 1,
    height: 56,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  cancelButton: {
    backgroundColor: '#ccc',
    marginRight: 10,
  },
  addButton: {
    backgroundColor: '#6B4EFF',
  },
  cancelButtonText: {
    color: '#fff',
  },
  addButtonText: {
    color: '#fff',
  },
});