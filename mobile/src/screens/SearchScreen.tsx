import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Modal,
  Alert,
} from 'react-native';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Ionicons } from '@expo/vector-icons';
import { apiClient } from '../api/client';
import { favoritesApi } from '../api/favorites';
import { portfolioApi } from '../api/portfolio';

export default function SearchScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFund, setSelectedFund] = useState<any>(null);
  const [showPortfolioModal, setShowPortfolioModal] = useState(false);
  const [lotCount, setLotCount] = useState('');
  const [purchasePrice, setPurchasePrice] = useState('');
  const queryClient = useQueryClient();

  const { data: searchResults, isLoading, refetch } = useQuery({
    queryKey: ['search', searchQuery],
    queryFn: async () => {
      if (searchQuery.length < 2) return { data: [] };
      const response = await apiClient.get('/search', { params: { q: searchQuery } });
      return response.data;
    },
    enabled: searchQuery.length >= 2,
  });

  const { data: portfolios } = useQuery({
    queryKey: ['portfolios'],
    queryFn: portfolioApi.getAll,
  });

  const addToFavoritesMutation = useMutation({
    mutationFn: (fundCode: string) => favoritesApi.add(fundCode),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['favorites'] });
      Alert.alert('Başarılı', 'Fon favorilere eklendi');
    },
    onError: () => {
      Alert.alert('Hata', 'Favorilere eklenemedi');
    },
  });

  const addToPortfolioMutation = useMutation({
    mutationFn: ({
      portfolioId,
      fundCode,
      quantity,
      price,
    }: {
      portfolioId: string;
      fundCode: string;
      quantity: number;
      price: number;
    }) => portfolioApi.addFund(portfolioId, fundCode, quantity, price),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['portfolios'] });
      setShowPortfolioModal(false);
      setSelectedFund(null);
      setLotCount('');
      setPurchasePrice('');
      Alert.alert('Başarılı', 'Fon portföye eklendi');
    },
    onError: () => {
      Alert.alert('Hata', 'Portföye eklenemedi');
    },
  });

  const handleAddToFavorites = (fundCode: string) => {
    addToFavoritesMutation.mutate(fundCode);
  };

  const handleShowPortfolioModal = (fund: any) => {
    setSelectedFund(fund);
    setPurchasePrice(fund.price.toString());
    setShowPortfolioModal(true);
  };

  const handleAddToPortfolio = (portfolioId: string) => {
    if (!selectedFund || !lotCount || !purchasePrice) {
      Alert.alert('Uyarı', 'Lütfen tüm alanları doldurun');
      return;
    }

    const quantity = parseFloat(lotCount);
    const price = parseFloat(purchasePrice);

    if (isNaN(quantity) || quantity <= 0) {
      Alert.alert('Uyarı', 'Geçerli bir lot sayısı girin');
      return;
    }

    if (isNaN(price) || price <= 0) {
      Alert.alert('Uyarı', 'Geçerli bir fiyat girin');
      return;
    }

    addToPortfolioMutation.mutate({
      portfolioId,
      fundCode: selectedFund.code,
      quantity,
      price,
    });
  };

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
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#6b7280" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Fon kodu veya adı ile ara... (örn: ABD, GAR)"
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholderTextColor="#9ca3af"
          autoCapitalize="characters"
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <Ionicons name="close-circle" size={20} color="#6b7280" />
          </TouchableOpacity>
        )}
      </View>

      {searchQuery.length < 2 && (
        <View style={styles.instructionsContainer}>
          <Ionicons name="information-circle-outline" size={64} color="#d1d5db" />
          <Text style={styles.instructionsTitle}>Fon Ara</Text>
          <Text style={styles.instructionsText}>
            TEFAS'ta bulunan tüm fonları arayabilirsiniz
          </Text>
          <Text style={styles.instructionsText}>
            En az 2 karakter girin
          </Text>
          <View style={styles.examplesContainer}>
            <Text style={styles.examplesTitle}>Örnek aramalar:</Text>
            <Text style={styles.exampleText}>• ABD (A tipi fonlar)</Text>
            <Text style={styles.exampleText}>• GAR (Garanti bankası fonları)</Text>
            <Text style={styles.exampleText}>• HBB (Halkbank)</Text>
          </View>
        </View>
      )}

      {isLoading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#2563eb" />
          <Text style={styles.loadingText}>Aranıyor...</Text>
        </View>
      )}

      {!isLoading && searchQuery.length >= 2 && (
        <FlatList
          data={searchResults?.data || []}
          keyExtractor={(item) => item.code}
          renderItem={({ item }) => (
            <View style={styles.fundCard}>
              <View style={styles.fundHeader}>
                <View style={styles.fundInfo}>
                  <Text style={styles.fundCode}>{item.code}</Text>
                  <Text style={styles.fundName} numberOfLines={2}>
                    {item.name}
                  </Text>
                </View>
              </View>

              <View style={styles.fundDetails}>
                <View style={styles.priceContainer}>
                  <Text style={styles.priceLabel}>Fiyat</Text>
                  <Text style={styles.price}>₺{formatNumber(item.price, 6)}</Text>
                </View>

                <View style={styles.returnsRow}>
                  <View style={styles.returnItem}>
                    <Text style={styles.returnLabel}>Günlük</Text>
                    <Text style={[styles.returnValue, { color: getReturnColor(item.dailyReturn) }]}>
                      {formatPercent(item.dailyReturn)}
                    </Text>
                  </View>
                  <View style={styles.returnItem}>
                    <Text style={styles.returnLabel}>Aylık</Text>
                    <Text style={[styles.returnValue, { color: getReturnColor(item.monthlyReturn) }]}>
                      {formatPercent(item.monthlyReturn)}
                    </Text>
                  </View>
                  <View style={styles.returnItem}>
                    <Text style={styles.returnLabel}>Yıllık</Text>
                    <Text style={[styles.returnValue, { color: getReturnColor(item.yearlyReturn) }]}>
                      {formatPercent(item.yearlyReturn)}
                    </Text>
                  </View>
                </View>
              </View>

              <View style={styles.actionsContainer}>
                <TouchableOpacity
                  style={[styles.actionButton, styles.favoriteButton]}
                  onPress={() => handleAddToFavorites(item.code)}
                >
                  <Ionicons name="star" size={20} color="#fbbf24" />
                  <Text style={styles.actionButtonText}>Favoriye Ekle</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.actionButton, styles.portfolioButton]}
                  onPress={() => handleShowPortfolioModal(item)}
                >
                  <Ionicons name="wallet" size={20} color="#fff" />
                  <Text style={styles.portfolioButtonText}>Portföye Ekle</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
          contentContainerStyle={styles.listContainer}
          ListEmptyComponent={
            searchQuery.length >= 2 && !isLoading ? (
              <View style={styles.emptyContainer}>
                <Ionicons name="search-outline" size={64} color="#d1d5db" />
                <Text style={styles.emptyText}>
                  "{searchQuery}" için sonuç bulunamadı
                </Text>
                <Text style={styles.emptySubText}>
                  Farklı bir arama deneyin
                </Text>
              </View>
            ) : null
          }
        />
      )}

      <Modal
        visible={showPortfolioModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowPortfolioModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Portföye Ekle</Text>
              <TouchableOpacity onPress={() => setShowPortfolioModal(false)}>
                <Ionicons name="close" size={24} color="#6b7280" />
              </TouchableOpacity>
            </View>

            {selectedFund && (
              <View style={styles.selectedFundInfo}>
                <Text style={styles.selectedFundCode}>{selectedFund.code}</Text>
                <Text style={styles.selectedFundName} numberOfLines={2}>
                  {selectedFund.name}
                </Text>
                <Text style={styles.selectedFundPrice}>
                  Güncel Fiyat: ₺{formatNumber(selectedFund.price, 6)}
                </Text>
              </View>
            )}

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Lot Sayısı</Text>
              <TextInput
                style={styles.input}
                value={lotCount}
                onChangeText={setLotCount}
                placeholder="Örn: 100"
                keyboardType="numeric"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Alış Fiyatı (₺)</Text>
              <TextInput
                style={styles.input}
                value={purchasePrice}
                onChangeText={setPurchasePrice}
                placeholder="Örn: 0.025679"
                keyboardType="decimal-pad"
              />
            </View>

            {lotCount && purchasePrice && (
              <View style={styles.totalContainer}>
                <Text style={styles.totalLabel}>Toplam Tutar:</Text>
                <Text style={styles.totalValue}>
                  ₺{formatNumber(parseFloat(lotCount) * parseFloat(purchasePrice), 2)}
                </Text>
              </View>
            )}

            <Text style={styles.portfolioListTitle}>Portföy Seçin:</Text>
            
            <FlatList
              data={portfolios || []}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.portfolioItem}
                  onPress={() => handleAddToPortfolio(item.id)}
                >
                  <View style={styles.portfolioItemContent}>
                    <Ionicons name="wallet" size={20} color="#2563eb" />
                    <Text style={styles.portfolioItemName}>{item.name}</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
                </TouchableOpacity>
              )}
              style={styles.portfolioList}
              ListEmptyComponent={
                <Text style={styles.noPortfoliosText}>
                  Henüz portföy oluşturmadınız. Portföy sekmesinden oluşturabilirsiniz.
                </Text>
              }
            />
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
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
  instructionsContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  instructionsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
    marginTop: 16,
    marginBottom: 8,
  },
  instructionsText: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 4,
  },
  examplesContainer: {
    marginTop: 24,
    padding: 16,
    backgroundColor: '#f3f4f6',
    borderRadius: 8,
  },
  examplesTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  exampleText: {
    fontSize: 13,
    color: '#6b7280',
    marginBottom: 4,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: '#6b7280',
  },
  listContainer: {
    padding: 16,
  },
  fundCard: {
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
  fundHeader: {
    marginBottom: 12,
  },
  fundInfo: {
    flex: 1,
  },
  fundCode: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 4,
  },
  fundName: {
    fontSize: 13,
    color: '#6b7280',
    lineHeight: 18,
  },
  fundDetails: {
    marginBottom: 16,
  },
  priceContainer: {
    marginBottom: 12,
  },
  priceLabel: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 4,
  },
  price: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
  },
  returnsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
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
  actionsContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 8,
    gap: 6,
  },
  favoriteButton: {
    backgroundColor: '#fef3c7',
  },
  portfolioButton: {
    backgroundColor: '#2563eb',
  },
  actionButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#92400e',
  },
  portfolioButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#fff',
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
    textAlign: 'center',
  },
  emptySubText: {
    marginTop: 8,
    fontSize: 14,
    color: '#9ca3af',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
  },
  selectedFundInfo: {
    padding: 16,
    backgroundColor: '#f3f4f6',
    borderRadius: 12,
    marginBottom: 20,
  },
  selectedFundCode: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 4,
  },
  selectedFundName: {
    fontSize: 13,
    color: '#6b7280',
    marginBottom: 8,
  },
  selectedFundPrice: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2563eb',
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#111827',
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#eff6ff',
    borderRadius: 8,
    marginBottom: 20,
  },
  totalLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1e40af',
  },
  totalValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1e40af',
  },
  portfolioListTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 12,
  },
  portfolioList: {
    maxHeight: 200,
  },
  portfolioItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#f9fafb',
    borderRadius: 8,
    marginBottom: 8,
  },
  portfolioItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  portfolioItemName: {
    fontSize: 15,
    fontWeight: '500',
    color: '#111827',
  },
  noPortfoliosText: {
    fontSize: 13,
    color: '#6b7280',
    textAlign: 'center',
    padding: 20,
  },
});
