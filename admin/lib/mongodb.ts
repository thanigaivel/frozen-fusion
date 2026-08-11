import { MongoClient, ServerApiVersion } from "mongodb";

const uri = process.env.MONGODB_URI;

if (!uri) {
  throw new Error('Invalid/Missing environment variable: "MONGODB_URI"');
}

const options = {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },

  // Connection pool settings
  maxPoolSize: 10,
  minPoolSize: 1,
  maxIdleTimeMS: 60000,

  // Connection timeout settings
  connectTimeoutMS: 10000,
  serverSelectionTimeoutMS: 5000,
};

declare global {
  // eslint-disable-next-line no-var
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

let clientPromise: Promise<MongoClient>;

if (process.env.NODE_ENV === "development") {
  // Reuse MongoDB connection during Next.js development/HMR
  if (!global._mongoClientPromise) {
    const client = new MongoClient(uri, options);
    global._mongoClientPromise = client.connect();
  }

  clientPromise = global._mongoClientPromise;
} else {
  // Production
  const client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

export default clientPromise;