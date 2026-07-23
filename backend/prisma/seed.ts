// Populates technova_db with demo users, 12 products, 8 customers.
// Run: npm run seed

import { PrismaClient, Role } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function seedUsers() {
  const password = await bcrypt.hash("Password@123", 10);
  const users: { name: string; email: string; role: Role }[] = [
    { name: "Admin User", email: "admin@technova.com", role: "ADMIN" },
    { name: "Sales User", email: "sales@technova.com", role: "SALES" },
    { name: "Warehouse User", email: "warehouse@technova.com", role: "WAREHOUSE" },
    { name: "Accounts User", email: "accounts@technova.com", role: "ACCOUNTS" },
  ];
  for (const u of users) {
    await prisma.user.upsert({ where: { email: u.email }, update: {}, create: { ...u, password } });
  }
  return prisma.user.findFirstOrThrow({ where: { role: "WAREHOUSE" } });
}

async function seedProducts(warehouseUserId: string) {
  const products = [
    { name: "Logitech Wireless Mouse", sku: "MOU001", category: "Accessories", price: 699, stock: 80, minStock: 15 },
    { name: "HP Keyboard", sku: "KEY001", category: "Accessories", price: 1199, stock: 60, minStock: 15 },
    { name: 'Dell Monitor 24"', sku: "MON001", category: "Monitor", price: 12999, stock: 25, minStock: 5 },
    { name: "Samsung SSD 1TB", sku: "SSD001", category: "Storage", price: 6499, stock: 40, minStock: 10 },
    { name: "Seagate HDD 2TB", sku: "HDD001", category: "Storage", price: 5999, stock: 35, minStock: 10 },
    { name: "TP-Link WiFi Router", sku: "ROU001", category: "Networking", price: 2499, stock: 50, minStock: 10 },
    { name: "HDMI Cable", sku: "CAB001", category: "Cable", price: 399, stock: 4, minStock: 20 },
    { name: "USB Hub", sku: "HUB001", category: "Accessories", price: 799, stock: 45, minStock: 10 },
    { name: "Laptop Stand", sku: "STA001", category: "Accessories", price: 999, stock: 30, minStock: 8 },
    { name: "Webcam", sku: "CAM001", category: "Camera", price: 2999, stock: 3, minStock: 10 },
    { name: "Bluetooth Speaker", sku: "SPE001", category: "Audio", price: 3499, stock: 28, minStock: 8 },
    { name: "Power Bank 20000mAh", sku: "PWB001", category: "Accessories", price: 1899, stock: 55, minStock: 15 },
  ];
  for (const p of products) {
    const { stock, ...rest } = p;
    const product = await prisma.product.upsert({
      where: { sku: p.sku }, update: {},
      create: { ...rest, warehouse: "Main Warehouse, Hyderabad", stock: 0 },
    });
    if (product.stock === 0 && stock > 0) {
      await prisma.$transaction([
        prisma.product.update({ where: { id: product.id }, data: { stock } }),
        prisma.inventoryLog.create({
          data: { productId: product.id, quantity: stock, type: "IN", reason: "Initial stock on setup", createdBy: warehouseUserId },
        }),
      ]);
    }
  }
}

async function seedCustomers() {
  const customers = [
    { name: "Ramesh Kumar", business: "RK Electronics", phone: "9876543210", gst: "36ABCDE1234F1Z5", status: "ACTIVE" as const },
    { name: "Suresh Reddy", business: "Smart Computers", phone: "9876500001", gst: "36ABCDE1235F1Z5", status: "ACTIVE" as const },
    { name: "Anil Sharma", business: "Tech World", phone: "9876500002", gst: "36ABCDE1236F1Z5", status: "ACTIVE" as const },
    { name: "Priya Nair", business: "City Electronics", phone: "9876500003", gst: "36ABCDE1237F1Z5", status: "ACTIVE" as const },
    { name: "Vikram Singh", business: "Digital Hub", phone: "9876500004", gst: "36ABCDE1238F1Z5", status: "ACTIVE" as const },
    { name: "Kavitha Rao", business: "Future Technologies", phone: "9876500005", gst: "36ABCDE1239F1Z5", status: "ACTIVE" as const },
    { name: "Manoj Gupta", business: "Sai Computers", phone: "9876500006", gst: "36ABCDE1240F1Z5", status: "INACTIVE" as const },
    { name: "Deepa Iyer", business: "Vision IT Solutions", phone: "9876500007", gst: "36ABCDE1241F1Z5", status: "ACTIVE" as const },
  ];
  for (const c of customers) {
    const existing = await prisma.customer.findFirst({ where: { business: c.business } });
    if (!existing) await prisma.customer.create({ data: c });
  }
}

async function main() {
  const warehouseUser = await seedUsers();
  await seedProducts(warehouseUser.id);
  await seedCustomers();
  console.log("✅ Seed complete. Login: admin@technova.com / Password@123 (also sales/warehouse/accounts@technova.com)");
}

main().catch((e) => { console.error(e); process.exit(1); }).finally(() => prisma.$disconnect());