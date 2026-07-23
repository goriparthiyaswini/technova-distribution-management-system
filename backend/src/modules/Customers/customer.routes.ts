import { Router } from "express";
import { authenticate } from "../../middleware/auth.middleware";
import { authorize } from "../../middleware/role.middleware";
import * as customerController from "./customer.controller";

const router = Router();
router.use(authenticate);
router.get("/", customerController.getCustomers);
router.get("/:id", customerController.getCustomer);
router.post("/", authorize("ADMIN", "SALES"), customerController.createCustomer);
router.put("/:id", authorize("ADMIN", "SALES"), customerController.updateCustomer);
router.delete("/:id", authorize("ADMIN"), customerController.deleteCustomer);
export default router;