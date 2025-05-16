import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { addDoc, collection, deleteDoc, doc, getDocs, query, Timestamp, updateDoc, where } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { Alert, Modal, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { db } from '../firebaseConfig';

export default function ExpensesScreen() {
  const [expenses, setExpenses] = useState([]);
  const [monthlyBudget, setMonthlyBudget] = useState(0);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [modalVisible, setModalVisible] = useState(false);
  const [paymentModalVisible, setPaymentModalVisible] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState(null);
  const [newExpense, setNewExpense] = useState({
    category: '',
    amount: '',
    budget: '',
    icon: 'receipt'
  });
  const [paymentAmount, setPaymentAmount] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);
  // ADD THESE TWO LINES:
  const [budgetModalVisible, setBudgetModalVisible] = useState(false);
  const [newBudget, setNewBudget] = useState('');

  useEffect(() => {
    loadExpenses();
    getCurrentMonthBudget();
  }, [currentDate]);

  const loadExpenses = async () => {
    try {
      const userId = await AsyncStorage.getItem('userId');
      const expensesRef = collection(db, 'expenses');
      const q = query(expensesRef, where('userId', '==', userId));
      const querySnapshot = await getDocs(q);
      const expensesData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setExpenses(expensesData);
    } catch (error) {
      console.error('Error loading expenses:', error);
      Alert.alert('Error', 'Failed to load expenses');
    }
  };

  const handleAddExpense = async () => {
    try {
      const userId = await AsyncStorage.getItem('userId');
      const expensesRef = collection(db, 'expenses');
      await addDoc(expensesRef, {
        ...newExpense,
        userId,
        spent: 0,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      });
      setModalVisible(false);
      setNewExpense({ category: '', amount: '', budget: '', icon: 'receipt' });
      loadExpenses();
    } catch (error) {
      console.error('Error adding expense:', error);
      Alert.alert('Error', 'Failed to add expense');
    }
  };

  const handlePayExpense = async () => {
    if (!selectedExpense || !paymentAmount) return;

    try {
      const expenseRef = doc(db, 'expenses', selectedExpense.id);
      const newSpent = Number(selectedExpense.spent || 0) + Number(paymentAmount);
      await updateDoc(expenseRef, {
        spent: newSpent,
        updatedAt: Timestamp.now()
      });
      setPaymentModalVisible(false);
      setPaymentAmount('');
      setSelectedExpense(null);
      loadExpenses();
    } catch (error) {
      console.error('Error updating expense:', error);
      Alert.alert('Error', 'Failed to update expense');
    }
  };

  const handleDeleteExpense = async (id) => {
    try {
      const expenseRef = doc(db, 'expenses', id);
      await deleteDoc(expenseRef);
      loadExpenses();
      setShowDeleteConfirm(false);
    } catch (error) {
      console.error('Error deleting expense:', error);
      Alert.alert('Error', 'Failed to delete expense');
    }
  };

  const getCurrentMonthBudget = async () => {
    try {
      const userId = await AsyncStorage.getItem('userId');
      const budgetRef = collection(db, 'monthlyBudgets');
      const month = currentDate.getMonth() + 1;
      const year = currentDate.getFullYear();
      
      const q = query(
        budgetRef, 
        where('userId', '==', userId),
        where('month', '==', month),
        where('year', '==', year)
      );
      
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        const budgetData = querySnapshot.docs[0].data();
        setMonthlyBudget(budgetData.amount || 0);
      }
    } catch (error) {
      console.error('Error loading monthly budget:', error);
    }
  };

  const formatDate = (date) => {
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    return `${months[date.getMonth()]} ${date.getFullYear()}`;
  };

  const handlePreviousMonth = () => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() - 1);
      return newDate;
    });
  };

  const handleNextMonth = () => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + 1);
      return newDate;
    });
  };

  // Add this new function to handle budget updates
  const handleAddBudget = async () => {
    try {
      const userId = await AsyncStorage.getItem('userId');
      const budgetRef = collection(db, 'monthlyBudgets');
      const month = currentDate.getMonth() + 1;
      const year = currentDate.getFullYear();
      
      // Check if budget already exists for this month
      const q = query(
        budgetRef,
        where('userId', '==', userId),
        where('month', '==', month),
        where('year', '==', year)
      );
      
      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        // Update existing budget
        const budgetDoc = querySnapshot.docs[0];
        await updateDoc(doc(db, 'monthlyBudgets', budgetDoc.id), {
          amount: Number(newBudget),
          updatedAt: Timestamp.now()
        });
      } else {
        // Create new budget
        await addDoc(budgetRef, {
          userId,
          amount: Number(newBudget),
          month,
          year,
          createdAt: Timestamp.now(),
          updatedAt: Timestamp.now()
        });
      }
      
      setBudgetModalVisible(false);
      setNewBudget('');
      getCurrentMonthBudget();
    } catch (error) {
      console.error('Error updating budget:', error);
      Alert.alert('Error', 'Failed to update budget');
    }
  };

  // Modify the Amount Display section to use the new modal
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity>
          <Ionicons name="chevron-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Expenses</Text>
        <TouchableOpacity onPress={() => setModalVisible(true)}>
          <Ionicons name="add" size={24} color="#000" />
        </TouchableOpacity>
      </View>

      {/* Month Selector */}
      <TouchableOpacity style={styles.monthSelector}>
        <Text style={styles.monthText}>{formatDate(currentDate)}</Text>
      </TouchableOpacity>

      {/* Amount Display */}
      <View style={styles.amountContainer}>
        <Text style={styles.amountText}>₱{monthlyBudget.toLocaleString()}</Text>
        <TouchableOpacity 
          style={styles.budgetAddButton}
          onPress={() => setBudgetModalVisible(true)}
        >
          <Ionicons name="add-circle" size={24} color="#6B4EFF" />
        </TouchableOpacity>
      </View>

      {/* Budget Progress */}
      <View style={styles.budgetCard}>
        <View>
          <View>
            <View style={styles.budgetRow}>
              <Text style={styles.budgetLabel}>Left to spend</Text>
              <Text style={styles.budgetLabel}>Monthly budget</Text>
            </View>
            <View style={styles.budgetRow}>
              <Text style={styles.budgetAmount}>
                ₱{(monthlyBudget - expenses.reduce((sum, exp) => sum + (exp.spent || 0), 0)).toLocaleString()}
              </Text>
              <Text style={styles.budgetAmount}>₱{monthlyBudget.toLocaleString()}</Text>
            </View>
          </View>
        </View>
        <View style={styles.progressBarContainer}>
          <View style={styles.progressBar}>
            <View 
              style={[
                styles.progressFillLeft, 
                { 
                  width: `${(expenses.reduce((sum, exp) => sum + (exp.spent || 0), 0) / monthlyBudget) * 100}%` 
                }
              ]} 
            />
          </View>
        </View>
      </View>

      {/* Expense Categories */}
      <View style={styles.categoriesContainer}>
        {expenses.map((expense) => (
          <TouchableOpacity 
            key={expense.id} 
            style={styles.categoryItem}
            onPress={() => {
              setSelectedExpense(expense);
              setPaymentModalVisible(true);
            }}
          >
            <View style={styles.categoryHeader}>
              <View style={styles.categoryIconContainer}>
                <Ionicons name={expense.icon} size={20} color="#6B4EFF" />
              </View>
              <Text style={styles.categoryTitle}>{expense.category}</Text>
              <Text style={styles.categoryAmount}>₱{expense.spent || 0}</Text>
              <TouchableOpacity 
                style={styles.menuButton}
                onPress={() => {
                  setSelectedExpense(expense);
                  setMenuVisible(true);
                }}
              >
                <Ionicons name="ellipsis-vertical" size={20} color="#666" />
              </TouchableOpacity>
            </View>
            <View style={styles.progressBarPurple}>
              <View 
                style={[
                  styles.progressFillPurple, 
                  { width: `${(expense.spent / expense.budget) * 100}%` }
                ]} 
              />
            </View>
            <Text style={styles.leftAmount}>
              Left ₱{expense.budget - (expense.spent || 0)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Add Expense Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add New Expense Category</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="Category Name"
              value={newExpense.category}
              onChangeText={(text) => setNewExpense({...newExpense, category: text})}
            />
            <TextInput
              style={styles.modalInput}
              placeholder="Budget Amount"
              keyboardType="numeric"
              value={newExpense.budget}
              onChangeText={(text) => setNewExpense({...newExpense, budget: text})}
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
                onPress={handleAddExpense}
              >
                <Text style={styles.addButtonText}>Add</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Menu Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={menuVisible}
        onRequestClose={() => setMenuVisible(false)}
      >
        <TouchableOpacity 
          style={styles.menuOverlay}
          onPress={() => setMenuVisible(false)}
        >
          <View style={styles.menuContent}>
            <TouchableOpacity 
              style={styles.menuItem}
              onPress={() => {
                setMenuVisible(false);
                setShowDeleteConfirm(true);
              }}
            >
              <Ionicons name="trash-outline" size={20} color="#FF4B55" />
              <Text style={styles.menuItemTextDelete}>Delete</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Budget Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={budgetModalVisible}
        onRequestClose={() => setBudgetModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Set Monthly Budget</Text>
            <Text style={styles.modalSubtitle}>
              {formatDate(currentDate)}
            </Text>
            <TextInput
              style={styles.modalInput}
              placeholder="Budget Amount"
              keyboardType="numeric"
              value={newBudget}
              onChangeText={setNewBudget}
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={[styles.modalButton, styles.cancelButton]} 
                onPress={() => {
                  setBudgetModalVisible(false);
                  setNewBudget('');
                }}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.modalButton, styles.addButton]} 
                onPress={handleAddBudget}
              >
                <Text style={styles.addButtonText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={showDeleteConfirm}
        onRequestClose={() => setShowDeleteConfirm(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Delete Expense</Text>
            <Text style={styles.modalText}>
              Are you sure you want to delete this expense category?
            </Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={[styles.modalButton, styles.cancelButton]} 
                onPress={() => setShowDeleteConfirm(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.modalButton, styles.deleteButton]} 
                onPress={() => handleDeleteExpense(selectedExpense.id)}
              >
                <Text style={styles.deleteButtonText}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Payment Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={paymentModalVisible}
        onRequestClose={() => setPaymentModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Make Payment</Text>
            <Text style={styles.modalSubtitle}>
              {selectedExpense?.category}
            </Text>
            <TextInput
              style={styles.modalInput}
              placeholder="Payment Amount"
              keyboardType="numeric"
              value={paymentAmount}
              onChangeText={setPaymentAmount}
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={styles.modalButton} 
                onPress={() => {
                  setPaymentModalVisible(false);
                  setSelectedExpense(null);
                  setPaymentAmount('');
                }}
              >
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.modalButton, styles.modalButtonPrimary]} 
                onPress={handlePayExpense}
              >
                <Text style={[styles.modalButtonText, styles.modalButtonTextPrimary]}>Pay</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  monthSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
    marginBottom: 16,
  },
  monthText: {
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
    minWidth: 120,
    textAlign: 'center',
  },
  amountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    gap: 8,
  },
  amountText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#000',
  },
  budgetAddButton: {
    padding: 4,
  },
  budgetCard: {
    marginHorizontal: 20,
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    marginBottom: 24,
  },
  budgetRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  budgetLabel: {
    color: '#666',
    fontSize: 14,
  },
  budgetAmount: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
  },
  progressBarContainer: {
    marginTop: 8,
  },
  progressBar: {
    height: 4,
    backgroundColor: '#E5E5E5',
    borderRadius: 2,
    overflow: 'hidden',
    flexDirection: 'row',
  },
  progressFillLeft: {
    height: '100%',
    backgroundColor: '#FF6B4E',
  },
  progressFillRight: {
    height: '100%',
    backgroundColor: '#6B4EFF',
  },
  categoriesContainer: {
    paddingHorizontal: 20,
  },
  categoryItem: {
    marginBottom: 20,
  },
  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryIconContainer: {
    width: 32,
    height: 32,
    backgroundColor: '#F5F5F5',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  categoryTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
    color: '#000',
  },
  categoryAmount: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  progressBarPurple: {
    height: 4,
    backgroundColor: '#E5E5E5',
    borderRadius: 2,
    overflow: 'hidden',
    marginBottom: 4,
  },
  progressBarOrange: {
    height: 4,
    backgroundColor: '#E5E5E5',
    borderRadius: 2,
    overflow: 'hidden',
    marginBottom: 4,
  },
  progressFillPurple: {
    height: '100%',
    backgroundColor: '#6B4EFF',
  },
  progressFillOrange: {
    height: '100%',
    backgroundColor: '#FF6B4E',
  },
  leftAmount: {
    fontSize: 12,
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
    backgroundColor: '#F5F5F5',
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  addButton: {
    backgroundColor: '#6B4EFF',
  },
  deleteButton: {
    backgroundColor: '#FF4B55',
  },
  modalButtonPrimary: {
    backgroundColor: '#6B4EFF',
  },
  cancelButtonText: {
    color: '#666',
    fontSize: 16,
    fontWeight: '600',
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  deleteButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  modalButtonText: {
    color: '#666',
    fontSize: 16,
    fontWeight: '600',
  },
  modalButtonTextPrimary: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },

  // Menu Styles
  menuOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
  },
  menuContent: {
    position: 'absolute',
    right: 20,
    top: 100,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 8,
    minWidth: 160,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 12,
    borderRadius: 8,
  },
  menuItemTextDelete: {
    color: '#FF4B55',
    fontSize: 16,
    fontWeight: '500',
  }
});