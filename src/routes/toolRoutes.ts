import { Router } from "express";
import {
  getTools,
  getFeaturedTools,
  getPublicStats,
  getMyTools,
  getToolById,
  createTool,
  deleteTool,
} from "../controllers/toolController.js";
import { protect } from "../middleware/auth.js";

const router = Router();


router.get("/featured", getFeaturedTools);
router.get("/stats", getPublicStats);
router.get("/mine", protect, getMyTools);
router.get("/", getTools);
router.get("/:id", getToolById);


router.post("/", protect, createTool);
router.delete("/:id", protect, deleteTool);

export default router;
