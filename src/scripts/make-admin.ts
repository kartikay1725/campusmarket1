// Script to make a user admin
// Run with: npx ts-node src/scripts/make-admin.ts <user-email>

import { MongoClient } from "mongodb";
import * as dotenv from "dotenv";
import path from "path";

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    console.error("❌ MONGODB_URI is not defined in .env.local");
    process.exit(1);
}

async function makeAdmin(email: string) {
    const client = new MongoClient(MONGODB_URI as string);

    try {
        await client.connect();
        const db = client.db();

        const result = await db.collection("users").updateOne(
            { email: email.toLowerCase() },
            { $set: { role: "admin" } }
        );

        if (result.matchedCount === 0) {
            console.log(`❌ User with email "${email}" not found`);
        } else if (result.modifiedCount === 0) {
            console.log(`ℹ️ User "${email}" is already an admin`);
        } else {
            console.log(`✅ User "${email}" is now an admin!`);
        }
    } catch (error) {
        console.error("Error:", error);
    } finally {
        await client.close();
    }
}

const email = process.argv[2];
if (!email) {
    console.log("Usage: npx ts-node src/scripts/make-admin.ts <user-email>");
    process.exit(1);
}

makeAdmin(email);
