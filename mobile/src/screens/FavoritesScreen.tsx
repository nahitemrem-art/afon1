import React from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { Ionicons } from '@expo/vector-icons';
import { favoritesApi } from '../api/favorites';
import FundCard from '../components/FundCard';

export default function FavoritesScreen() {
  const { data: favorites, isLoading, refetch, isRefetching } = useQuery({
    queryKey: ['favorites'],
    queryFn: favoritesApi.getAll,
  });

  const handleToggleFavorite = async (fundCode: string) => {
    try {
      await favoritesApi.remove(fundCode);
      refetch();
    } catch (error) {
      console.error('Error removing favorite:', error);
    }
  };

  if (isLoading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#2563eb" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={favorites || []}
        keyExtractor={(item) => item.code}
        renderItem={({ item }) => (
          <FundCard fund={item} onToggleFavorite={handleToggleFavorite} isFavorite />
        )}
        contentContainerStyle={styles.listContainer}
        refreshControl={
          <RefreshControl refreshing={isRefetching} onRefresh={refetch} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="star-outline" size={64} color="#d1d5db" />
            <Text style={styles.emptyText}>Henüz favori fon eklemediniz</Text>
            <Text style={styles.emptySubText}>
              Fonlar sekmesinden favorilerinize ekleyin
            </Text>
          </View>
        }
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
  listContainer: {
    padding: 16,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 64,
  },
  emptyText: {
    marginTop: 16,
    fontSize: 16,
    color: '#4b5563',
    fontWeight: '600',
  },
  emptySubText: {
    marginTop: 8,
    fontSize: 14,
    color: '#9ca3af',
  },
});
