import React from 'react';
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import { usePortfolios } from '../hooks';

export const PortfoliosScreen: React.FC = () => {
  const { data: portfolios, isLoading } = usePortfolios();

  if (isLoading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#2196f3" />
      </View>
    );
  }

  if (!portfolios || portfolios.length === 0) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.emptyText}>No portfolios yet</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={portfolios}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.portfolioCard}>
            <Text style={styles.portfolioName}>{item.name}</Text>
            <View style={styles.divider} />
            <View style={styles.statRow}>
              <View style={styles.stat}>
                <Text style={styles.statLabel}>Total Value</Text>
                <Text style={styles.statValue}>
                  ${item.totalValue.toLocaleString()}
                </Text>
                <Text
                  style={[
                    styles.statChange,
                    { color: item.totalReturnPercentage >= 0 ? '#4caf50' : '#f44336' },
                  ]}
                >
                  {item.totalReturnPercentage >= 0 ? '↑' : '↓'}
                  {Math.abs(item.totalReturnPercentage).toFixed(2)}%
                </Text>
              </View>
            </View>
            <View style={styles.metricsRow}>
              <View style={styles.metric}>
                <Text style={styles.metricLabel}>Total Cost</Text>
                <Text style={styles.metricValue}>
                  ${item.totalCost.toLocaleString()}
                </Text>
              </View>
              <View style={styles.metric}>
                <Text style={styles.metricLabel}>Return</Text>
                <Text
                  style={[
                    styles.metricValue,
                    { color: item.totalReturn >= 0 ? '#4caf50' : '#f44336' },
                  ]}
                >
                  {item.totalReturn >= 0 ? '+' : ''}$
                  {item.totalReturn.toLocaleString()}
                </Text>
              </View>
            </View>
            <Text style={styles.holdingsCount}>{item.holdings.length} holdings</Text>
          </View>
        )}
        contentContainerStyle={styles.listContent}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  listContent: {
    padding: 16,
  },
  emptyText: {
    color: '#666',
    fontSize: 16,
  },
  portfolioCard: {
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
  portfolioName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  divider: {
    height: 1,
    backgroundColor: '#e0e0e0',
    marginBottom: 12,
  },
  statRow: {
    marginBottom: 12,
  },
  stat: {
    alignItems: 'flex-start',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statChange: {
    fontSize: 14,
    fontWeight: '600',
  },
  metricsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
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
  holdingsCount: {
    fontSize: 12,
    color: '#666',
  },
});
