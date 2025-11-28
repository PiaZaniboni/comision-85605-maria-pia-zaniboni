import "dotenv/config";
import mongoose from 'mongoose';
import app from './src/app.js';

const { MONGODB_URI, PORT = 3000 } = process.env;

await mongoose.connect( MONGODB_URI, { dbName: 'backend2' });
console.log("Connected to MongoDB");

const server = app.listen(PORT, () => {
  console.log(`API listening on http://localhost:${PORT}`);
});

process.on( 'SIGINT', async () => {
    console.log('\n👋 Bye Bye Bye');
    await mongoose.disconnect();
    server.close( () => process.exit(0));
});