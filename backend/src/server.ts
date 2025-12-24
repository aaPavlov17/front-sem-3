import express from 'express';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import db from './db';
import { initBot, getTelegramDeepLink } from './bot';

const app = express();
const PORT = 3001;

app.use(cors({
    origin: 'http://localhost:5173' // Allow frontend Vite dev server
}));
app.use(express.json());


app.get('/api/products', (req, res) => {
    db.all("SELECT * FROM products", [], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(rows);
    });
});


app.post('/api/auth/register', async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ error: "Name, email and password required" });
    }


    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({ error: "Invalid email format" });
    }


    if (password.length < 6) {
        return res.status(400).json({ error: "Password must be at least 6 characters" });
    }


    db.get("SELECT * FROM users WHERE email = ?", [email], async (err, row: any) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }

        if (row) {
            return res.status(400).json({ error: "Email already registered" });
        }

        try {

            const passwordHash = await bcrypt.hash(password, 10);


            db.run(
                "INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)",
                [name, email, passwordHash],
                function (err) {
                    if (err) {
                        return res.status(500).json({ error: err.message });
                    }
                    res.status(201).json({ id: this.lastID, name, email });
                }
            );
        } catch (error: any) {
            res.status(500).json({ error: "Failed to hash password" });
        }
    });
});


app.post('/api/auth/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: "Email and password required" });
    }

    db.get("SELECT * FROM users WHERE email = ?", [email], async (err, row: any) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }

        if (!row) {
            return res.status(401).json({ error: "Invalid email or password" });
        }

        try {

            const isValid = await bcrypt.compare(password, row.password_hash);

            if (!isValid) {
                return res.status(401).json({ error: "Invalid email or password" });
            }


            const { password_hash, ...userData } = row;
            res.json(userData);
        } catch (error: any) {
            res.status(500).json({ error: "Authentication failed" });
        }
    });
});


app.post('/api/orders', (req, res) => {
    const { userId, items } = req.body;

    if (!userId || !items || items.length === 0) {
        return res.status(400).json({ error: "Invalid order data" });
    }

    const timestamp = new Date().toISOString();

    db.run("INSERT INTO orders (user_id, created_at) VALUES (?, ?)", [userId, timestamp], function (err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        const orderId = this.lastID;

        const stmt = db.prepare("INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)");






        db.all("SELECT id, price FROM products", [], (err, rows: any[]) => {
            if (err) return res.status(500).json({ error: "DB Error" });

            const priceMap = new Map();
            rows.forEach(r => priceMap.set(r.id, r.price));

            items.forEach((item: any) => {
                const price = priceMap.get(item.productId) || 0;
                stmt.run(orderId, item.productId, item.quantity, price);
            });
            stmt.finalize();

            const telegramLink = getTelegramDeepLink(orderId);
            res.status(201).json({
                message: "Order created",
                orderId,
                telegramLink
            });
        });
    });
});


app.get('/api/orders', (req, res) => {
    const userId = req.query.userId;
    if (!userId) return res.status(400).json({ error: "Missing userId" });

    db.all(`
        SELECT o.id, o.created_at, o.status, 
               oi.product_id, oi.quantity, oi.price, p.name as product_name
        FROM orders o
        JOIN order_items oi ON o.id = oi.order_id
        JOIN products p ON oi.product_id = p.id
        WHERE o.user_id = ?
        ORDER BY o.created_at DESC
    `, [userId], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });


        const orders: any[] = [];
        const orderMap = new Map();

        rows.forEach((row: any) => {
            if (!orderMap.has(row.id)) {
                orderMap.set(row.id, {
                    id: row.id,
                    createdAt: row.created_at,
                    status: row.status,
                    items: []
                });
                orders.push(orderMap.get(row.id));
            }
            orderMap.get(row.id).items.push({
                productId: row.product_id,
                name: row.product_name,
                quantity: row.quantity,
                price: row.price
            });
        });

        res.json(orders);
    });
});


initBot();

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
