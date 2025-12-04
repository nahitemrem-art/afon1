import axios from 'axios';
import * as cheerio from 'cheerio';
import { Fund, PriceHistory } from '../../../shared/types';

const TEFAS_BASE_URL = 'https://www.tefas.gov.tr';
const TEFAS_API_URL = 'https://www.tefas.gov.tr/api/DB/BindComparisonFundReturns';

interface TefasFundData {
  FONKODU: string;
  FONUNVAN: string;
  FIYAT: string;
  TARIH: string;
  FONTIPI: string;
  TOPLAM_DEGER: string;
}

export async function fetchAllFunds(): Promise<Fund[]> {
  try {
    const today = new Date();
    const startDate = new Date(today.getTime() - 365 * 24 * 60 * 60 * 1000);
    
    const formatDate = (date: Date) => {
      return date.toISOString().split('T')[0];
    };

    const response = await axios.post(TEFAS_API_URL, {
      fontip: 'YAT',
      sfontur: '',
      bastarih: formatDate(startDate),
      bittarih: formatDate(today),
      fonkod: ''
    });

    if (!response.data || !Array.isArray(response.data.data)) {
      console.warn('No fund data received from TEFAS API');
      return [];
    }

    const funds: Fund[] = response.data.data.map((item: any) => {
      const price = parseFloat(item.FIYAT) || 0;
      const previousPrice = parseFloat(item.ONCEKI_FIYAT) || price;
      const dailyReturn = previousPrice > 0 ? ((price - previousPrice) / previousPrice) * 100 : 0;

      return {
        id: item.FONKODU,
        code: item.FONKODU,
        name: item.FONUNVAN || item.FONKODU,
        price,
        date: item.TARIH,
        dailyReturn,
        weeklyReturn: parseFloat(item.HAFTALIK) || 0,
        monthlyReturn: parseFloat(item.AYLIK) || 0,
        threeMonthReturn: parseFloat(item.UC_AYLIK) || 0,
        sixMonthReturn: parseFloat(item.ALTI_AYLIK) || 0,
        yearlyReturn: parseFloat(item.YILLIK) || 0,
        category: item.FONTIPI || 'Diğer',
        totalValue: parseFloat(item.TOPLAM_DEGER) || 0
      };
    });

    return funds;
  } catch (error) {
    console.error('Error fetching funds from TEFAS:', error);
    return [];
  }
}

export async function fetchFundDetail(fundCode: string): Promise<Fund | null> {
  try {
    const response = await axios.get(
      `${TEFAS_BASE_URL}/FonAnaliz.aspx?FonKod=${fundCode}`
    );

    const $ = cheerio.load(response.data);
    
    return null;
  } catch (error) {
    console.error(`Error fetching fund detail for ${fundCode}:`, error);
    return null;
  }
}

export async function fetchPriceHistory(
  fundCode: string,
  startDate: Date,
  endDate: Date
): Promise<PriceHistory[]> {
  try {
    const formatDate = (date: Date) => {
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const year = date.getFullYear();
      return `${day}.${month}.${year}`;
    };

    const response = await axios.post(
      'https://www.tefas.gov.tr/api/DB/BindHistoryInfo',
      {
        fontip: 'YAT',
        fonkod: fundCode,
        bastarih: formatDate(startDate),
        bittarih: formatDate(endDate)
      }
    );

    if (!response.data || !Array.isArray(response.data.data)) {
      return [];
    }

    const history: PriceHistory[] = response.data.data.map((item: any) => ({
      date: item.TARIH,
      price: parseFloat(item.FIYAT) || 0,
      change: parseFloat(item.DEĞIŞIM) || 0,
      changePercent: parseFloat(item.DEĞIŞIM_YÜZDE) || 0
    }));

    return history.reverse();
  } catch (error) {
    console.error(`Error fetching price history for ${fundCode}:`, error);
    return [];
  }
}

export async function fetchFundPortfolio(fundCode: string): Promise<any> {
  try {
    return null;
  } catch (error) {
    console.error(`Error fetching portfolio for ${fundCode}:`, error);
    return null;
  }
}

export function calculateReturns(
  currentPrice: number,
  prices: PriceHistory[]
): Partial<Fund> {
  const calculateReturn = (daysAgo: number): number => {
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() - daysAgo);
    
    const historicalPrice = prices.find(p => {
      const priceDate = new Date(p.date);
      return priceDate <= targetDate;
    });

    if (!historicalPrice || historicalPrice.price === 0) return 0;
    return ((currentPrice - historicalPrice.price) / historicalPrice.price) * 100;
  };

  return {
    dailyReturn: prices.length > 0 ? calculateReturn(1) : 0,
    weeklyReturn: calculateReturn(7),
    monthlyReturn: calculateReturn(30),
    threeMonthReturn: calculateReturn(90),
    sixMonthReturn: calculateReturn(180),
    yearlyReturn: calculateReturn(365)
  };
}
