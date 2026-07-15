import { Request, Response } from "express";
import Tool from "../models/Tool";
import { AuthRequest } from "../middleware/auth";
import { getUserById, getUsersByIds } from "../utils/getUsers";


export const getTools = async (req: Request, res: Response): Promise<void> => {
    try {
        const {
            search,
            category,
            minPrice,
            maxPrice,
            sort,
            page = "1",
            limit = "8",
        } = req.query as Record<string, string>;

        const query: Record<string, unknown> = {};

        if (search) {
            query.$or = [
                { title: { $regex: search, $options: "i" } },
                { shortDescription: { $regex: search, $options: "i" } },
                { location: { $regex: search, $options: "i" } },
            ];
        }

        if (category && category !== "all") {
            query.category = category;
        }

        if (minPrice || maxPrice) {
            query.dailyRate = {
                ...(minPrice ? { $gte: Number(minPrice) } : {}),
                ...(maxPrice ? { $lte: Number(maxPrice) } : {}),
            };
        }

        let sortOption: Record<string, 1 | -1> = { createdAt: -1 };
        if (sort === "price-asc") sortOption = { dailyRate: 1 };
        if (sort === "price-desc") sortOption = { dailyRate: -1 };
        if (sort === "rating") sortOption = { rating: -1 };
        if (sort === "newest") sortOption = { createdAt: -1 };

        const pageNum = Math.max(Number(page) || 1, 1);
        const limitNum = Math.max(Number(limit) || 8, 1);
        const skip = (pageNum - 1) * limitNum;

        const [tools, total] = await Promise.all([
            Tool.find(query).sort(sortOption).skip(skip).limit(limitNum),
            Tool.countDocuments(query),
        ]);

        res.status(200).json({
            tools,
            pagination: {
                total,
                page: pageNum,
                pages: Math.ceil(total / limitNum) || 1,
                limit: limitNum,
            },
        });
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch tools", error: (error as Error).message });
    }
};


export const getFeaturedTools = async (_req: Request, res: Response): Promise<void> => {
    try {
        const tools = await Tool.find().sort({ rating: -1, createdAt: -1 }).limit(4);
        res.status(200).json({ tools });
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch featured tools", error: (error as Error).message });
    }
};


export const getPublicStats = async (_req: Request, res: Response): Promise<void> => {
    try {
        const [totalTools, categories, totalLocations] = await Promise.all([
            Tool.countDocuments(),
            Tool.distinct("category"),
            Tool.distinct("location"),
        ]);

        res.status(200).json({
            totalTools,
            totalCategories: categories.length,
            totalLocations: totalLocations.length,
        });
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch stats", error: (error as Error).message });
    }
};


export const getMyTools = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const tools = await Tool.find({ ownerId: req.user!.id }).sort({ createdAt: -1 });
        res.status(200).json({ tools });
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch your tools", error: (error as Error).message });
    }
};


export const getToolById = async (req: Request, res: Response): Promise<void> => {
    try {
        const tool = await Tool.findById(req.params.id);

        if (!tool) {
            res.status(404).json({ message: "Tool not found" });
            return;
        }

        const [owner, related] = await Promise.all([
            getUserById(tool.ownerId),
            Tool.find({ category: tool.category, _id: { $ne: tool.id } }).limit(4),
        ]);

        res.status(200).json({ tool, owner, related });
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch tool", error: (error as Error).message });
    }
};


export const createTool = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const {
            title,
            shortDescription,
            fullDescription,
            category,
            dailyRate,
            condition,
            location,
            imageUrl,
        } = req.body;

        if (!title || !shortDescription || !fullDescription || !category || !location) {
            res.status(400).json({ message: "Please fill in all required fields" });
            return;
        }

        const tool = await Tool.create({
            title,
            shortDescription,
            fullDescription,
            category,
            dailyRate: dailyRate || 0,
            condition: condition || "good",
            location,
            imageUrl: imageUrl || "",
            ownerId: req.user!.id,
        });

        res.status(201).json({ tool });
    } catch (error) {
        res.status(500).json({ message: "Failed to create tool listing", error: (error as Error).message });
    }
};


export const deleteTool = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const tool = await Tool.findById(req.params.id);

        if (!tool) {
            res.status(404).json({ message: "Tool not found" });
            return;
        }

        const isOwner = tool.ownerId === req.user!.id;
        const isAdminUser = req.user!.role === "admin";

        if (!isOwner && !isAdminUser) {
            res.status(403).json({ message: "Not authorized to delete this listing" });
            return;
        }

        await tool.deleteOne();
        res.status(200).json({ message: "Tool listing deleted" });
    } catch (error) {
        res.status(500).json({ message: "Failed to delete tool", error: (error as Error).message });
    }
};


export const getAllToolsAdmin = async (_req: AuthRequest, res: Response): Promise<void> => {
    try {
        const tools = await Tool.find().sort({ createdAt: -1 });
        const owners = await getUsersByIds(tools.map((t) => t.ownerId));
        const toolsWithOwners = tools.map((t) => ({
            ...t.toObject(),
            owner: owners[t.ownerId] || null,
        }));
        res.status(200).json({ tools: toolsWithOwners });
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch tools", error: (error as Error).message });
    }
};


export const getAdminStats = async (_req: AuthRequest, res: Response): Promise<void> => {
    try {
        const categoryCounts = await Tool.aggregate([
            { $group: { _id: "$category", count: { $sum: 1 } } },
            { $project: { category: "$_id", count: 1, _id: 0 } },
        ]);

        const totalTools = await Tool.countDocuments();

        res.status(200).json({ totalTools, categoryCounts });
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch admin stats", error: (error as Error).message });
    }
};
