import sqlite3 from 'sqlite3';
import path from 'path';

const DB_PATH = path.resolve(__dirname, 'shop.db');

const db = new sqlite3.Database(DB_PATH, (err) => {
    if (err) {
        console.error('Error opening database', err.message);
    } else {
        console.log('Connected to the SQLite database.');
        initializeTables();
    }
});

function initializeTables() {
    db.serialize(() => {

        db.run(`CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);


        db.run(`CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      image TEXT,
      price REAL,
      description TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);


        db.run(`CREATE TABLE IF NOT EXISTS orders (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      status TEXT DEFAULT 'NEW',
      telegram_chat_id TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(user_id) REFERENCES users(id)
    )`);


        db.run(`ALTER TABLE orders ADD COLUMN telegram_chat_id TEXT`, (err) => {

            if (err && !err.message.includes('duplicate column')) {
                console.error('Error adding telegram_chat_id column:', err.message);
            }
        });


        db.run(`CREATE TABLE IF NOT EXISTS order_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      order_id INTEGER,
      product_id INTEGER,
      quantity INTEGER,
      price REAL,
      FOREIGN KEY(order_id) REFERENCES orders(id),
      FOREIGN KEY(product_id) REFERENCES products(id)
    )`);


        db.get("SELECT count(*) as count FROM products", (err, row: any) => {
            if (row.count === 0) {
                console.log('Seeding products...');
                const initialProducts = [
                    { name: 'пуловер', image: '/assets/cat-1.png', price: 1500 },
                    { name: 'джинсы', image: '/assets/cat-2.png', price: 2500 },
                    { name: 'брюки', image: '/assets/cat-3.png', price: 2000 },
                    { name: 'курта', image: '/assets/cat-4.png', price: 5000 },
                    { name: 'кофта', image: '/assets/cat-5.png', price: 1800 },
                    { name: 'футболка', image: '/assets/cat-6.png', price: 800 },
                    { name: 'джемпер', image: '/assets/cat-7.png', price: 2200 },
                    { name: 'водолазка', image: '/assets/cat-8.png', price: 1200 },
                    { name: 'рубашка', image: '/assets/cat-9.png', price: 1600 },
                ];

                const stmt = db.prepare("INSERT INTO products (name, image, price) VALUES (?, ?, ?)");
                initialProducts.forEach(prod => {
                    stmt.run(prod.name, prod.image, prod.price);
                });
                stmt.finalize();
            }
        });
    });
}

export default db;
