import { Router } from "express";
import { authenticate } from "../../middleware/auth.middleware";
import { authorize } from "../../middleware/role.middleware";
import * as challanController from "./challan.controller";

const router = Router();
router.use(authenticate);
router.get("/", challanController.getChallans);
router.get("/:id", challanController.getChallan);
router.post("/", authorize("ADMIN", "SALES"), challanController.createChallan);
router.put("/:id", authorize("ADMIN", "SALES"), challanController.updateChallanStatus);
export default router;
