import mongoose from 'mongoose';

const connectDB = async () => {
    let retries = 5;
    
    while (retries) {
        try {
            const options = {
                serverSelectionTimeoutMS: 5000,
                socketTimeoutMS: 45000,
            };

            const conn = await mongoose.connect(process.env.MONGO_URI, options);

            console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
            console.log(`📊 Database: ${conn.connection.name}`);
            
            // Handle connection events
            mongoose.connection.on('error', (err) => {
                console.error('❌ MongoDB connection error:', err);
            });

            mongoose.connection.on('disconnected', () => {
                console.warn('⚠️  MongoDB disconnected. Attempting to reconnect...');
            });

            mongoose.connection.on('reconnected', () => {
                console.log('✅ MongoDB reconnected');
            });

            return conn;
        } catch (error) {
            console.error(`❌ MongoDB Connection Error: ${error.message}`);
            retries -= 1;
            console.log(`Retries left: ${retries}`);
            
            if (retries === 0) {
                console.error('❌ Unable to connect to MongoDB after multiple attempts');
                process.exit(1);
            }
            
            // Wait 5 seconds before retrying
            await new Promise(resolve => setTimeout(resolve, 5000));
        }
    }
};

export default connectDB;
