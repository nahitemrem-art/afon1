const fs = require('fs');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();

const dbPath = path.join(__dirname, '../data/database.sqlite');
const migrationsDir = path.join(__dirname, '../db/migrations');

// Ensure migrations directory exists
if (!fs.existsSync(migrationsDir)) {
  fs.mkdirSync(migrationsDir, { recursive: true });
  console.log('Migrations directory created');
}

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database:', err);
    process.exit(1);
  }

  console.log('Running migrations...');

  // Create migrations table if it doesn't exist
  db.run(`
    CREATE TABLE IF NOT EXISTS migrations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE,
      executed_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `, (err) => {
    if (err) {
      console.error('Error creating migrations table:', err);
      process.exit(1);
    }

    // Read migration files
    fs.readdir(migrationsDir, (err, files) => {
      if (err && err.code !== 'ENOENT') {
        console.error('Error reading migrations directory:', err);
        process.exit(1);
      }

      files = files || [];
      files = files.filter(f => f.endsWith('.sql')).sort();

      if (files.length === 0) {
        console.log('No migrations to run');
        db.close();
        return;
      }

      let completed = 0;
      files.forEach(file => {
        db.get('SELECT * FROM migrations WHERE name = ?', [file], (err, row) => {
          if (err) {
            console.error('Error checking migration:', err);
            return;
          }

          if (!row) {
            const migrationPath = path.join(migrationsDir, file);
            const migration = fs.readFileSync(migrationPath, 'utf8');
            db.exec(migration, (err) => {
              if (err) {
                console.error(`Error executing migration ${file}:`, err);
                return;
              }

              db.run('INSERT INTO migrations (name) VALUES (?)', [file], (err) => {
                if (err) {
                  console.error('Error recording migration:', err);
                  return;
                }

                console.log(`Migration executed: ${file}`);
                completed++;

                if (completed === files.length) {
                  console.log('All migrations completed');
                  db.close();
                }
              });
            });
          } else {
            completed++;
            console.log(`Migration already executed: ${file}`);

            if (completed === files.length) {
              console.log('All migrations completed');
              db.close();
            }
          }
        });
      });
    });
  });
});
