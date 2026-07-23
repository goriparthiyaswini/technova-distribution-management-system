import { Router } from "express";
import { authenticate } from "../../middleware/auth.middleware";
import { authorize } from "../../middleware/role.middleware";
import * as productController from "./product.controller";

const router = Router();
router.use(authenticate);
router.get("/", productController.getProducts);
router.get("/:id", productController.getProduct);
router.post("/", authorize("ADMIN", "WAREHOUSE"), productController.createProduct);
router.put("/:id", authorize("ADMIN", "WAREHOUSE"), productController.updateProduct);
router.delete("/:id", authorize("ADMIN"), productController.deleteProduct);
export default router;