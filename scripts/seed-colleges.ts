import mongoose from "mongoose";
import * as dotenv from "dotenv";
import path from "path";

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    console.error("❌ MONGODB_URI is not defined in .env.local");
    process.exit(1);
}

const deliveryLocationSchema = new mongoose.Schema({
    name: { type: String, required: true },
    building: { type: String, required: true }
}, { _id: false });

const collegeSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    shortCode: { type: String, required: true, unique: true, uppercase: true },
    city: { type: String, required: true },
    deliveryLocations: [deliveryLocationSchema]
}, { timestamps: true });

const College = mongoose.models.College || mongoose.model("College", collegeSchema);

async function seed() {
    try {
        console.log("Connecting to MongoDB Atlas...");
        await mongoose.connect(MONGODB_URI as string, { serverSelectionTimeoutMS: 5000 });
        console.log("Connected.");

        console.log("Cleaning collection...");
        await College.deleteMany({});
        console.log("Cleaned.");

        const defaultLocations = [
            { name: "Main Gate", building: "Entrance" },
            { name: "Central Library", building: "Academic Block" },
            { name: "Student Canteen", building: "Food Court" },
            { name: "Messenger Area", building: "Admin Block" },
        ];

        const colleges = [
            { name: "Bhagwan Parshuram Institute of Technology", shortCode: "BPIT", city: "Delhi", deliveryLocations: defaultLocations },
            { name: "Bharati Vidyapeeth's College of Engineering", shortCode: "BVCOE", city: "Delhi", deliveryLocations: defaultLocations },
            { name: "BM Institute of Engineering & Technology", shortCode: "BMIET", city: "Sonepat", deliveryLocations: defaultLocations },
            { name: "Delhi Institute of Technology & Management", shortCode: "DITM", city: "Sonepat", deliveryLocations: defaultLocations },
            { name: "Delhi Technical Campus", shortCode: "DTC", city: "Greater Noida", deliveryLocations: defaultLocations },
            { name: "Dr. Akhilesh Das Gupta Institute of Technology & Management", shortCode: "ADGITM", city: "Delhi", deliveryLocations: defaultLocations },
            { name: "Greater Noida Institute of Technology", shortCode: "GNIT", city: "Greater Noida", deliveryLocations: defaultLocations },
            { name: "Guru Teg Bahadur Institute of Technology", shortCode: "GTBIT", city: "Delhi", deliveryLocations: defaultLocations },
            { name: "HMR Institute of Technology & Management", shortCode: "HMRITM", city: "Delhi", deliveryLocations: defaultLocations },
            { name: "JIMS Engineering Management Technical Campus", shortCode: "JEMTEC", city: "Greater Noida", deliveryLocations: defaultLocations },
            { name: "Maharaja Agrasen Institute of Technology", shortCode: "MAIT", city: "Delhi", deliveryLocations: defaultLocations },
            { name: "Maharaja Surajmal Institute of Technology", shortCode: "MSIT", city: "Delhi", deliveryLocations: defaultLocations },
            { name: "Mahavir Swami Institute of Technology", shortCode: "MVSIT", city: "Sonepat", deliveryLocations: defaultLocations },
            { name: "Trinity Institute of Innovations in Professional Studies", shortCode: "TIIPS", city: "Greater Noida", deliveryLocations: defaultLocations },
            { name: "University School of Chemical Technology, GGSIPU", shortCode: "USCT", city: "Delhi", deliveryLocations: defaultLocations },
            { name: "University School of Information & Communication Technology, GGSIPU", shortCode: "USICT", city: "Delhi", deliveryLocations: defaultLocations },
            { name: "Vivekananda Institute of Professional Studies", shortCode: "VIPS", city: "Delhi", deliveryLocations: defaultLocations },
            { name: "University School of Automation & Robotics, GGSIPU", shortCode: "USAR", city: "Delhi", deliveryLocations: defaultLocations },
        ];

        console.log(`Seeding ${colleges.length} colleges into Atlas...`);
        await College.insertMany(colleges);
        console.log("Seeding complete!");

        await mongoose.connection.close();
        process.exit(0);
    } catch (err) {
        console.error("Seed failed:", err);
        process.exit(1);
    }
}

seed();
