import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { Ionicons } from '@expo/vector-icons';
import { fundsApi } from '../api/funds';
import { favoritesApi } from '../api/favorites';
import FundCard from '../components/FundCard';

export default function FundsScreen() {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const { data, isLoading, refetch, isRefetching } = useQuery({
    queryKey: ['funds', page, search, sortBy, sortOrder],
    queryFn: () => fundsApi.getAll({ page, limit: 20, search, sortBy, sortOrder }),
  });

  const handleToggleFavorite = async (fundCode: string, isFavorite: boolean) => {
    try {
      if (isFavorite) {
        await favoritesApi.remove(fundCode);
      } else {
        await favoritesApi.add(fundCode);
      }
      refetch();
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  const renderSortButton = (field: string, label: string) => (
    <TouchableOpacity
      style={[styles.sortButton, sortBy === field && styles.sortButtonActive]}
      onPress={() => {
        if (sortBy === field) {
          setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
          setSortBy(field);
          setSortOrder('desc');
        }
      }}
    >
      <Text style={[styles.sortButtonText, sortBy === field && styles.sortButtonTextActive]}>
        {label}
      </Text>
      {sortBy === field && (
        <Ionicons
          name={sortOrder === 'asc' ? 'arrow-up' : 'arrow-down'}
          size={14}
          color="#fff"
        />
      )}
    </TouchableOpacity>
  );

  if (isLoading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#2563eb" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#6b7280" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Fon ara..."
          value={search}
          onChangeText={setSearch}
          placeholderTextColor="#9ca3af"
        />
        {search.length > 0 && (
          <TouchableOpacity onPress={() => setSearch('')}>
            <Ionicons name="close-circle" size={20} color="#6b7280" />
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.sortContainer}>
        {renderSortButton('name', 'İsim')}
        {renderSortButton('daily_return', 'Günlük')}
        {renderSortButton('monthly_return', 'Aylık')}
        {renderSortButton('yearly_return', 'Yıllık')}
      </View>

      <FlatList
        data={data?.data || []}
        keyExtractor={(item) => item.code}
        renderItem={({ item }) => (
          <FundCard fund={item} onToggleFavorite={handleToggleFavorite} />
        )}
        contentContainerStyle={styles.listContainer}
        refreshControl={
          <RefreshControl refreshing={isRefetching} onRefresh={refetch} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="folder-open-outline" size={64} color="#d1d5db" />
            <Text style={styles.emptyText}>Fon bulunamadı</Text>
          </View>
        }
        onEndReached={() => {
          if (data && page < data.totalPages) {
            setPage(page + 1);
          }
        }}
        onEndReachedThreshold={0.5}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    margin: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#111827',
  },
  sortContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginBottom: 12,
    gap: 8,
  },
  sortButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#e5e7eb',
    gap: 4,
  },
  sortButtonActive: {
    backgroundColor: '#2563eb',
  },
  sortButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#4b5563',
  },
  sortButtonTextActive: {
    color: '#fff',
  },
  listContainer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 64,
  },
  emptyText: {
    marginTop: 16,
    fontSize: 16,
    color: '#9ca3af',
    fontWeight: '500',
  },
});
