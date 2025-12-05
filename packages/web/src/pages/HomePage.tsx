import React from 'react';
import { TrendingUp, BarChart3, Shield } from 'lucide-react';

export const HomePage: React.FC = () => {
  return (
    <div className="home-page">
      <div className="hero-section">
        <h1>Welcome to Afon1</h1>
        <p>Your comprehensive platform for investment fund management and analysis</p>
      </div>
      
      <div className="features-section">
        <div className="feature-card">
          <TrendingUp size={48} className="feature-icon" />
          <h3>Real-time Data</h3>
          <p>Access up-to-date fund information from TEFAS</p>
        </div>
        
        <div className="feature-card">
          <BarChart3 size={48} className="feature-icon" />
          <h3>Analytics</h3>
          <p>Comprehensive analysis tools for informed decisions</p>
        </div>
        
        <div className="feature-card">
          <Shield size={48} className="feature-icon" />
          <h3>Secure</h3>
          <p>Enterprise-grade security for your financial data</p>
        </div>
      </div>
    </div>
  );
};