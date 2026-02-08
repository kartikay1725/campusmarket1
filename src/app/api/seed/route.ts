import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import { College } from "@/models/College";
import { cache } from "@/lib/cache";

// POST /api/seed - Seed initial colleges data
export async function POST(req: NextRequest) {
    console.log("POST /api/seed called");
    try {
        console.log("Seeding started...");
        await dbConnect();
        console.log("DB connected for seeding");

        const { searchParams } = new URL(req.url);
        const force = searchParams.get("force") === "true";
        console.log(`Force parameter: ${force}`);

        // Check if colleges already exist
        const existingCount = await College.countDocuments();
        console.log(`Existing colleges: ${existingCount}`);

        if (existingCount > 0 && !force) {
            console.log("Already seeded, stopping.");
            return NextResponse.json({
                message: "Colleges already seeded. Use ?force=true to overwrite.",
                count: existingCount
            });
        }

        if (force) {
            console.log("Forcing re-seed, cleaning collection...");
            try {
                await College.deleteMany({});
                console.log("Collection cleared");
            } catch (dropErr: any) {
                console.error("Delete failed:", dropErr.message);
            }
        }

        // Default delivery locations for all colleges
        const defaultLocations = [
            { name: "Main Gate", building: "Entrance" },
            { name: "Central Library", building: "Academic Block" },
            { name: "Student Canteen", building: "Food Court" },
            { name: "Messenger Area", building: "Admin Block" },
        ];

        // Seed colleges from user's provided list
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

        console.log(`Attempting to seed ${colleges.length} colleges individually...`);
        const results = [];
        const errors = [];

        for (const collegeData of colleges) {
            try {
                const newCollege = await College.create(collegeData);
                results.push(newCollege.shortCode);
                console.log(`Seeded: ${collegeData.shortCode}`);
            } catch (err: any) {
                console.error(`Error inserting ${collegeData.shortCode}:`, err.message);
                errors.push({ college: collegeData.shortCode, error: err.message });
            }
        }

        // Invalidate colleges cache
        cache.delete("colleges:all");
        console.log("Cache invalidated");

        if (errors.length > 0) {
            console.log(`Seeding finished with ${errors.length} errors`);
            return NextResponse.json({
                message: "Seed completed with some errors",
                seeded: results,
                failed: errors
            }, { status: 207 });
        }

        console.log("Seeding finished successfully");
        return NextResponse.json({
            message: force ? "Colleges replaced successfully" : "Colleges seeded successfully",
            count: results.length
        }, { status: 201 });
    } catch (error: any) {
        console.error("FATAL ERROR in seed route:", error.message);
        console.error(error.stack);
        return NextResponse.json({
            error: "Failed to seed colleges",
            details: error.message
        }, { status: 500 });
    }
}
