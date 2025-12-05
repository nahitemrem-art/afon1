import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { TrendingUp } from '@expo/vector-icons';

interface Fund {
  id: string;
  name: string;
  type: string;
  price: number;
  change: number;
  changePercent: number;
}

export default function FundsPage() {
  const [funds, setFunds] = useState<Fund[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchFunds();
  }, []);

  const fetchFunds = async () => {
    try {
      setError(null);
      const response = await fetch(`${process.env.EXPO_PUBLIC_API_BASE_URL}/api/tefas/funds`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch funds');
      }
      
      const data = await response.json();
      // Mock data for now - replace with actual TEFAS data
      const mockFunds: Fund[] = [
        {
          id: '1',
          name: 'Teknoloji Hisse Senedi Fonu',
          type: 'Hisse Senedi',
          price: 125.50,
          change: 2.30,
          changePercent: 1.87,
        },
        {
          id: '2',
          name: 'Kısa Vadeli Borçlanma Fonu',
          type: 'Borçlanma',
          price: 98.75,
          change: 0.15,
          changePercent: 0.15,
        },
        {
          id: '3',
          name: 'Büyüme Stratejisi Fonu',
          type: 'Hisse Senedi',
          price: 156.80,
          change: -1.20,
          changePercent: -0.76,
        },
      ];
      
      setFunds(mockFunds);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchFunds();
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.loadingText}>Loading funds...</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Error: {error}</Text>
        </View>
      )}

      <View style={styles.fundsList}>
        {funds.map((fund) => (
          <View key={fund.id} style={styles.fundCard}>
            <View style={styles.fundHeader}>
              <Text style={styles.fundName}>{fund.name}</Text>
              <View style={styles.fundTypeBadge}>
                <Text style={styles.fundTypeText}>{fund.type}</Text>
              </View>
            </View>
            <View style={styles.fundPrice}>
              <Text style={styles.priceText}>₺{fund.price.toFixed(2)}</Text>
              <View style={[
                styles.fundChange,
                fund.change >= 0 ? styles.positive : styles.negative
              ]}>
                <TrendingUp 
                  size={16} 
                  color={fund.change >= 0 ? '#10b981' : '#dc2626'} 
                />
                <Text style={[
                  styles.changeText,
                  fund.change >= 0 ? styles.positiveText : styles.negativeText
                ]}>
                  {fund.change >= 0 ? '+' : ''}{fund.change.toFixed(2)} ({fund.changePercent.toFixed(2)}%)
                </Text>
              </View>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
  },
  loadingText: {
    fontSize: 16,
    color: '#64748b',
  },
  errorContainer: {
    backgroundColor: '#dc2626',
    margin: 16,
    padding: 16,
    borderRadius: 8,
  },
  errorText: {
    color: '#fff',
    textAlign: 'center',
  },
  fundsList: {
    padding: 16,
    gap: 12,
  },
  fundCard: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  fundHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  fundName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
    flex: 1,
    marginRight: 8,
  },
  fundTypeBadge: {
    backgroundColor: '#f1f5f9',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  fundTypeText: {
    fontSize: 12,
    color: '#64748b',
    fontWeight: '500',
  },
  fundPrice: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  priceText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  fundChange: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  positive: {
    // handled by text color
  },
  negative: {
    // handled by text color
  },
  changeText: {
    fontSize: 14,
    fontWeight: '500',
  },
  positiveText: {
    color: '#10b981',
  },
  negativeText: {
    color: '#dc2626',
  },
});