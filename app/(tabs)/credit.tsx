import { StyleSheet, View, Text, TouchableOpacity, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Svg, { Circle, Path } from 'react-native-svg';

const { width } = Dimensions.get('window');
const circleSize = width * 0.6;
const strokeWidth = 12;
const radius = (circleSize - strokeWidth) / 2;
const circumference = radius * 2 * Math.PI;
const progress = 0.75; // 75% progress for "Good" score

export default function CreditScreen() {
  const progressStroke = circumference - (progress * circumference);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity>
          <Ionicons name="chevron-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Credit Score</Text>
        <View style={{ width: 24 }} /> {/* Empty view for alignment */}
      </View>

      {/* Credit Score Circle */}
      <View style={styles.scoreContainer}>
        <View style={styles.scoreCircle}>
          <Svg width={circleSize} height={circleSize}>
            {/* Background Circle */}
            <Circle
              cx={circleSize / 2}
              cy={circleSize / 2}
              r={radius}
              stroke="#E5E5E5"
              strokeWidth={strokeWidth}
              fill="none"
            />
            {/* Progress Circle */}
            <Circle
              cx={circleSize / 2}
              cy={circleSize / 2}
              r={radius}
              stroke="#6B4EFF"
              strokeWidth={strokeWidth}
              strokeDasharray={circumference}
              strokeDashoffset={progressStroke}
              strokeLinecap="round"
              fill="none"
              transform={`rotate(-90 ${circleSize / 2} ${circleSize / 2})`}
            />
          </Svg>
          <View style={styles.scoreTextContainer}>
            <Text style={styles.scoreText}>660</Text>
            <Text style={styles.scoreChange}>+6pts</Text>
          </View>
        </View>
        <Text style={styles.scoreStatus}>Good</Text>
        <Text style={styles.lastUpdate}>Last update on 20 December 2025</Text>
      </View>

      {/* Credit Details */}
      <View style={styles.detailsContainer}>
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
  },
  scoreCircle: {
    alignItems: 'center',
    marginBottom: 16,
    position: 'relative',
  },
  scoreTextContainer: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -50 }, { translateY: -30 }],
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
  scoreStatus: {
    fontSize: 16,
    color: '#666',
    marginBottom: 8,
  },
  lastUpdate: {
    fontSize: 14,
    color: '#666',
  },
  detailsContainer: {
    paddingHorizontal: 20,
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