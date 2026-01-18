import { Client, Databases, Query, ID } from 'node-appwrite';

const APPWRITE_ENDPOINT = process.env.APPWRITE_ENDPOINT!;
const APPWRITE_PROJECT_ID = process.env.APPWRITE_PROJECT_ID!;
const APPWRITE_KEY = process.env.APPWRITE_KEY!;
const APPWRITE_DATABASE_ID = process.env.APPWRITE_DATABASE_ID!;

/**
 * Creates an Appwrite admin client for server-side operations.
 */
function createAdminClient(): Client {
  return new Client()
    .setEndpoint(APPWRITE_ENDPOINT)
    .setProject(APPWRITE_PROJECT_ID)
    .setKey(APPWRITE_KEY);
}

/**
 * Gets the Appwrite Databases service.
 */
export function getDatabase(): Databases {
  const client = createAdminClient();
  return new Databases(client);
}

export { Query, ID };