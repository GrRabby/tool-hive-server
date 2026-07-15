import { Router } from "express";
import { getAllToolsAdmin, getAdminStats } from "../controllers/toolController";
import { protect } from "../middleware/auth";
import { isAdmin } from "../middleware/isAdmin";

const router = Router();

router.get("/tools", protect, isAdmin, getAllToolsAdmin);
router.get("/stats", protect, isAdmin, getAdminStats);

export default router;
