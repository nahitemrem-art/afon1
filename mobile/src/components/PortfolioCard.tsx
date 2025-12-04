import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { UserPortfolio } from '../../../shared/types';

interface PortfolioCardProps {
  portfolio: UserPortfolio;
  onDelete: () => void;
}

export default function PortfolioCard({ portfolio, onDelete }: PortfolioCardProps) {
  const formatNumber = (num: number) => {
    return num.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  };

  const formatPercent = (num: number) => {
    const formatted = num.toFixed(2);
    return num >= 0 ? `+${formatted}%` : `${formatted}%`;
  };

  const getReturnColor = (value: number) => {
    if (value > 0) return '#10b981';
    if (value < 0) return '#ef4444';
    return '#6b7280';
  };

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Text style={styles.name}>{portfolio.name}</Text>
          <Text style={styles.fundCount}>
            {portfolio.funds.length} fon
          </Text>
        </View>
        <TouchableOpacity onPress={onDelete}>
          <Ionicons name="trash-outline" size={22} color="#ef4444" />
        </TouchableOpacity>
      </View>

      <View style={styles.valueContainer}>
        <View style={styles.valueItem}>
          <Text style={styles.valueLabel}>Toplam Değer</Text>
          <Text style={styles.valueAmount}>₺{formatNumber(portfolio.totalValue)}</Text>
        </View>
        <View style={styles.valueItem}>
          <Text style={styles.valueLabel}>Kazanç</Text>
          <Text style={[styles.valueAmount, { color: getReturnColor(portfolio.totalReturn) }]}>
            ₺{formatNumber(portfolio.totalReturn)}
          </Text>
          <Text style={[styles.percentValue, { color: getReturnColor(portfolio.totalReturn) }]}>
            {formatPercent(portfolio.totalReturnPercent)}
          </Text>
        </View>
      </View>

      {portfolio.funds.length > 0 && (
        <View style={styles.fundsContainer}>
          <Text style={styles.fundsTitle}>Fonlar</Text>
          {portfolio.funds.slice(0, 3).map((fund) => (
            <View key={fund.fundCode} style={styles.fundItem}>
              <Text style={styles.fundCode}>{fund.fundCode}</Text>
              <View style={styles.fundDetails}>
                <Text style={styles.fundQuantity}>{fund.quantity.toFixed(2)} adet</Text>
                <Text style={[styles.fundProfit, { color: getReturnColor(fund.profit) }]}>
                  {formatPercent(fund.profitPercent)}
                </Text>
              </View>
            </View>
          ))}
          {portfolio.funds.length > 3 && (
            <Text style={styles.moreFunds}>+{portfolio.funds.length - 3} fon daha</Text>
          )}
        </View>
      )}

      <Text style={styles.date}>
        Oluşturulma: {new Date(portfolio.createdAt).toLocaleDateString('tr-TR')}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  titleContainer: {
    flex: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 4,
  },
  fundCount: {
    fontSize: 13,
    color: '#6b7280',
  },
  valueContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  valueItem: {
    flex: 1,
  },
  valueLabel: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 4,
  },
  valueAmount: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
  },
  percentValue: {
    fontSize: 14,
    fontWeight: '600',
    marginTop: 2,
  },
  fundsContainer: {
    marginBottom: 12,
  },
  fundsTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#4b5563',
    marginBottom: 8,
  },
  fundItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
  },
  fundCode: {
    fontSize: 14,
    fontWeight: '500',
    color: '#111827',
  },
  fundDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  fundQuantity: {
    fontSize: 12,
    color: '#6b7280',
  },
  fundProfit: {
    fontSize: 13,
    fontWeight: '600',
  },
  moreFunds: {
    fontSize: 12,
    color: '#2563eb',
    marginTop: 4,
    fontWeight: '500',
  },
  date: {
    fontSize: 11,
    color: '#9ca3af',
    marginTop: 8,
  },
});
