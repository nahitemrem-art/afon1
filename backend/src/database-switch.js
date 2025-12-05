// Database switching utility
// Automatically switches between better-sqlite3 and sql.js

const fs = require('fs');
const path = require('path');

const databaseTsPath = path.join(__dirname, 'database.ts');
const databaseSqljsPath = path.join(__dirname, 'database-sqljs.ts');

// Check if better-sqlite3 is available
try {
  require.resolve('better-sqlite3');
  console.log('✅ better-sqlite3 found, using it');
  // Keep database.ts as is
} catch (e) {
  console.log('❌ better-sqlite3 not found');
  console.log('✅ Switching to sql.js...');
  
  // Copy database-sqljs.ts to database.ts
  if (fs.existsSync(databaseSqljsPath)) {
    const content = fs.readFileSync(databaseSqljsPath, 'utf8');
    fs.writeFileSync(databaseTsPath, content);
    console.log('✅ Database switched to sql.js');
  } else {
    console.error('❌ database-sqljs.ts not found!');
    process.exit(1);
  }
}
