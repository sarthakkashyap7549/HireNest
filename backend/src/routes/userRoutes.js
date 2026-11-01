import { Router } from "express";
import { getMe, updateMe } from "../controllers/userController.js";
import { authenticate } from "../middleware/authenticate.js";

const router = Router();
router.get("/me", authenticate, getMe);
router.put("/me", authenticate, updateMe);
export default router;
