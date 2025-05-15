import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function ExpensesScreen() {
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity>
          <Ionicons name="chevron-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Expenses</Text>
        <TouchableOpacity>
          <Ionicons name="add" size={24} color="#000" />
        </TouchableOpacity>
      </View>

      {/* Month Selector */}
      <TouchableOpacity style={styles.monthSelector}>
        <Text style={styles.monthText}>January 2024</Text>
        <Ionicons name="chevron-down" size={20} color="#666" />
      </TouchableOpacity>

      {/* Amount Display */}
      <Text style={styles.amountText}>₱5,000</Text>

      {/* Budget Progress */}
      <View style={styles.budgetCard}>
        <View style={styles.budgetRow}>
          <Text style={styles.budgetLabel}>Left to spend</Text>
          <Text style={styles.budgetLabel}>Monthly budget</Text>
        </View>
        <View style={styles.budgetRow}>
          <Text style={styles.budgetAmount}>₱5,000</Text>
          <Text style={styles.budgetAmount}>₱10,000</Text>
        </View>
        <View style={styles.progressBarContainer}>
          <View style={styles.progressBar}>
            <View style={[styles.progressFillLeft, { width: '25%' }]} />
            <View style={[styles.progressFillRight, { width: '25%' }]} />
          </View>
        </View>
      </View>

      {/* Expense Categories */}
      <View style={styles.categoriesContainer}>
        {/* Auto & Transport */}
        <View style={styles.categoryItem}>
          <View style={styles.categoryHeader}>
            <View style={styles.categoryIconContainer}>
              <Ionicons name="car" size={20} color="#6B4EFF" />
            </View>
            <Text style={styles.categoryTitle}>Auto & transport</Text>
            <Text style={styles.categoryAmount}>₱300</Text>
          </View>
          <View style={styles.progressBarPurple}>
            <View style={[styles.progressFillPurple, { width: '30%' }]} />
          </View>
          <Text style={styles.leftAmount}>Left ₱1,000</Text>
        </View>

        {/* Auto Insurance */}
        <View style={styles.categoryItem}>
          <View style={styles.categoryHeader}>
            <View style={styles.categoryIconContainer}>
              <Ionicons name="shield-checkmark" size={20} color="#6B4EFF" />
            </View>
            <Text style={styles.categoryTitle}>Auto insurance</Text>
            <Text style={styles.categoryAmount}>₱3,000</Text>
          </View>
          <View style={styles.progressBarPurple}>
            <View style={[styles.progressFillPurple, { width: '100%' }]} />
          </View>
          <Text style={styles.leftAmount}>Left ₱3,000</Text>
        </View>

        {/* Bill & Utilities */}
        <View style={styles.categoryItem}>
          <View style={styles.categoryHeader}>
            <View style={styles.categoryIconContainer}>
              <Ionicons name="receipt" size={20} color="#FF6B4E" />
            </View>
            <Text style={styles.categoryTitle}>Bill & Utilities</Text>
            <Text style={styles.categoryAmount}>₱12,000</Text>
          </View>
        </View>

        {/* Subscriptions */}
        <View style={styles.categoryItem}>
          <View style={styles.categoryHeader}>
            <View style={styles.categoryIconContainer}>
              <Ionicons name="repeat" size={20} color="#FF6B4E" />
            </View>
            <Text style={styles.categoryTitle}>Subscriptions</Text>
            <Text style={styles.categoryAmount}>₱3,000</Text>
          </View>
          <View style={styles.progressBarOrange}>
            <View style={[styles.progressFillOrange, { width: '100%' }]} />
          </View>
          <Text style={styles.leftAmount}>Left ₱0</Text>
        </View>
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
    gap: 4,
    marginBottom: 16,
  },
  monthText: {
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
  },
  amountText: {
    fontSize: 48,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 24,
    color: '#000',
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
});