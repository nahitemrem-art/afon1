import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Link } from 'expo-router';
import { TrendingUp, BarChart3, Shield } from '@expo/vector-icons';

export default function HomePage() {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.hero}>
        <Text style={styles.title}>Welcome to Afon1</Text>
        <Text style={styles.subtitle}>
          Your comprehensive platform for investment fund management and analysis
        </Text>
      </View>

      <View style={styles.features}>
        <View style={styles.featureCard}>
          <TrendingUp size={48} color="#3b82f6" />
          <Text style={styles.featureTitle}>Real-time Data</Text>
          <Text style={styles.featureDescription}>
            Access up-to-date fund information from TEFAS
          </Text>
        </View>

        <View style={styles.featureCard}>
          <BarChart3 size={48} color="#3b82f6" />
          <Text style={styles.featureTitle}>Analytics</Text>
          <Text style={styles.featureDescription}>
            Comprehensive analysis tools for informed decisions
          </Text>
        </View>

        <View style={styles.featureCard}>
          <Shield size={48} color="#3b82f6" />
          <Text style={styles.featureTitle}>Secure</Text>
          <Text style={styles.featureDescription}>
            Enterprise-grade security for your financial data
          </Text>
        </View>
      </View>

      <View style={styles.actions}>
        <Link href="/funds" asChild>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>View Funds</Text>
          </TouchableOpacity>
        </Link>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  hero: {
    padding: 24,
    alignItems: 'center',
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
    color: '#1e293b',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    color: '#64748b',
    lineHeight: 24,
  },
  features: {
    padding: 24,
    gap: 16,
  },
  featureCard: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  featureTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 12,
    marginBottom: 8,
    color: '#1e293b',
  },
  featureDescription: {
    fontSize: 14,
    textAlign: 'center',
    color: '#64748b',
    lineHeight: 20,
  },
  actions: {
    padding: 24,
  },
  button: {
    backgroundColor: '#3b82f6',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});