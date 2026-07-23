import { Router } from "express";
import { authenticate } from "../../middleware/auth.middleware";
import { authorize } from "../../middleware/role.middleware";
import * as inventoryController from "./inventory.controller";

const router = Router();
router.use(authenticate);
router.get("/", inventoryController.getMovements);
router.post("/", authorize("ADMIN", "WAREHOUSE"), inventoryController.createMovement);
export default router;