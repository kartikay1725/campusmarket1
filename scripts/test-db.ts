import mongoose from "mongoose";
import * as dotenv from "dotenv";
import path from "path";
dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    console.error("❌ MONGODB_URI is not defined in .env.local");
    process.exit(1);
}
async function test() {
    console.log(`Testing connection to: ${MONGODB_URI?.split('@')[1]}`);
    try {
        await mongoose.connect(MONGODB_URI as string, { serverSelectionTimeoutMS: 5000 });
        console.log("SUCCESS: Connected to Atlas!");
        await mongoose.connection.close();
        process.exit(0);
    } catch (err: unknown) {
        console.error("FAILURE: Could not connect.");
        if (err instanceof Error) {
            console.error("Error Name:", err.name);
            console.error("Error Message:", err.message);
        }
        process.exit(1);
    }
}

test();
