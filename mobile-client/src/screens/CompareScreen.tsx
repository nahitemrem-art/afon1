import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { useFunds, useCompareFunds } from '../hooks';
import { FundCard } from '../components';

export const CompareScreen: React.FC = () => {
  const [selectedFunds, setSelectedFunds] = useState<string[]>([]);
  const { data: allFunds } = useFunds();
  const { data: comparedFunds } = useCompareFunds(selectedFunds);

  const handleToggleFund = (fundId: string) => {
    if (selectedFunds.includes(fundId)) {
      setSelectedFunds(selectedFunds.filter((id) => id !== fundId));
    } else {
      if (selectedFunds.length >= 5) {
        return;
      }
      setSelectedFunds([...selectedFunds, fundId]);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Select funds to compare (up to 5)</Text>
          <FlatList
            data={allFunds}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => handleToggleFund(item.id)}
                style={[
                  styles.fundItem,
                  selectedFunds.includes(item.id) && styles.selectedFundItem,
                ]}
              >
                <FundCard fund={item} />
              </TouchableOpacity>
            )}
            scrollEnabled={false}
          />
        </View>

        {comparedFunds && comparedFunds.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Comparison</Text>
            {comparedFunds.map((fund) => (
              <View key={fund.id} style={styles.comparisonCard}>
                <Text style={styles.fundName}>{fund.name}</Text>
                <View style={styles.comparisonRow}>
                  <Text style={styles.label}>Category:</Text>
                  <Text style={styles.value}>{fund.category}</Text>
                </View>
                <View style={styles.comparisonRow}>
                  <Text style={styles.label}>Expense Ratio:</Text>
                  <Text style={styles.value}>{fund.expenseRatio.toFixed(2)}%</Text>
                </View>
                <View style={styles.comparisonRow}>
                  <Text style={styles.label}>YTD Return:</Text>
                  <Text
                    style={[
                      styles.value,
                      { color: fund.ytdReturn >= 0 ? '#4caf50' : '#f44336' },
                    ]}
                  >
                    {fund.ytdReturn >= 0 ? '+' : ''}
                    {fund.ytdReturn.toFixed(2)}%
                  </Text>
                </View>
                <View style={styles.comparisonRow}>
                  <Text style={styles.label}>Risk Level:</Text>
                  <Text style={styles.value}>{fund.riskLevel}</Text>
                </View>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  section: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  fundItem: {
    marginBottom: 8,
  },
  selectedFundItem: {
    opacity: 0.6,
  },
  comparisonCard: {
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
  fundName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  comparisonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  label: {
    fontSize: 14,
    color: '#666',
  },
  value: {
    fontSize: 14,
    fontWeight: '600',
  },
});
