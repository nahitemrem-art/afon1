# Features Documentation

## 1. Fund Information

### Overview
Browse and search through all TEFAS funds with comprehensive information.

### Key Features
- **Real-time Data**: Fund prices and returns updated daily from TEFAS
- **Multiple Timeframes**: View returns for different periods:
  - Daily (Günlük)
  - Weekly (Haftalık)
  - Monthly (Aylık)
  - 3-Month (3 Aylık)
  - 6-Month (6 Aylık)
  - Yearly (Yıllık)
- **Search**: Find funds by name or code
- **Sort**: Sort by name, daily, monthly, or yearly returns
- **Filter**: Filter by fund category
- **Pagination**: Load more funds as you scroll

### Fund Details
Each fund card displays:
- Fund code and name
- Current price (up to 6 decimal places)
- Last update date
- Returns for all timeframes
- Fund category
- Favorite status

## 2. Favorites

### Overview
Save your frequently watched funds for quick access.

### Key Features
- **Quick Add**: Add funds to favorites with a single tap
- **Instant Access**: View all favorite funds in one place
- **Remove**: Remove funds from favorites easily
- **Persistence**: Favorites are saved and persist across sessions

### Use Cases
- Track specific funds you're interested in
- Monitor funds you own
- Keep an eye on potential investments

## 3. Portfolio Management

### Overview
Create and manage multiple portfolios to track your investments.

### Key Features
- **Multiple Portfolios**: Create separate portfolios for different strategies
- **Add Funds**: Add funds with quantity and purchase price
- **Automatic Calculations**: 
  - Total portfolio value
  - Total cost basis
  - Profit/loss in TL
  - Profit/loss percentage
- **Fund Details**: View quantity, average price, and current value for each fund
- **Delete**: Remove individual funds or entire portfolios

### Portfolio Metrics
Each portfolio shows:
- Portfolio name
- Number of funds
- Total current value
- Total profit/loss (TL)
- Total return percentage
- Creation date

### Fund Tracking
For each fund in a portfolio:
- Fund code
- Quantity owned
- Average purchase price
- Current price
- Total value
- Total cost
- Profit/loss (TL)
- Return percentage

## 4. Live Intraday Returns

### Overview
View estimated intraday returns for funds during trading hours.

### Key Features
- **Real-time Estimates**: Updated every minute
- **Current vs Estimated**: See both current and estimated prices
- **Confidence Level**: Each estimate includes a confidence indicator
- **Auto-refresh**: Automatically refreshes to show latest data

### Estimate Details
Each live estimate shows:
- Fund code and name
- Current closing price
- Estimated intraday price
- Estimated return percentage
- Confidence level (High/Medium/Low)
- Last update timestamp

### Confidence Indicators
- **High (80%+)**: Strong market correlation, reliable estimate
- **Medium (60-80%)**: Moderate correlation
- **Low (<60%)**: Weak correlation, less reliable

### How It Works
Live estimates are calculated based on:
- Historical fund performance
- Current market indices (BIST 100)
- Fund composition and weightings
- Real-time market movements

**Note**: These are estimates only and may differ from actual fund prices published at end of day.

## Cross-Platform Support

### Web
- Fully responsive design
- Works on all modern browsers
- Desktop and mobile layouts

### Android
- Native Android app experience
- Optimized performance
- Offline data caching

### Shared Features
All features work identically across platforms:
- Same data and functionality
- Synchronized favorites and portfolios
- Consistent user interface

## Data Sources

### TEFAS API
- Official Turkish mutual funds platform
- Daily fund prices and returns
- Historical data
- Fund categories and details

### Update Schedule
- **Daily Data**: Updated after market close (around 6 PM)
- **Live Estimates**: Updated every 5 minutes during trading hours
- **Historical Data**: Available for up to 1 year

## Performance

### Optimization
- Efficient data caching
- Pagination for large lists
- Lazy loading of images
- Optimized API calls

### Offline Support
- Fund data cached locally
- Favorites stored on device
- Portfolios saved locally
- Works without internet after initial load

## Privacy & Security

- All data stored locally on your device
- No user accounts required
- No personal data collected
- No third-party tracking

## Future Enhancements

Planned features:
- Fund comparison tool
- Advanced filtering options
- Price alerts and notifications
- Export portfolio to Excel
- Fund news and analysis
- Performance charts and graphs
- Transaction history
- Tax calculations
