import mongoose from 'mongoose';

export async function connectMongo(uri) {
    try {
        mongoose.set('strictQuery', true);
        await mongoose.connect(uri, { dbName: 'backend2' });
        console.log("Connected to MongoDB");
    } catch (err) {
        console.error("[mongo] error de conexion:", err.message);
        process.exit(1);
    }
}