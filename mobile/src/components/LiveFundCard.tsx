import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LiveReturn } from '../../../shared/types';

interface LiveFundCardProps {
  liveReturn: any;
}

export default function LiveFundCard({ liveReturn }: LiveFundCardProps) {
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

  const getConfidenceText = (confidence: number) => {
    if (confidence >= 0.8) return 'Yüksek';
    if (confidence >= 0.6) return 'Orta';
    return 'Düşük';
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return '#10b981';
    if (confidence >= 0.6) return '#f59e0b';
    return '#ef4444';
  };

  const timeSince = (dateString: string) => {
    const date = new Date(dateString);
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
    
    if (seconds < 60) return `${seconds} saniye önce`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes} dakika önce`;
    const hours = Math.floor(minutes / 60);
    return `${hours} saat önce`;
  };

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Text style={styles.code}>{liveReturn.fundCode}</Text>
          <Text style={styles.name} numberOfLines={1}>
            {liveReturn.fundName}
          </Text>
        </View>
        <View style={styles.liveIndicator}>
          <View style={styles.liveDot} />
          <Text style={styles.liveText}>CANLI</Text>
        </View>
      </View>

      <View style={styles.pricesContainer}>
        <View style={styles.priceItem}>
          <Text style={styles.priceLabel}>Mevcut Fiyat</Text>
          <Text style={styles.price}>₺{formatNumber(liveReturn.currentPrice, 6)}</Text>
        </View>
        <Ionicons name="arrow-forward" size={20} color="#9ca3af" />
        <View style={styles.priceItem}>
          <Text style={styles.priceLabel}>Tahmini Fiyat</Text>
          <Text style={[styles.price, { color: getReturnColor(liveReturn.estimatedReturn) }]}>
            ₺{formatNumber(liveReturn.estimatedPrice, 6)}
          </Text>
        </View>
      </View>

      <View style={styles.returnContainer}>
        <View style={styles.returnBox}>
          <Text style={styles.returnLabel}>Tahmini Getiri</Text>
          <Text style={[styles.returnValue, { color: getReturnColor(liveReturn.estimatedReturnPercent) }]}>
            {formatPercent(liveReturn.estimatedReturnPercent)}
          </Text>
        </View>
        <View style={styles.confidenceBox}>
          <Text style={styles.confidenceLabel}>Güven</Text>
          <Text style={[styles.confidenceValue, { color: getConfidenceColor(liveReturn.confidence) }]}>
            {getConfidenceText(liveReturn.confidence)}
          </Text>
          <Text style={styles.confidencePercent}>
            {(liveReturn.confidence * 100).toFixed(0)}%
          </Text>
        </View>
      </View>

      <View style={styles.footer}>
        <Ionicons name="time-outline" size={12} color="#9ca3af" />
        <Text style={styles.timestamp}>{timeSince(liveReturn.lastUpdated)}</Text>
      </View>
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
    borderLeftWidth: 4,
    borderLeftColor: '#2563eb',
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
  code: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 2,
  },
  name: {
    fontSize: 12,
    color: '#6b7280',
  },
  liveIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fef2f2',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    gap: 4,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#ef4444',
  },
  liveText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#ef4444',
  },
  pricesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  priceItem: {
    flex: 1,
  },
  priceLabel: {
    fontSize: 11,
    color: '#6b7280',
    marginBottom: 4,
  },
  price: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#111827',
  },
  returnContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  returnBox: {
    flex: 1,
    backgroundColor: '#f9fafb',
    padding: 12,
    borderRadius: 8,
  },
  returnLabel: {
    fontSize: 11,
    color: '#6b7280',
    marginBottom: 4,
  },
  returnValue: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  confidenceBox: {
    flex: 1,
    backgroundColor: '#f9fafb',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  confidenceLabel: {
    fontSize: 11,
    color: '#6b7280',
    marginBottom: 4,
  },
  confidenceValue: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  confidencePercent: {
    fontSize: 11,
    color: '#9ca3af',
    marginTop: 2,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  timestamp: {
    fontSize: 11,
    color: '#9ca3af',
  },
});
