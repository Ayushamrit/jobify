import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const fixIndexes = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to MongoDB");
        
        const db = mongoose.connection.db;
        const collections = await db.listCollections({ name: 'users' }).toArray();
        
        if (collections.length > 0) {
            console.log("Found users collection, checking indexes...");
            const indexes = await db.collection('users').indexes();
            console.log("Current indexes:", indexes.map(i => i.name));
            
            if (indexes.find(i => i.name === 'email_1')) {
                console.log("Dropping old email_1 index...");
                await db.collection('users').dropIndex('email_1');
                console.log("Dropped email_1 successfully.");
            } else {
                console.log("email_1 index not found, skipping drop.");
            }
        }
        
        await mongoose.disconnect();
        console.log("Disconnected from MongoDB");
    } catch (error) {
        console.error("Error fixing indexes:", error);
    }
};

fixIndexes();
