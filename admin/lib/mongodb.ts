import { MongoClient, ServerApiVersion } from "mongodb";

const uri = process.env.MONGODB_URI;

if (!uri) {
  throw new Error(
    'Invalid/Missing environment variable: "MONGODB_URI"'
  );
}

const options = {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },

  // Keep connections alive
  maxPoolSize: 10,
  minPoolSize: 1,

  // Don't wait too long when establishing a connection
  serverSelectionTimeoutMS: 5000,
  connectTimeoutMS: 5000,

  // Keep TCP connection alive
  socketTimeoutMS: 10000,
};

declare global {
  // eslint-disable-next-line no-var
  var _mongoClientPromise:
    | Promise<MongoClient>
    | undefined;
}

let clientPromise: Promise<MongoClient>;

if (process.env.NODE_ENV === "development") {
  if (!global._mongoClientPromise) {
    const client = new MongoClient(
      uri,
      options
    );

    global._mongoClientPromise =
      client.connect();
  }

  clientPromise =
    global._mongoClientPromise;
} else {
  /*
   * Reuse the same promise for the lifetime
   * of this Render server instance.
   */
  if (!global._mongoClientPromise) {
    const client = new MongoClient(
      uri,
      options
    );

    global._mongoClientPromise =
      client.connect();
  }

  clientPromise =
    global._mongoClientPromise;
}

export default clientPromise;