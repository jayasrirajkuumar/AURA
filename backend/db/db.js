import { Low } from 'lowdb';
import { JSONFile } from 'lowdb/node';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const file = path.join(__dirname, 'data.json');

const adapter = new JSONFile(file);
const defaultData = { messages: [], moods: [], sleepLogs: [] };
const db = new Low(adapter, defaultData);

export const initDB = async () => {
    await db.read();
    db.data ||= defaultData;
    await db.write();
    console.log('Database initialized');
};

export const getMessages = async () => {
    await db.read();
    return db.data.messages;
};

export const addMessage = async (message) => {
    await db.read();
    db.data.messages.push({
        ...message,
        id: Date.now() + Math.random().toString(36).substr(2, 9)
    });
    // Keep only last 100 messages for basic prototype
    if (db.data.messages.length > 100) {
        db.data.messages = db.data.messages.slice(-100);
    }
    await db.write();
};

export const getMoods = async () => {
    await db.read();
    return db.data.moods;
};

export const addMood = async (moodData) => {
    await db.read();
    db.data.moods.push({
        ...moodData,
        id: Date.now(),
        date: new Date().toISOString()
    });
    await db.write();
};

export const getSleepLogs = async () => {
    await db.read();
    return db.data.sleepLogs;
};

export const addSleepLog = async (sleepData) => {
    await db.read();
    db.data.sleepLogs.push({
        ...sleepData,
        id: Date.now(),
        date: new Date().toISOString()
    });
    await db.write();
};

export default db;
