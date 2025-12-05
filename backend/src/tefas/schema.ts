import { z } from 'zod';

const numeric = () => z.union([z.number(), z.string()]);
const numericOptional = () => numeric().optional().nullable();

export const TefasApiFundSchema = z.object({
  FonKod: z.string().min(1),
  FonUnvan: z.string().min(1),
  FonTuru: z.string().optional(),
  Kategori: z.string().optional(),
  KurulusTarihi: z.string().optional(),
  ToplamDeger: numericOptional(),
  ToplamPay: numericOptional(),
  YatirimciSayisi: numericOptional(),
  Fiyat: numeric(),
  GunlukGetiri: numericOptional(),
  AylikGetiri: numericOptional(),
  UcAylikGetiri: numericOptional(),
  YillikGetiri: numericOptional(),
  ToplamGetiri: numericOptional(),
  Tarih: z.string(),
});

export const TefasScrapedFundSchema = z.object({
  code: z.string(),
  title: z.string(),
  type: z.string().optional(),
  category: z.string().optional(),
  foundationDate: z.string().optional(),
  totalValue: numericOptional(),
  totalShare: numericOptional(),
  investorCount: numericOptional(),
  price: numeric(),
  dailyReturn: numericOptional(),
  monthlyReturn: numericOptional(),
  threeMonthReturn: numericOptional(),
  annualReturn: numericOptional(),
  totalReturn: numericOptional(),
  date: z.string(),
});

export type TefasApiFund = z.infer<typeof TefasApiFundSchema>;
export type TefasScrapedFund = z.infer<typeof TefasScrapedFundSchema>;
