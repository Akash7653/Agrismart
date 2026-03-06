import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://udayfranklin121_db_user:iTPtuaBi6M80NQEs@cluster0.wficn2x.mongodb.net/agrismart?retryWrites=true&w=majority';

export async function connectDatabase() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Mongoose Database connected successfully');
    return mongoose.connection;
  } catch (error) {
    console.error('❌ Mongoose connection error:', error.message);
    throw error;
  }
}

export default mongoose;
