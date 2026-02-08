// Script to make a user admin
// Run with: npx ts-node src/scripts/make-admin.ts <user-email>

import { MongoClient } from "mongodb";

const MONGODB_URI = process.env.MONGODB_URI || "mongodb+srv://kdachint12_db_user:FaHQk7iubqIoZT8L@cluster0.ya1crg7.mongodb.net/campusmarket";

async function makeAdmin(email: string) {
    const client = new MongoClient(MONGODB_URI);

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
