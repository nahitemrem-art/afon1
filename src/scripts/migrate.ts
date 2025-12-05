import { setupDatabase } from '../config/database';

async function migrate(): Promise<void> {
  try {
    console.log('🔄 Starting database migration...');
    
    await setupDatabase();
    
    console.log('✅ Database migration completed successfully');
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

// Run migration if this file is executed directly
if (require.main === module) {
  migrate();
}

export { migrate };