import * as cheerio from 'cheerio';
import { HttpClient } from './http-client';
import { TefasScrapedFund } from './schema';

export class TefasScraper {
  constructor(private readonly httpClient: HttpClient) {}

  private cleanNumber(value: string | undefined): number | undefined {
    if (!value) return undefined;
    const cleaned = value.replace(/[^0-9,.-]/g, '').replace(',', '.');
    const parsed = parseFloat(cleaned);
    return isNaN(parsed) ? undefined : parsed;
  }

  async scrapeFundData(fundCode: string): Promise<TefasScrapedFund | null> {
    try {
      const html = await this.httpClient.get<string>(`/FonBilgileri.aspx?FonKod=${fundCode}`, {
        responseType: 'text',
      });
      const $ = cheerio.load(html);

      const fundData: Partial<TefasScrapedFund> = {
        code: fundCode,
        date: new Date().toISOString().split('T')[0],
      };

      $('#MainContent_FormViewMainIndicators tr').each((_, row) => {
        const cells = $(row).find('td');
        if (cells.length >= 2) {
          const label = $(cells[0]).text().trim();
          const value = $(cells[1]).text().trim();

          switch (label) {
            case 'Fon Adı':
              fundData.title = value;
              break;
            case 'Birim Fiyat':
              fundData.price = this.cleanNumber(value);
              break;
            case 'Günlük Getiri':
              fundData.dailyReturn = this.cleanNumber(value);
              break;
            case 'Aylık Getiri':
              fundData.monthlyReturn = this.cleanNumber(value);
              break;
            case '3 Aylık Getiri':
              fundData.threeMonthReturn = this.cleanNumber(value);
              break;
            case 'Yıllık Getiri':
              fundData.annualReturn = this.cleanNumber(value);
              break;
            case 'Toplam Değer':
              fundData.totalValue = this.cleanNumber(value);
              break;
            case 'Fon Türü':
              fundData.type = value;
              break;
            case 'Kategori':
              fundData.category = value;
              break;
          }
        }
      });

      if (!fundData.title || fundData.price === undefined) {
        return null;
      }

      return fundData as TefasScrapedFund;
    } catch (error) {
      console.error(`Error scraping fund ${fundCode}:`, error);
      return null;
    }
  }

  async scrapeFundList(): Promise<TefasScrapedFund[]> {
    try {
      const html = await this.httpClient.get<string>('/TarihselVeriler.aspx', {
        responseType: 'text',
      });
      const $ = cheerio.load(html);

      const fundCodes: string[] = [];
      $('select#MainContent_DropDownListFunds option').each((_, option) => {
        const value = $(option).attr('value');
        if (value && value.trim()) {
          fundCodes.push(value.trim());
        }
      });

      const funds: TefasScrapedFund[] = [];
      for (const code of fundCodes) {
        const fundData = await this.scrapeFundData(code);
        if (fundData) {
          funds.push(fundData);
        }
        await new Promise(resolve => setTimeout(resolve, 100));
      }

      return funds;
    } catch (error) {
      console.error('Error scraping fund list:', error);
      return [];
    }
  }
}
