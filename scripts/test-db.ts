import mongoose from "mongoose";

const MONGODB_URI = "mongodb+srv://kdachint12_db_user:FaHQk7iubqIoZT8L@cluster0.ya1crg7.mongodb.net/campusmarket";

async function test() {
    console.log(`Testing connection to: ${MONGODB_URI?.split('@')[1]}`);
    try {
        await mongoose.connect(MONGODB_URI as string, { serverSelectionTimeoutMS: 5000 });
        console.log("SUCCESS: Connected to Atlas!");
        await mongoose.connection.close();
        process.exit(0);
    } catch (err: any) {
        console.error("FAILURE: Could not connect.");
        console.error("Error Name:", err.name);
        console.error("Error Message:", err.message);
        process.exit(1);
    }
}

test();
