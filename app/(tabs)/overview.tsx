import AsyncStorage from '@react-native-async-storage/async-storage';
import { collection, getDocs, query, where } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { Dimensions, StyleSheet, Text, View } from 'react-native';
import Svg, { Path, Text as SvgText } from 'react-native-svg';
import { db } from '../firebaseConfig';

const { width } = Dimensions.get('window');
const circleSize = width * 0.85;
const strokeWidth = 12;
const radius = (circleSize - strokeWidth) / 2;
const circumference = radius * Math.PI; // Only half circle
const progress = (660 - 400) / (800 - 400); // Score progress calculation

export default function CreditScreen() {
  const [creditData, setCreditData] = useState({
    score: 0,
    lastUpdate: '',
    onTimePayments: 0,
    creditUtilization: 0,
    creditAge: 0
  });
  const [expenses, setExpenses] = useState([]);
  
  useEffect(() => {
    loadCreditData();
    loadExpenses();
  }, []);

  const loadCreditData = async () => {
    try {
      const userId = await AsyncStorage.getItem('userId');
      const creditRef = collection(db, 'creditScores');
      const q = query(creditRef, where('userId', '==', userId));
      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        const data = querySnapshot.docs[0].data();
        setCreditData({
          score: data.score || 0,
          lastUpdate: data.updatedAt || new Date().toLocaleDateString(),
          onTimePayments: data.onTimePayments || 0,
          creditUtilization: data.creditUtilization || 0,
          creditAge: data.creditAge || 0
        });
      }
    } catch (error) {
      console.error('Error loading credit data:', error);
    }
  };

  const loadExpenses = async () => {
    try {
      const userId = await AsyncStorage.getItem('userId');
      const expensesRef = collection(db, 'expenses');
      const budgetRef = collection(db, 'monthlyBudgets');

      // Query expenses
      const expensesQuery = query(expensesRef, where('userId', '==', userId));
      const expensesSnapshot = await getDocs(expensesQuery);
      const expensesData = expensesSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      // Query monthly budgets
      const budgetQuery = query(budgetRef, where('userId', '==', userId));
      const budgetSnapshot = await getDocs(budgetQuery);
      const budgetData = budgetSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      // Combine expenses and budget data
      const combinedData = {
        expenses: expensesData,
        budgets: budgetData
      };

      setExpenses(combinedData);

      // Calculate total spent and budget
      const totalSpent = expensesData.reduce((sum, expense) => sum + (expense.spent || 0), 0);
      const totalBudget = budgetData.reduce((sum, budget) => sum + (Number(budget.amount) || 0), 0);

      // Update credit utilization based on expenses
      const utilization = totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0;

      // Calculate on-time payments and score
      const fullyPaidCount = expensesData.filter(exp => (exp.spent || 0) >= (Number(exp.budget) || 0)).length;
      const onTimePayments = expensesData.length > 0 ? Math.round((fullyPaidCount / expensesData.length) * 100) : 0;
      const score = onTimePayments === 100 ? 750 : 600;

      setCreditData(prev => ({
        ...prev,
        creditUtilization: Math.round(utilization),
        onTimePayments,
        score
      }));
    } catch (error) {
      console.error('Error loading expenses:', error);
    }
  };

  // Calculate progress for the credit score circle
  const progress = (creditData.score - 400) / (800 - 400);
  const progressStroke = circumference - (progress * circumference);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Credit Score</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Credit Score Circle */}
      <View style={styles.scoreContainer}>
        <View style={styles.scoreCircle}>
          <Svg width={circleSize} height={circleSize / 2 + strokeWidth}>
            {/* Background Half Circle */}
            <Path
              d={`M ${strokeWidth/2} ${circleSize/2} A ${radius} ${radius} 0 0 1 ${circleSize - strokeWidth/2} ${circleSize/2}`}
              stroke="#E5E5E5"
              strokeWidth={strokeWidth}
              fill="none"
            />
            {/* Progress Half Circle */}
            <Path
              d={`M ${strokeWidth/2} ${circleSize/2} A ${radius} ${radius} 0 0 1 ${circleSize - strokeWidth/2} ${circleSize/2}`}
              stroke="#6B4EFF"
              strokeWidth={strokeWidth}
              strokeDasharray={circumference}
              strokeDashoffset={progressStroke}
              strokeLinecap="round"
              fill="none"
            />
            {/* Score Range Text */}
            <SvgText
              x={strokeWidth}
              y={circleSize/2 - 10}
              fontSize="14"
              fill="#666"
              textAnchor="start"
            >
              400
            </SvgText>
            <SvgText
              x={circleSize - strokeWidth}
              y={circleSize/2 - 10}
              fontSize="14"
              fill="#666"
              textAnchor="end"
            >
              800
            </SvgText>
            {/* Status Text */}
            <SvgText
              x={circleSize/2}
              y={circleSize/4}
              fontSize="16"
              fill="#666"
              textAnchor="middle"
            >
              {creditData.score >= 700 ? 'Excellent' : creditData.score >= 600 ? 'Good' : 'Fair'}
            </SvgText>
          </Svg>
          <View style={styles.scoreTextContainer}>
            <Text style={styles.scoreText}>{creditData.score}</Text>
            <Text style={styles.lastUpdate}>Last update on {new Date().toLocaleDateString()}</Text>
          </View>
        </View>
      </View>

      {/* Credit Details */}
      <View style={styles.detailsContainer}>
        <View style={styles.detailCard}>
          <View style={styles.detailItem}>
            <View style={styles.detailHeader}>
              <Text style={styles.detailTitle}>On-time payments</Text>
              <View style={styles.detailValue}>
                <Text style={styles.percentageText}>{creditData.onTimePayments}%</Text>
              </View>
            </View>
            <Text style={[styles.statusText, styles.goodStatus]}>
              {creditData.onTimePayments >= 90 ? 'Excellent' : 'Good'}
            </Text>
          </View>

          <View style={styles.detailItem}>
            <View style={styles.detailHeader}>
              <Text style={styles.detailTitle}>Credit Utilization</Text>
              <View style={styles.detailValue}>
                <Text style={styles.percentageText}>{creditData.creditUtilization}%</Text>
              </View>
            </View>
            <Text style={[styles.statusText, creditData.creditUtilization <= 30 ? styles.goodStatus : styles.warningStatus]}>
              {creditData.creditUtilization <= 30 ? 'Good' : 'High'}
            </Text>
          </View>

          <View style={styles.detailItem}>
            <View style={styles.detailHeader}>
              <Text style={styles.detailTitle}>Age of credit</Text>
              <Text style={styles.yearText}>{creditData.creditAge} years</Text>
            </View>
            <Text style={[styles.statusText, creditData.creditAge >= 5 ? styles.goodStatus : styles.warningStatus]}>
              {creditData.creditAge >= 5 ? 'Good' : 'Building'}
            </Text>
          </View>
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
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  scoreContainer: {
    alignItems: 'center',
    marginBottom: 40,
    marginTop: -20,
  },
  scoreCircle: {
    alignItems: 'center',
    position: 'relative',
  },
  scoreTextContainer: {
    position: 'absolute',
    top: '50%',
    alignItems: 'center',
  },
  scoreText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 4,
  },
  scoreChange: {
    fontSize: 16,
    color: '#4CAF50',
    fontWeight: '500',
  },
  lastUpdate: {
    fontSize: 14,
    color: '#666',
    marginTop: 20,
  },
  detailsContainer: {
    paddingHorizontal: 20,
  },
  detailCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  detailItem: {
    marginBottom: 24,
  },
  detailHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  detailTitle: {
    fontSize: 16,
    color: '#666',
  },
  detailValue: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  percentageText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  missedText: {
    fontSize: 14,
    color: '#666',
  },
  changeText: {
    fontSize: 14,
    fontWeight: '500',
  },
  negativeChange: {
    color: '#FF6B4E',
  },
  yearText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  statusText: {
    fontSize: 14,
    fontWeight: '500',
  },
  goodStatus: {
    color: '#4CAF50',
  },
  warningStatus: {
    color: '#FF9800',
  },
});