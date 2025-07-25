import type { Product, CartItem, Order, AppConfig, InsertProduct, InsertCartItem, InsertOrder, InsertAppConfig } from "@shared/schema";

export interface IStorage {
  // Products
  getProducts(): Promise<Product[]>;
  getProductsByCategory(category: string): Promise<Product[]>;
  getProduct(id: number): Promise<Product | undefined>;
  createProduct(product: InsertProduct): Promise<Product>;
  updateProduct(id: number, product: InsertProduct): Promise<Product>;
  deleteProduct(id: number): Promise<void>;
  updateProductStock(id: number, stock: number): Promise<void>;
  getAvailableCategories(): Promise<string[]>;

  // Cart
  getCartItems(sessionId: string): Promise<CartItem[]>;
  addToCart(item: InsertCartItem): Promise<CartItem>;
  updateCartItemQuantity(sessionId: string, productId: number, quantity: number): Promise<void>;
  removeFromCart(sessionId: string, productId: number): Promise<void>;
  clearCart(sessionId: string): Promise<void>;

  // Orders
  createOrder(order: InsertOrder): Promise<Order>;
  getOrder(id: number): Promise<Order | undefined>;
  getOrdersBySession(sessionId: string): Promise<Order[]>;
  getAllOrders(): Promise<Order[]>;
  updateOrderStatus(id: number, status: string): Promise<void>;

  // Configuration
  getConfig(key: string): Promise<AppConfig | undefined>;
  setConfig(config: InsertAppConfig): Promise<AppConfig>;
  getAllConfigs(): Promise<AppConfig[]>;
}