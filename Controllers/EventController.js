import Event from "../Models/EventSchema.js";
import cloudinary from "../Utils/Cloudinary.js";
import { Readable } from "stream";

/* ================= CREATE EVENT ================= */
export const createEvent = async (req, res) => {
    try {
        const { title, description, date, place, guest, category } = req.body;

        if (!title || !description || !date || !place || !guest || !category) {
            return res.status(400).json({ success: false, message: "All fields are required" });
        }

        let imagesResults = [];
        if (req.files && req.files.length > 0) {
            const uploadToCloudinary = (file) => {
                return new Promise((resolve, reject) => {
                    const stream = cloudinary.uploader.upload_stream(
                        { folder: "events" },
                        (error, result) => {
                            if (result) resolve({ url: result.secure_url, public_id: result.public_id });
                            else reject(error);
                        }
                    );
                    Readable.from(file.buffer).pipe(stream);
                });
            };

            for (const file of req.files) {
                const result = await uploadToCloudinary(file);
                imagesResults.push(result);
            }
        }

        const newEvent = await Event.create({
            title,
            description,
            date,
            place,
            guest,
            category,
            images: imagesResults
        });

        res.status(201).json({
            success: true,
            message: "Event created successfully",
            data: newEvent
        });
    } catch (error) {
        console.error("Create event error:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

/* ================= GET ALL EVENTS ================= */
export const getEvents = async (req, res) => {
    try {
        const events = await Event.find().populate("category", "categoryName").sort({ createdAt: -1 });
        res.json({ success: true, data: events });
    } catch (error) {
        console.error("Get events error:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

/* ================= UPDATE EVENT ================= */
export const updateEvent = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, date, place, guest, category, existingImages } = req.body;

        const event = await Event.findById(id);
        if (!event) {
            return res.status(404).json({ success: false, message: "Event not found" });
        }

        let imagesResults = [];

        // Handle existing images (from frontend as JSON string if mixed with new files)
        if (existingImages) {
            try {
                imagesResults = JSON.parse(existingImages);
            } catch (e) {
                // If it's already an array/object
                imagesResults = existingImages;
            }
        }

        // Handle new image uploads
        if (req.files && req.files.length > 0) {
            const uploadToCloudinary = (file) => {
                return new Promise((resolve, reject) => {
                    const stream = cloudinary.uploader.upload_stream(
                        { folder: "events" },
                        (error, result) => {
                            if (result) resolve({ url: result.secure_url, public_id: result.public_id });
                            else reject(error);
                        }
                    );
                    Readable.from(file.buffer).pipe(stream);
                });
            };

            for (const file of req.files) {
                const result = await uploadToCloudinary(file);
                imagesResults.push(result);
            }
        }

        // Optional: Delete images from Cloudinary that were removed
        // This requires comparing event.images with existingImages
        const currentPublicIds = imagesResults.map(img => img.public_id);
        for (const oldImg of event.images) {
            if (!currentPublicIds.includes(oldImg.public_id)) {
                await cloudinary.uploader.destroy(oldImg.public_id);
            }
        }

        event.title = title || event.title;
        event.description = description || event.description;
        event.date = date || event.date;
        event.place = place || event.place;
        event.guest = guest || event.guest;
        event.category = category || event.category;
        event.images = imagesResults;

        await event.save();

        res.json({
            success: true,
            message: "Event updated successfully",
            data: event
        });
    } catch (error) {
        console.error("Update event error:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

/* ================= DELETE EVENT ================= */
export const deleteEvent = async (req, res) => {
    try {
        const { id } = req.params;
        const event = await Event.findById(id);

        if (!event) {
            return res.status(404).json({ success: false, message: "Event not found" });
        }

        // Delete images from Cloudinary
        for (const img of event.images) {
            if (img.public_id) {
                await cloudinary.uploader.destroy(img.public_id);
            }
        }

        await Event.findByIdAndDelete(id);

        res.json({ success: true, message: "Event deleted successfully" });
    } catch (error) {
        console.error("Delete event error:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};
