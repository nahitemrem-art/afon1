import { TefasApiFund, TefasScrapedFund } from './schema';
import { FundData } from './types';

const toNumber = (value: unknown | undefined): number | undefined => {
  if (value === null || value === undefined || value === '') return undefined;
  if (typeof value === 'number') return value;
  if (typeof value === 'string') {
    const normalized = value.replace(/[^0-9,.-]/g, '').replace(',', '.');
    const parsed = parseFloat(normalized);
    return isNaN(parsed) ? undefined : parsed;
  }
  return undefined;
};

export const normalizeApiFund = (fund: TefasApiFund): FundData => ({
  metadata: {
    code: fund.FonKod,
    title: fund.FonUnvan,
    type: fund.FonTuru,
    category: fund.Kategori,
    foundationDate: fund.KurulusTarihi,
    totalValue: toNumber(fund.ToplamDeger),
    totalShare: toNumber(fund.ToplamPay),
    investorCount: toNumber(fund.YatirimciSayisi),
  },
  performance: {
    code: fund.FonKod,
    date: fund.Tarih,
    price: toNumber(fund.Fiyat) || 0,
    dailyReturn: toNumber(fund.GunlukGetiri),
    monthlyReturn: toNumber(fund.AylikGetiri),
    threeMonthReturn: toNumber(fund.UcAylikGetiri),
    annualReturn: toNumber(fund.YillikGetiri),
    totalReturn: toNumber(fund.ToplamGetiri),
  },
});

export const normalizeScrapedFund = (fund: TefasScrapedFund): FundData => ({
  metadata: {
    code: fund.code,
    title: fund.title,
    type: fund.type,
    category: fund.category,
    foundationDate: fund.foundationDate,
    totalValue: toNumber(fund.totalValue),
    totalShare: toNumber(fund.totalShare),
    investorCount: toNumber(fund.investorCount),
  },
  performance: {
    code: fund.code,
    date: fund.date,
    price: toNumber(fund.price) || 0,
    dailyReturn: toNumber(fund.dailyReturn),
    monthlyReturn: toNumber(fund.monthlyReturn),
    threeMonthReturn: toNumber(fund.threeMonthReturn),
    annualReturn: toNumber(fund.annualReturn),
    totalReturn: toNumber(fund.totalReturn),
  },
});
