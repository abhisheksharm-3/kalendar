// src/lib/server/appwrite.js
"use server";
import { Client, Account, Databases, Query, ID } from "node-appwrite";
import { cookies } from "next/headers";

export async function createSessionClient() {
  const client = new Client()
    .setEndpoint(process.env.APPWRITE_ENDPOINT!)
    .setProject(process.env.APPWRITE_PROJECT_ID!);

  const session = cookies().get("user-session");
  if (!session || !session.value) {
    throw new Error("No session");
  }

  client.setSession(session.value);

  return {
    get account() {
      return new Account(client);
    },
  };
}

export async function createAdminClient() {
  const client = new Client()
    .setEndpoint(process.env.APPWRITE_ENDPOINT!)
    .setProject(process.env.APPWRITE_PROJECT_ID!)
    .setKey(process.env.APPWRITE_KEY!);

  return {
    get account() {
      return new Account(client);
    },
  };
}

export async function getLoggedInUser() {
  try {
    const { account } = await createSessionClient();
    return await account.get();
  } catch (error) {
    return null;
  }
}
export async function storeAccessToken(userId: string, accessToken: string) {
  const client = new Client()
    .setEndpoint(process.env.APPWRITE_ENDPOINT!)
    .setProject(process.env.APPWRITE_PROJECT_ID!)
    .setKey(process.env.APPWRITE_KEY!);

  const databases = new Databases(client);

  try {
    // Check if a token already exists for this user
    const existingTokens = await databases.listDocuments(
      process.env.APPWRITE_DATABASE_ID!,
      process.env.APPWRITE_COLLECTION_ID!,
      [Query.equal('userId', userId)]
    );

    if (existingTokens.documents.length > 0) {
      // Update existing token
      await databases.updateDocument(
        process.env.APPWRITE_DATABASE_ID!,
        process.env.APPWRITE_COLLECTION_ID!,
        existingTokens.documents[0].$id,
        {
          accessToken: accessToken,
          updatedAt: new Date().toISOString()
        }
      );
    } else {
      // Create new token document
      await databases.createDocument(
        process.env.APPWRITE_DATABASE_ID!,
        process.env.APPWRITE_COLLECTION_ID!,
        ID.unique(),
        {
          userId: userId,
          accessToken: accessToken,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      );
    }

    console.log('Access token stored successfully');
  } catch (error) {
    console.error('Error storing access token:', error);
    throw error;
  }
}

export async function getAccessToken(userId: string) {
  const client = new Client()
    .setEndpoint(process.env.APPWRITE_ENDPOINT!)
    .setProject(process.env.APPWRITE_PROJECT_ID!)
    .setKey(process.env.APPWRITE_KEY!);

  const databases = new Databases(client);

  try {
    const tokens = await databases.listDocuments(
      process.env.APPWRITE_DATABASE_ID!,
      process.env.APPWRITE_COLLECTION_ID!,
      [Query.equal('userId', userId)]
    );

    if (tokens.documents.length > 0) {
      return tokens.documents[0].accessToken;
    } else {
      return null;
    }
  } catch (error) {
    console.error('Error retrieving access token:', error);
    throw error;
  }
}