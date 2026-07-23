import { Router } from "express";
import { authenticate } from "../../middleware/auth.middleware";
import { authorize } from "../../middleware/role.middleware";
import * as userController from "./user.controller";

const router = Router();
router.use(authenticate, authorize("ADMIN"));
router.get("/", userController.getUsers);
router.post("/", userController.createUser);
router.delete("/:id", userController.deleteUser);
export default router;