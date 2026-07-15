import { Router } from "express";
import { getAllToolsAdmin, getAdminStats } from "../controllers/toolController.js";
import { protect } from "../middleware/auth.js";
import { isAdmin } from "../middleware/isAdmin.js";

const router = Router();

router.get("/tools", protect, isAdmin, getAllToolsAdmin);
router.get("/stats", protect, isAdmin, getAdminStats);

export default router;
