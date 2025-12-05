import React, { useState, useEffect } from 'react';
import { TrendingUp, RefreshCw } from 'lucide-react';

interface Fund {
  id: string;
  name: string;
  type: string;
  price: number;
  change: number;
  changePercent: number;
}

export const FundsPage: React.FC = () => {
  const [funds, setFunds] = useState<Fund[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchFunds();
  }, []);

  const fetchFunds = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/tefas/funds`);
      
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
      ];
      
      setFunds(mockFunds);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="funds-page">
      <div className="funds-header">
        <h1>Investment Funds</h1>
        <button onClick={fetchFunds} className="refresh-button" disabled={loading}>
          <RefreshCw size={16} className={loading ? 'spinning' : ''} />
          Refresh
        </button>
      </div>

      {error && (
        <div className="error-message">
          <p>Error: {error}</p>
        </div>
      )}

      {loading ? (
        <div className="loading">Loading funds...</div>
      ) : (
        <div className="funds-grid">
          {funds.map((fund) => (
            <div key={fund.id} className="fund-card">
              <div className="fund-header">
                <h3>{fund.name}</h3>
                <span className="fund-type">{fund.type}</span>
              </div>
              <div className="fund-price">
                <span className="price">₺{fund.price.toFixed(2)}</span>
                <div className={`fund-change ${fund.change >= 0 ? 'positive' : 'negative'}`}>
                  <TrendingUp size={16} />
                  <span>{fund.change >= 0 ? '+' : ''}{fund.change.toFixed(2)} ({fund.changePercent.toFixed(2)}%)</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};