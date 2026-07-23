import { Router } from "express";
import healthRoutes from "./health.routes";
import authRoutes from "../modules/auth/auth.routes";
import userRoutes from "../modules/users/user.routes";
import customerRoutes from "../modules/customers/customer.routes";
import productRoutes from "../modules/products/product.routes";
import inventoryRoutes from "../modules/inventory/inventory.routes";
import challanRoutes from "../modules/challans/challan.routes";
import dashboardRoutes from "../modules/dashboard/dashboard.routes";

const router = Router();

router.use("/health", healthRoutes);
router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/customers", customerRoutes);
router.use("/products", productRoutes);
router.use("/inventory", inventoryRoutes);
router.use("/challans", challanRoutes);
router.use("/dashboard", dashboardRoutes);

export default router;