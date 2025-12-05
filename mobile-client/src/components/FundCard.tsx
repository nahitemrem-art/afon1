import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Fund, FundSummary } from '../types';

interface FundCardProps {
  fund: Fund | FundSummary;
  onPress?: () => void;
}

export const FundCard: React.FC<FundCardProps> = ({ fund, onPress }) => {
  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'Low':
        return '#4caf50';
      case 'Medium':
        return '#ff9800';
      case 'High':
        return '#f44336';
      default:
        return '#9e9e9e';
    }
  };

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      disabled={!onPress}
    >
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Text style={styles.name}>{fund.name}</Text>
          <Text style={styles.ticker}>{fund.ticker}</Text>
        </View>
      </View>

      <View style={styles.badges}>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{fund.category}</Text>
        </View>
        <View style={[styles.badge, { backgroundColor: getRiskColor(fund.riskLevel) }]}>
          <Text style={[styles.badgeText, { color: 'white' }]}>
            {fund.riskLevel} Risk
          </Text>
        </View>
      </View>

      <View style={styles.metrics}>
        <View style={styles.metric}>
          <Text style={styles.metricLabel}>YTD Return</Text>
          <Text
            style={[
              styles.metricValue,
              { color: fund.ytdReturn >= 0 ? '#4caf50' : '#f44336' },
            ]}
          >
            {fund.ytdReturn >= 0 ? '+' : ''}
            {fund.ytdReturn.toFixed(2)}%
          </Text>
        </View>
        <View style={styles.metric}>
          <Text style={styles.metricLabel}>Expense Ratio</Text>
          <Text style={styles.metricValue}>{fund.expenseRatio.toFixed(2)}%</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    marginBottom: 12,
  },
  titleContainer: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  ticker: {
    fontSize: 14,
    color: '#666',
  },
  badges: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  badge: {
    backgroundColor: '#e3f2fd',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginRight: 8,
  },
  badgeText: {
    fontSize: 12,
    color: '#1976d2',
    fontWeight: '500',
  },
  metrics: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  metric: {
    flex: 1,
  },
  metricLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  metricValue: {
    fontSize: 16,
    fontWeight: '600',
  },
});
