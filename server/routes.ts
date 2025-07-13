import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertCartItemSchema, insertOrderSchema, insertProductSchema, insertAppConfigSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Products
  app.get("/api/products", async (req, res) => {
    try {
      const { category } = req.query;
      let products;
      
      if (category && category !== 'all') {
        products = await storage.getProductsByCategory(category as string);
      } else {
        products = await storage.getProducts();
      }
      
      res.json(products);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch products" });
    }
  });

  app.get("/api/products/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const product = await storage.getProduct(id);
      
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      
      res.json(product);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch product" });
    }
  });

  // Cart
  app.get("/api/cart/:sessionId", async (req, res) => {
    try {
      const { sessionId } = req.params;
      const cartItems = await storage.getCartItems(sessionId);
      
      // Enrich cart items with product details
      const enrichedItems = await Promise.all(
        cartItems.map(async (item) => {
          const product = await storage.getProduct(item.productId);
          return { ...item, product };
        })
      );
      
      res.json(enrichedItems);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch cart items" });
    }
  });

  app.post("/api/cart", async (req, res) => {
    try {
      const cartItemData = insertCartItemSchema.parse(req.body);
      const cartItem = await storage.addToCart(cartItemData);
      res.json(cartItem);
    } catch (error) {
      res.status(400).json({ message: "Invalid cart item data" });
    }
  });

  app.patch("/api/cart/:sessionId/:productId", async (req, res) => {
    try {
      const { sessionId, productId } = req.params;
      const { quantity } = req.body;
      
      await storage.updateCartItemQuantity(
        sessionId,
        parseInt(productId),
        parseInt(quantity)
      );
      
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ message: "Failed to update cart item" });
    }
  });

  app.delete("/api/cart/:sessionId/:productId", async (req, res) => {
    try {
      const { sessionId, productId } = req.params;
      
      await storage.removeFromCart(sessionId, parseInt(productId));
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ message: "Failed to remove cart item" });
    }
  });

  app.delete("/api/cart/:sessionId", async (req, res) => {
    try {
      const { sessionId } = req.params;
      await storage.clearCart(sessionId);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ message: "Failed to clear cart" });
    }
  });

  // Orders
  app.post("/api/orders", async (req, res) => {
    try {
      const orderData = insertOrderSchema.parse(req.body);
      const order = await storage.createOrder(orderData);
      
      // Clear cart after successful order
      await storage.clearCart(orderData.sessionId);
      
      res.json(order);
    } catch (error) {
      res.status(400).json({ message: "Invalid order data" });
    }
  });

  app.get("/api/orders/:sessionId", async (req, res) => {
    try {
      const { sessionId } = req.params;
      const orders = await storage.getOrdersBySession(sessionId);
      res.json(orders);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch orders" });
    }
  });

  // Admin - Products Management
  app.post("/api/products", async (req, res) => {
    try {
      const productData = insertProductSchema.parse(req.body);
      const product = await storage.createProduct(productData);
      res.json(product);
    } catch (error) {
      res.status(400).json({ message: "Invalid product data" });
    }
  });

  app.put("/api/products/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const productData = insertProductSchema.parse(req.body);
      const product = await storage.updateProduct(id, productData);
      res.json(product);
    } catch (error) {
      res.status(400).json({ message: "Failed to update product" });
    }
  });

  app.delete("/api/products/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteProduct(id);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete product" });
    }
  });

  // Admin - Orders Management
  app.get("/api/admin/orders", async (req, res) => {
    try {
      const orders = await storage.getAllOrders();
      res.json(orders);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch orders" });
    }
  });

  app.put("/api/orders/:id/status", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { status } = req.body;
      await storage.updateOrderStatus(id, status);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ message: "Failed to update order status" });
    }
  });

  // Get available categories (from products)
  app.get("/api/categories", async (req, res) => {
    try {
      const categories = await storage.getAvailableCategories();
      res.json(categories);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch categories" });
    }
  });

  // Configuration management
  app.get("/api/admin/config", async (req, res) => {
    try {
      const configs = await storage.getAllConfigs();
      res.json(configs);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch configurations" });
    }
  });

  app.get("/api/admin/config/:key", async (req, res) => {
    try {
      const { key } = req.params;
      const config = await storage.getConfig(key);
      
      if (!config) {
        return res.status(404).json({ message: "Configuration not found" });
      }
      
      res.json(config);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch configuration" });
    }
  });

  app.post("/api/admin/config", async (req, res) => {
    try {
      const configData = insertAppConfigSchema.parse(req.body);
      const config = await storage.setConfig(configData);
      res.json(config);
    } catch (error) {
      res.status(400).json({ message: "Invalid configuration data" });
    }
  });

  // Enhanced pincode checker using configuration
  app.post("/api/pincode/check", async (req, res) => {
    try {
      const { pincode } = req.body;
      
      // Get allowed pincodes from configuration
      const pincodeConfig = await storage.getConfig('allowed_pincodes');
      const allowedPincodes = pincodeConfig?.value as string[] || [];
      
      const isServiceable = allowedPincodes.includes(pincode);
      
      res.json({
        serviceable: isServiceable,
        estimatedDelivery: isServiceable ? 10 : null,
        area: isServiceable ? "Bangalore" : null,
        message: isServiceable 
          ? "Great! We deliver to your area in 10 minutes" 
          : "Sorry, we don't deliver to this area yet"
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to check pincode" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
