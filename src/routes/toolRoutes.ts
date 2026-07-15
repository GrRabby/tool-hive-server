import { Router } from "express";
import {
  getTools,
  getFeaturedTools,
  getPublicStats,
  getMyTools,
  getToolById,
  createTool,
  deleteTool,
} from "../controllers/toolController";
import { protect } from "../middleware/auth";

const router = Router();


router.get("/featured", getFeaturedTools);
router.get("/stats", getPublicStats);
router.get("/mine", protect, getMyTools);
router.get("/", getTools);
router.get("/:id", getToolById);


router.post("/", protect, createTool);
router.delete("/:id", protect, deleteTool);

export default router;
