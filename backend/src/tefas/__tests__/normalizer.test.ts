import { normalizeApiFund, normalizeScrapedFund } from '../normalizer';
import { TefasApiFund, TefasScrapedFund } from '../schema';

describe('TEFAS Normalizer', () => {
  it('normalizes API fund data correctly', () => {
    const apiFund: TefasApiFund = {
      FonKod: 'ABC',
      FonUnvan: 'ABC Fund',
      FonTuru: 'Hisse',
      Kategori: 'Equity',
      KurulusTarihi: '2015-01-01',
      ToplamDeger: '123456.78',
      ToplamPay: '1000000',
      YatirimciSayisi: '500',
      Fiyat: '1.2345',
      GunlukGetiri: '0.12',
      AylikGetiri: '1.5',
      UcAylikGetiri: '4.2',
      YillikGetiri: '15.8',
      ToplamGetiri: '120.5',
      Tarih: '2023-12-05',
    };

    const normalized = normalizeApiFund(apiFund);

    expect(normalized.metadata.code).toBe('ABC');
    expect(normalized.metadata.title).toBe('ABC Fund');
    expect(normalized.performance.price).toBeCloseTo(1.2345);
    expect(normalized.performance.dailyReturn).toBeCloseTo(0.12);
    expect(normalized.performance.monthlyReturn).toBeCloseTo(1.5);
    expect(normalized.performance.threeMonthReturn).toBeCloseTo(4.2);
    expect(normalized.performance.annualReturn).toBeCloseTo(15.8);
    expect(normalized.performance.totalReturn).toBeCloseTo(120.5);
  });

  it('normalizes scraped fund data correctly', () => {
    const scrapedFund: TefasScrapedFund = {
      code: 'XYZ',
      title: 'XYZ Fund',
      type: 'Karma',
      category: 'Balanced',
      foundationDate: '2018-06-15',
      totalValue: '987654.32',
      totalShare: '500000',
      investorCount: '800',
      price: '2.3456',
      dailyReturn: '0,45',
      monthlyReturn: '2,4',
      threeMonthReturn: '5,8',
      annualReturn: '18,2',
      totalReturn: '150,6',
      date: '2023-12-05',
    };

    const normalized = normalizeScrapedFund(scrapedFund);

    expect(normalized.metadata.code).toBe('XYZ');
    expect(normalized.metadata.title).toBe('XYZ Fund');
    expect(normalized.metadata.totalValue).toBeCloseTo(987654.32);
    expect(normalized.performance.price).toBeCloseTo(2.3456);
    expect(normalized.performance.dailyReturn).toBeCloseTo(0.45);
    expect(normalized.performance.monthlyReturn).toBeCloseTo(2.4);
    expect(normalized.performance.threeMonthReturn).toBeCloseTo(5.8);
    expect(normalized.performance.annualReturn).toBeCloseTo(18.2);
    expect(normalized.performance.totalReturn).toBeCloseTo(150.6);
  });
});
