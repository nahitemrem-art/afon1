import { setupDatabase } from '../config/database';

beforeAll(async () => {
  // Set test environment variables
  process.env.NODE_ENV = 'test';
  process.env.DATABASE_PATH = ':memory:'; // Use in-memory database for tests
  process.env.JWT_SECRET = 'test-secret-key';
  
  // Initialize test database
  await setupDatabase();
});

afterAll(async () => {
  // Clean up if needed
});

beforeEach(async () => {
  // Clean up database before each test
  // This will be handled by individual test utilities
});