import { getDatabase } from '@/config/database';
import { Favorite, ServiceError } from '@/types';
import { fundService } from './fundService';
import { v4 as uuidv4 } from 'uuid';

export class FavoritesService {
  async toggleFavorite(userId: string, fundCode: string): Promise<{ isFavorite: boolean }> {
    const db = getDatabase();
    
    // Verify fund exists
    const fund = await fundService.getFundByCode(fundCode);
    if (!fund) {
      const error: ServiceError = new Error('Fund not found');
      error.statusCode = 404;
      throw error;
    }

    // Check if already favorited
    const existingFavorite = db.prepare(
      'SELECT id FROM favorites WHERE user_id = ? AND fund_code = ?'
    ).get(userId, fundCode);

    if (existingFavorite) {
      // Remove from favorites
      db.prepare('DELETE FROM favorites WHERE user_id = ? AND fund_code = ?')
        .run(userId, fundCode);
      return { isFavorite: false };
    } else {
      // Add to favorites
      const favoriteId = uuidv4();
      const now = new Date().toISOString();
      
      db.prepare(`
        INSERT INTO favorites (id, user_id, fund_code, created_at)
        VALUES (?, ?, ?, ?)
      `).run(favoriteId, userId, fundCode, now);
      
      return { isFavorite: true };
    }
  }

  async getUserFavorites(userId: string): Promise<(Favorite & { fund: any })[]> {
    const db = getDatabase();
    
    const favorites = db.prepare(`
      SELECT f.*, fav.created_at as favorite_created_at
      FROM favorites fav
      JOIN funds f ON fav.fund_code = f.code
      WHERE fav.user_id = ?
      ORDER BY fav.created_at DESC
    `).all(userId);

    return favorites.map((fav: any) => ({
      id: fav.id,
      userId: fav.user_id,
      fundCode: fav.fund_code,
      createdAt: fav.favorite_created_at,
      fund: {
        id: fav.id,
        code: fav.code,
        name: fav.name,
        price: fav.price,
        date: fav.date,
        dailyReturn: fav.daily_return,
        monthlyReturn: fav.monthly_return,
        yearlyReturn: fav.yearly_return,
        category: fav.category,
        totalValue: fav.total_value
      }
    }));
  }

  async isFavorite(userId: string, fundCode: string): Promise<boolean> {
    const db = getDatabase();
    
    const favorite = db.prepare(
      'SELECT id FROM favorites WHERE user_id = ? AND fund_code = ?'
    ).get(userId, fundCode);

    return !!favorite;
  }

  async removeFavorite(userId: string, fundCode: string): Promise<void> {
    const db = getDatabase();
    
    const result = db.prepare('DELETE FROM favorites WHERE user_id = ? AND fund_code = ?')
      .run(userId, fundCode);

    if (result.changes === 0) {
      const error: ServiceError = new Error('Favorite not found');
      error.statusCode = 404;
      throw error;
    }
  }
}

export const favoritesService = new FavoritesService();