import { pgTable, text, serial, integer, boolean, decimal, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  brand: text("brand").notNull(),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  originalPrice: decimal("original_price", { precision: 10, scale: 2 }),
  category: text("category").notNull(), // wellness, skincare, electronics
  image: text("image").notNull(),
  images: text("images").array().default([]),
  deliveryTime: integer("delivery_time").notNull(), // in minutes
  stock: integer("stock").notNull().default(0),
  discount: integer("discount").default(0), // percentage
  badges: text("badges").array().default([]), // e.g., ["NEW", "TRENDING", "BESTSELLER"]
  inStock: boolean("in_stock").notNull().default(true),
});

export const cartItems = pgTable("cart_items", {
  id: serial("id").primaryKey(),
  sessionId: text("session_id").notNull(),
  productId: integer("product_id").notNull(),
  quantity: integer("quantity").notNull().default(1),
});

export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  sessionId: text("session_id").notNull(),
  items: jsonb("items").notNull(), // array of cart items
  total: decimal("total", { precision: 10, scale: 2 }).notNull(),
  paymentMethod: text("payment_method").notNull(), // upi, card, cod
  deliveryAddress: jsonb("delivery_address").notNull(),
  status: text("status").notNull().default("pending"), // pending, confirmed, delivered
  estimatedDelivery: integer("estimated_delivery").notNull(), // in minutes
});

export const appConfig = pgTable("app_config", {
  id: serial("id").primaryKey(),
  key: text("key").notNull().unique(),
  value: jsonb("value").notNull(),
  description: text("description"),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertProductSchema = createInsertSchema(products);

export const insertCartItemSchema = createInsertSchema(cartItems);

export const insertOrderSchema = createInsertSchema(orders);

export const insertAppConfigSchema = createInsertSchema(appConfig);

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertProduct = z.infer<typeof insertProductSchema>;
export type Product = typeof products.$inferSelect;

export type InsertCartItem = z.infer<typeof insertCartItemSchema>;
export type CartItem = typeof cartItems.$inferSelect;

export type InsertOrder = z.infer<typeof insertOrderSchema>;
export type Order = typeof orders.$inferSelect;

export type InsertAppConfig = z.infer<typeof insertAppConfigSchema>;
export type AppConfig = typeof appConfig.$inferSelect;
