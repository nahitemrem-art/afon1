import React from 'react';
import { Link } from 'react-router-dom';
import { TrendingUp, Home } from 'lucide-react';

export const Navbar: React.FC = () => {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-brand">
          <TrendingUp size={24} />
          <span>Afon1</span>
        </div>
        <div className="navbar-links">
          <Link to="/" className="navbar-link">
            <Home size={18} />
            <span>Home</span>
          </Link>
          <Link to="/funds" className="navbar-link">
            <TrendingUp size={18} />
            <span>Funds</span>
          </Link>
        </div>
      </div>
    </nav>
  );
};