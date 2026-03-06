import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI || 'mongodb+srv://udayfranklin121_db_user:iTPtuaBi6M80NQEs@cluster0.wficn2x.mongodb.net/agrismart?retryWrites=true&w=majority';

let cachedClient = null;

export async function getDbClient() {
  if (cachedClient) {
    return cachedClient;
  }

  const client = new MongoClient(uri);
  
  try {
    await client.connect();
    cachedClient = client;
    return client;
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    throw error;
  }
}

export async function getDatabase(dbName = 'agrismart') {
  const client = await getDbClient();
  return client.db(dbName);
}

export async function closeDbConnection() {
  if (cachedClient) {
    await cachedClient.close();
    cachedClient = null;
  }
}
