import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import { Product } from "@/models/Product";
import { User } from "@/models/User";
import { College } from "@/models/College";
import { verifyAccess } from "@/lib/auth";
import { cache, cacheKey, CACHE_TTL } from "@/lib/cache";
import { rateLimiter, getClientId, RATE_LIMITS } from "@/lib/rateLimit";

// Ensure models are registered for populate
void User;
void College;

// GET /api/products - List products with filters
export async function GET(req: NextRequest) {
    try {
        // Rate limiting
        const clientId = getClientId(req);
        const rateCheck = rateLimiter.check(clientId, RATE_LIMITS.RELAXED.maxRequests, RATE_LIMITS.RELAXED.windowMs);

        if (!rateCheck.allowed) {
            return NextResponse.json(
                { error: "Too many requests. Please slow down." },
                {
                    status: 429,
                    headers: { "Retry-After": String(Math.ceil(rateCheck.resetIn / 1000)) }
                }
            );
        }

        const { searchParams } = new URL(req.url);
        const college = searchParams.get("college");
        const category = searchParams.get("category");
        const condition = searchParams.get("condition");
        const search = searchParams.get("search");
        const minPrice = searchParams.get("minPrice");
        const maxPrice = searchParams.get("maxPrice");
        const sort = searchParams.get("sort") || "newest";
        const page = parseInt(searchParams.get("page") || "1");
        const limit = parseInt(searchParams.get("limit") || "12");

        // Generate cache key based on query params
        const queryKey = cacheKey("products", college || undefined, category || undefined, condition || undefined, search || undefined, minPrice || undefined, maxPrice || undefined, sort, page, limit);

        // Try cache first (only for non-search queries)
        if (!search) {
            const cachedResult = cache.get(queryKey);
            if (cachedResult) {
                return NextResponse.json(cachedResult);
            }
        }

        await dbConnect();

        // Build query
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const query: any = { status: "available" };

        if (college) query.college = college;
        if (category) query.category = category;
        if (condition) query.condition = condition;
        if (minPrice || maxPrice) {
            query.price = {};
            if (minPrice) query.price.$gte = parseFloat(minPrice);
            if (maxPrice) query.price.$lte = parseFloat(maxPrice);
        }
        if (search) {
            query.$text = { $search: search };
        }

        // Sort options
        let sortOption = {};
        switch (sort) {
            case "newest": sortOption = { createdAt: -1 }; break;
            case "oldest": sortOption = { createdAt: 1 }; break;
            case "price-low": sortOption = { price: 1 }; break;
            case "price-high": sortOption = { price: -1 }; break;
            default: sortOption = { createdAt: -1 };
        }

        const skip = (page - 1) * limit;

        const [products, total] = await Promise.all([
            Product.find(query)
                .populate("seller", "name profileImage")
                .populate("college", "name shortCode")
                .sort(sortOption)
                .skip(skip)
                .limit(limit)
                .lean(),
            Product.countDocuments(query)
        ]);

        const result = {
            products,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit)
            }
        };

        // Cache the result (30 seconds for dynamic content)
        if (!search) {
            cache.set(queryKey, result, CACHE_TTL.SHORT);
        }

        return NextResponse.json(result);
    } catch (error) {
        console.error("Error fetching products:", error);
        return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
    }
}

// POST /api/products - Create new listing
export async function POST(req: NextRequest) {
    try {
        const authHeader = req.headers.get("authorization");
        if (!authHeader?.startsWith("Bearer ")) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const token = authHeader.split(" ")[1];
        const payload = verifyAccess(token);

        await dbConnect();

        const body = await req.json();
        const {
            title, description, price, category, images, condition, college,
            availableDays, availableTimeStart, availableTimeEnd, availableNote
        } = body;

        if (!title || !description || !price || !category || !condition || !college) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const product = await Product.create({
            seller: payload.id,
            college,
            title,
            description,
            price,
            category,
            images: images || [],
            condition,
            status: "available",
            availableDays: availableDays || [],
            availableTimeStart,
            availableTimeEnd,
            availableNote
        });

        return NextResponse.json({ product }, { status: 201 });
    } catch (error) {
        console.error("Error creating product:", error);
        return NextResponse.json({ error: "Failed to create product" }, { status: 500 });
    }
}
