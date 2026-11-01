import { Router } from "express";
import { apply, listApplications, withdraw } from "../controllers/applicationController.js";
import { authenticate } from "../middleware/authenticate.js";

const router = Router();
router.use(authenticate);
router.get("/", listApplications);
router.post("/", apply);
router.delete("/:id", withdraw);
export default router;
