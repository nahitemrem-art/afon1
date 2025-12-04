import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Fund } from '../../../shared/types';

interface FundCardProps {
  fund: Fund;
  onToggleFavorite: (fundCode: string, isFavorite: boolean) => void;
  isFavorite?: boolean;
}

export default function FundCard({ fund, onToggleFavorite, isFavorite = false }: FundCardProps) {
  const formatNumber = (num: number, decimals: number = 2) => {
    return num.toFixed(decimals).replace(/\B(?=(\d{3})+(?!\d))/g, '.');
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
          <Text style={styles.code}>{fund.code}</Text>
          <Text style={styles.name} numberOfLines={2}>
            {fund.name}
          </Text>
        </View>
        <TouchableOpacity onPress={() => onToggleFavorite(fund.code, isFavorite)}>
          <Ionicons
            name={isFavorite ? 'star' : 'star-outline'}
            size={24}
            color={isFavorite ? '#fbbf24' : '#9ca3af'}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.priceContainer}>
        <Text style={styles.price}>₺{formatNumber(fund.price, 6)}</Text>
        <Text style={styles.date}>{fund.date}</Text>
      </View>

      <View style={styles.returnsContainer}>
        <View style={styles.returnItem}>
          <Text style={styles.returnLabel}>Günlük</Text>
          <Text style={[styles.returnValue, { color: getReturnColor(fund.dailyReturn) }]}>
            {formatPercent(fund.dailyReturn)}
          </Text>
        </View>
        <View style={styles.returnItem}>
          <Text style={styles.returnLabel}>Aylık</Text>
          <Text style={[styles.returnValue, { color: getReturnColor(fund.monthlyReturn) }]}>
            {formatPercent(fund.monthlyReturn)}
          </Text>
        </View>
        <View style={styles.returnItem}>
          <Text style={styles.returnLabel}>3 Aylık</Text>
          <Text style={[styles.returnValue, { color: getReturnColor(fund.threeMonthReturn) }]}>
            {formatPercent(fund.threeMonthReturn)}
          </Text>
        </View>
        <View style={styles.returnItem}>
          <Text style={styles.returnLabel}>Yıllık</Text>
          <Text style={[styles.returnValue, { color: getReturnColor(fund.yearlyReturn) }]}>
            {formatPercent(fund.yearlyReturn)}
          </Text>
        </View>
      </View>

      {fund.category && (
        <View style={styles.categoryContainer}>
          <Text style={styles.category}>{fund.category}</Text>
        </View>
      )}
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
    marginBottom: 12,
  },
  titleContainer: {
    flex: 1,
    marginRight: 12,
  },
  code: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 4,
  },
  name: {
    fontSize: 13,
    color: '#6b7280',
    lineHeight: 18,
  },
  priceContainer: {
    marginBottom: 16,
  },
  price: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 4,
  },
  date: {
    fontSize: 12,
    color: '#9ca3af',
  },
  returnsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  returnItem: {
    alignItems: 'center',
  },
  returnLabel: {
    fontSize: 11,
    color: '#6b7280',
    marginBottom: 4,
  },
  returnValue: {
    fontSize: 14,
    fontWeight: '600',
  },
  categoryContainer: {
    marginTop: 8,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
  },
  category: {
    fontSize: 12,
    color: '#2563eb',
    fontWeight: '500',
  },
});
