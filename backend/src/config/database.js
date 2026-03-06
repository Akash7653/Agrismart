import mongoose from 'mongoose';

export const connectDatabase = async (uri) => {
  if (!uri) {
    throw new Error('MONGODB_URI is not defined');
  }

  await mongoose.connect(uri, {
    serverSelectionTimeoutMS: 30000
  });

  // eslint-disable-next-line no-console
  console.log('Connected to MongoDB');
};

