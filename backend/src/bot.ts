import TelegramBot from 'node-telegram-bot-api';
import db from './db';
import dotenv from 'dotenv';

dotenv.config();

const token = process.env.TELEGRAM_BOT_TOKEN || '';
const botUsername = process.env.BOT_USERNAME || 'your_bot';

let bot: TelegramBot | null = null;


export function initBot() {
    if (!token || token === 'YOUR_BOT_TOKEN_HERE') {
        console.warn('⚠️  Telegram bot token not configured. Bot features disabled.');
        console.warn('   To enable: Add your bot token to backend/.env');
        return null;
    }

    try {
        bot = new TelegramBot(token, { polling: true });
        console.log('✅ Telegram bot initialized successfully');


        bot.onText(/\/start (.+)/, (msg, match) => {
            const chatId = msg.chat.id;
            const param = match?.[1];

            if (param?.startsWith('order_')) {
                const orderId = param.replace('order_', '');
                handleOrderTracking(chatId, orderId);
            } else {
                bot?.sendMessage(chatId, 'Добро пожаловать! 👋\n\nЭтот бот поможет вам отслеживать ваши заказы.');
            }
        });


        bot.onText(/\/start$/, (msg) => {
            const chatId = msg.chat.id;
            bot?.sendMessage(chatId, 'Добро пожаловать! 👋\n\nЭтот бот поможет вам отслеживать ваши заказы.');
        });

        return bot;
    } catch (error) {
        console.error('Failed to initialize Telegram bot:', error);
        return null;
    }
}


function handleOrderTracking(chatId: number, orderId: string) {
    db.get('SELECT * FROM orders WHERE id = ?', [orderId], (err, order: any) => {
        if (err) {
            console.error('Error fetching order:', err);
            bot?.sendMessage(chatId, '❌ Ошибка при получении информации о заказе.');
            return;
        }

        if (!order) {
            bot?.sendMessage(chatId, '❌ Заказ не найден.');
            return;
        }


        db.run('UPDATE orders SET telegram_chat_id = ? WHERE id = ?', [chatId.toString(), orderId], (updateErr) => {
            if (updateErr) {
                console.error('Error updating order:', updateErr);
                return;
            }


            db.all(`
                SELECT oi.quantity, oi.price, p.name 
                FROM order_items oi
                JOIN products p ON oi.product_id = p.id
                WHERE oi.order_id = ?
            `, [orderId], (itemsErr, items: any[]) => {
                if (itemsErr) {
                    console.error('Error fetching order items:', itemsErr);
                    return;
                }

                const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
                const totalPrice = items.reduce((sum, item) => sum + (item.quantity * item.price), 0);

                const itemsList = items.map(item =>
                    `  • ${item.name} x${item.quantity} - ${item.price * item.quantity}₽`
                ).join('\n');

                const message = `✅ Заказ #${orderId} подтвержден!\n\n` +
                    `📦 Товары:\n${itemsList}\n\n` +
                    `💰 Итого: ${totalPrice}₽ (${totalItems} шт.)\n` +
                    `📊 Статус: ${getStatusEmoji(order.status)} ${order.status}\n\n` +
                    `Мы уведомим вас здесь о любых изменениях статуса заказа.`;

                bot?.sendMessage(chatId, message);
            });
        });
    });
}

function getStatusEmoji(status: string): string {
    const statusEmojis: { [key: string]: string } = {
        'NEW': '🆕',
        'PAID': '💳',
        'SHIPPED': '🚚',
        'DELIVERED': '✅',
        'CANCELLED': '❌'
    };
    return statusEmojis[status] || '📋';
}


export function notifyOrderStatusChange(orderId: number, newStatus: string) {
    if (!bot) return;

    db.get('SELECT telegram_chat_id FROM orders WHERE id = ?', [orderId], (err, order: any) => {
        if (err || !order || !order.telegram_chat_id) return;

        const message = `🔔 Статус заказа #${orderId} изменен:\n` +
            `${getStatusEmoji(newStatus)} ${newStatus}`;

        bot?.sendMessage(order.telegram_chat_id, message);
    });
}

export function getTelegramDeepLink(orderId: number): string {
    return `https://t.me/${botUsername}?start=order_${orderId}`;
}

export { bot };
