import { dbConnect } from "./db";
import { Event } from "@/models/Event";

export async function getEvents(query = {}) {
    await dbConnect();
    return await Event.find(query).populate("society", "name slug").lean();
}

export async function getEventBySlug(slug: string) {
    await dbConnect();
    return await Event.findOne({ slug }).populate("society", "name slug").lean();
}
