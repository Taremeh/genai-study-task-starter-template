import dbPromise from './db';

async function setup() {
    const db = await dbPromise;

    await db.exec(`CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL
    )`);

    await db.run(`INSERT OR IGNORE INTO users (name, email) VALUES (?, ?)`, ['John Doe', 'john.doe@example.com']);

    console.log('Database setup complete.');
}

setup().catch(err => {
    console.error('Error setting up the database:', err);
});

// Export the setup function
export { setup };
