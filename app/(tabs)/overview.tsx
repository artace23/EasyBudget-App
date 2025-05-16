import { StyleSheet, View, Text, TouchableOpacity, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Svg, { Circle, Path, Text as SvgText } from 'react-native-svg';
import React, { useState, useEffect } from'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get('window');
const circleSize = width * 0.85;
const strokeWidth = 12;
const radius = (circleSize - strokeWidth) / 2;
const circumference = radius * Math.PI; // Only half circle
const progress = (660 - 400) / (800 - 400); // Score progress calculation

export default function CreditScreen() {
  const progressStroke = circumference - (progress * circumference);
  const [creditData, setCreditData] = useState({
    score: 660,
    lastUpdate: '20 December 2025'
  });

  useEffect(() => {
    loadCreditData();
  }, []);

  const loadCreditData = async () => {
    try {
      const storedData = await AsyncStorage.getItem('creditData');
      if (storedData) {
        setCreditData(JSON.parse(storedData));
      }
    } catch (error) {
      console.error('Error loading credit data:', error);
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity>
          <Ionicons name="chevron-back" size={24} color="#000" />
        </TouchableOpacity>
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
              Good
            </SvgText>
          </Svg>
          <View style={styles.scoreTextContainer}>
            <Text style={styles.scoreText}>660</Text>
            <Text style={styles.scoreChange}>+6pts</Text>
          </View>
          <Text style={styles.lastUpdate}>Last update on 20 December 2025</Text>
        </View>
      </View>

      {/* Credit Details */}
      <View style={styles.detailsContainer}>
        <View style={styles.detailCard}>
          {/* On-time payments */}
          <View style={styles.detailItem}>
            <View style={styles.detailHeader}>
              <Text style={styles.detailTitle}>On-time payments</Text>
              <View style={styles.detailValue}>
                <Text style={styles.percentageText}>95%</Text>
                <Text style={styles.missedText}>1 missed</Text>
              </View>
            </View>
            <Text style={[styles.statusText, styles.goodStatus]}>Good</Text>
          </View>

          {/* Credit Utilization */}
          <View style={styles.detailItem}>
            <View style={styles.detailHeader}>
              <Text style={styles.detailTitle}>Credit Utilization</Text>
              <View style={styles.detailValue}>
                <Text style={styles.percentageText}>95%</Text>
                <Text style={[styles.changeText, styles.negativeChange]}>-15%</Text>
              </View>
            </View>
            <Text style={[styles.statusText, styles.warningStatus]}>Not bad</Text>
          </View>

          {/* Age of credit */}
          <View style={styles.detailItem}>
            <View style={styles.detailHeader}>
              <Text style={styles.detailTitle}>Age of credit</Text>
              <Text style={styles.yearText}>8 year</Text>
            </View>
            <Text style={[styles.statusText, styles.goodStatus]}>Good</Text>
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