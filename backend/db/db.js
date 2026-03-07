import { Low } from 'lowdb';
import { JSONFile } from 'lowdb/node';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const file = path.join(__dirname, 'data.json');

const adapter = new JSONFile(file);
const defaultData = { messages: [], moods: [], sleepLogs: [], users: [], notifications: [] };
const db = new Low(adapter, defaultData);

export const initDB = async () => {
    await db.read();
    db.data ||= defaultData;
    // Migration: Ensure all arrays exist
    if (!db.data.users) db.data.users = [];
    if (!db.data.notifications) db.data.notifications = [];
    if (!db.data.messages) db.data.messages = [];
    if (!db.data.moods) db.data.moods = [];
    if (!db.data.sleepLogs) db.data.sleepLogs = [];
    await db.write();
    console.log('Database initialized');
};

export const getUsers = async () => {
    await db.read();
    return db.data.users;
};

export const addUser = async (userData) => {
    await db.read();
    const newUser = {
        ...userData,
        id: Date.now().toString()
    };
    db.data.users.push(newUser);
    await db.write();
    return newUser;
};

export const updateUser = async (userId, updates) => {
    await db.read();
    const index = db.data.users.findIndex(u => u.id === userId);
    if (index !== -1) {
        db.data.users[index] = { ...db.data.users[index], ...updates };
        await db.write();
        return db.data.users[index];
    }
    return null;
};

export const getMessages = async (userId) => {
    await db.read();
    return db.data.messages.filter(m => m.userId === userId);
};

export const addMessage = async (userId, message) => {
    await db.read();
    db.data.messages.push({
        ...message,
        userId,
        id: Date.now() + Math.random().toString(36).substr(2, 9)
    });
    // Keep total message count healthy, but per-user limits would be better in a real app
    if (db.data.messages.length > 1000) {
        db.data.messages = db.data.messages.slice(-500);
    }
    await db.write();
};

export const deleteMessages = async (userId) => {
    await db.read();
    db.data.messages = db.data.messages.filter(m => m.userId !== userId);
    await db.write();
};

export const getMoods = async (userId) => {
    await db.read();
    return db.data.moods.filter(m => m.userId === userId);
};

export const addMood = async (userId, moodData) => {
    await db.read();
    db.data.moods.push({
        ...moodData,
        userId,
        id: Date.now(),
        date: new Date().toISOString()
    });
    await db.write();
};

export const getSleepLogs = async (userId) => {
    await db.read();
    return db.data.sleepLogs.filter(s => s.userId === userId);
};

export const addSleepLog = async (userId, sleepData) => {
    await db.read();
    db.data.sleepLogs.push({
        ...sleepData,
        userId,
        id: Date.now(),
        date: new Date().toISOString()
    });
    await db.write();
};

export const getNotifications = async (userId) => {
    await db.read();
    return db.data.notifications.filter(n => n.userId === userId);
};

export const addNotification = async (userId, notificationData) => {
    await db.read();
    db.data.notifications.unshift({
        ...notificationData,
        userId,
        id: Date.now() + Math.random().toString(36).substr(2, 9),
        timestamp: new Date().toISOString(),
        read: false
    });
    if (db.data.notifications.length > 500) {
        db.data.notifications = db.data.notifications.slice(0, 300);
    }
    await db.write();
};

export const markNotificationAsRead = async (userId, notificationId) => {
    await db.read();
    const index = db.data.notifications.findIndex(n => n.id === notificationId && n.userId === userId);
    if (index !== -1) {
        db.data.notifications[index].read = true;
        await db.write();
        return true;
    }
    return false;
};

export const clearAllNotifications = async (userId) => {
    await db.read();
    db.data.notifications = db.data.notifications.filter(n => n.userId !== userId);
    await db.write();
};

export default db;
