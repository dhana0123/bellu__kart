import { products, cartItems, orders, type Product, type InsertProduct, type CartItem, type InsertCartItem, type Order, type InsertOrder } from "@shared/schema";
import type { IStorage } from "./storage-interface";

export class MemStorage implements IStorage {
  private products: Map<number, Product>;
  private cartItems: Map<string, CartItem[]>;
  private orders: Map<number, Order>;
  private currentProductId: number;
  private currentCartItemId: number;
  private currentOrderId: number;

  constructor() {
    this.products = new Map();
    this.cartItems = new Map();
    this.orders = new Map();
    this.currentProductId = 1;
    this.currentCartItemId = 1;
    this.currentOrderId = 1;

    // Initialize with sample products and orders
    this.initializeProducts();
    this.initializeSampleOrders();
  }

  private initializeProducts() {
    const sampleProducts: Omit<Product, 'id'>[] = [
      // Wellness Products
      {
        name: "Vitamin D3 Tablets",
        brand: "HealthVit",
        price: "299",
        originalPrice: "399",
        category: "wellness",
        image: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
        images: [
          "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
          "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
          "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300"
        ],
        deliveryTime: 8,
        stock: 25,
        discount: 20,
        badges: ["20% OFF"],
        inStock: true,
      },
      {
        name: "Immunity Tea Pack",
        brand: "TeaFit",
        price: "199",
        originalPrice: null,
        category: "wellness",
        image: "https://images.unsplash.com/photo-1563822249548-9a72b6353cd1?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
        images: [
          "https://images.unsplash.com/photo-1563822249548-9a72b6353cd1?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
          "https://images.unsplash.com/photo-1544787219-7f47ccb76574?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
          "https://images.unsplash.com/photo-1597318124338-1d85cf7f4813?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300"
        ],
        deliveryTime: 9,
        stock: 30,
        discount: 0,
        badges: ["NEW"],
        inStock: true,
      },
      {
        name: "Omega-3 Capsules",
        brand: "NutriMax",
        price: "599",
        originalPrice: "799",
        category: "wellness",
        image: "https://images.unsplash.com/photo-1505944270255-72b8c68c6a70?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
        images: [
          "https://images.unsplash.com/photo-1505944270255-72b8c68c6a70?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
          "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
          "https://images.unsplash.com/photo-1583224864363-6b2c5e9ee5e6?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300"
        ],
        deliveryTime: 7,
        stock: 3,
        discount: 25,
        badges: ["Low Stock"],
        inStock: true,
      },
      {
        name: "Whey Protein Powder",
        brand: "FitMax",
        price: "1299",
        originalPrice: "1599",
        category: "wellness",
        image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
        images: [
          "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
          "https://images.unsplash.com/photo-1593095948071-474c5cc2989d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
          "https://images.unsplash.com/photo-1605296867304-46d5465a13f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300"
        ],
        deliveryTime: 10,
        stock: 15,
        discount: 19,
        badges: ["BESTSELLER"],
        inStock: true,
      },
      {
        name: "Multivitamin Gummies",
        brand: "VitaBoost",
        price: "449",
        originalPrice: "599",
        category: "wellness",
        image: "https://images.unsplash.com/photo-1559757175-0eb30cd8c063?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
        images: [
          "https://images.unsplash.com/photo-1559757175-0eb30cd8c063?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
          "https://images.unsplash.com/photo-1576593115481-45e87b3b6a1c?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
          "https://images.unsplash.com/photo-1543099201-7b2b23dbcd80?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300"
        ],
        deliveryTime: 6,
        stock: 20,
        discount: 25,
        badges: ["TRENDING"],
        inStock: true,
      },
      {
        name: "Collagen Powder",
        brand: "GlowNutrition",
        price: "899",
        originalPrice: "1199",
        category: "wellness",
        image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
        images: [
          "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
          "https://images.unsplash.com/photo-1528825871115-3581a5387919?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
          "https://images.unsplash.com/photo-1564024224055-3dadc64346ec?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300"
        ],
        images: null,
        deliveryTime: 12,
        stock: 8,
        discount: 25,
        badges: ["25% OFF"],
        inStock: true,
      },

      // Skincare Products
      {
        name: "Vitamin C Serum",
        brand: "GlowSkin",
        price: "899",
        originalPrice: "1199",
        category: "skincare",
        image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
        images: [
          "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
          "https://images.unsplash.com/photo-1556228720-195a672e8a03?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
          "https://images.unsplash.com/photo-1596755389378-c31d21fd1273?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300"
        ],
        images: null,
        deliveryTime: 6,
        stock: 18,
        discount: 25,
        badges: ["TRENDING"],
        inStock: true,
      },
      {
        name: "Hydrating Face Cream",
        brand: "AquaGlow",
        price: "699",
        originalPrice: null,
        category: "skincare",
        image: "https://images.unsplash.com/photo-1596755389378-c31d21fd1273?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
        images: null,
        deliveryTime: 8,
        stock: 22,
        discount: 0,
        badges: ["HYDRATING"],
        inStock: true,
      },
      {
        name: "Gentle Face Cleanser",
        brand: "PureSkin",
        price: "399",
        originalPrice: "499",
        category: "skincare",
        image: "https://images.unsplash.com/photo-1612817288484-6f916006741a?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
        images: null,
        deliveryTime: 7,
        stock: 35,
        discount: 20,
        badges: ["GENTLE"],
        inStock: true,
      },
      {
        name: "Sunscreen SPF 50",
        brand: "SunShield",
        price: "599",
        originalPrice: null,
        category: "skincare",
        image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
        images: null,
        deliveryTime: 9,
        stock: 28,
        discount: 0,
        badges: ["SPF 50"],
        inStock: true,
      },
      {
        name: "Retinol Night Cream",
        brand: "YouthGlow",
        price: "1299",
        originalPrice: "1699",
        category: "skincare",
        image: "https://images.unsplash.com/photo-1570194065650-d99bf4d046f9?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
        images: null,
        deliveryTime: 11,
        stock: 12,
        discount: 24,
        badges: ["ANTI-AGING"],
        inStock: true,
      },
      {
        name: "Niacinamide Serum",
        brand: "ClearSkin",
        price: "599",
        originalPrice: "799",
        category: "skincare",
        image: "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
        images: null,
        deliveryTime: 8,
        stock: 16,
        discount: 25,
        badges: ["PORE CONTROL"],
        inStock: true,
      },

      // Electronics Products
      {
        name: "Power Bank 10000mAh",
        brand: "TechCharge",
        price: "1299",
        originalPrice: "1699",
        category: "electronics",
        image: "https://images.unsplash.com/photo-1609592704166-2d4c6c6c9b3b?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
        images: null,
        deliveryTime: 12,
        stock: 14,
        discount: 24,
        badges: ["10000mAh"],
        inStock: true,
      },
      {
        name: "Bluetooth Earbuds Pro",
        brand: "SoundMax",
        price: "2999",
        originalPrice: "4999",
        category: "electronics",
        image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
        images: null,
        deliveryTime: 15,
        stock: 7,
        discount: 40,
        badges: ["WIRELESS"],
        inStock: true,
      },
      {
        name: "Type-C Fast Cable",
        brand: "CablePro",
        price: "399",
        originalPrice: "599",
        category: "electronics",
        image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
        images: null,
        deliveryTime: 8,
        stock: 45,
        discount: 33,
        badges: ["FAST CHARGE"],
        inStock: true,
      },
      {
        name: "Shockproof Phone Case",
        brand: "ArmorShield",
        price: "699",
        originalPrice: "999",
        category: "electronics",
        image: "https://images.unsplash.com/photo-1556656793-08538906a9f8?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
        images: null,
        deliveryTime: 6,
        stock: 32,
        discount: 30,
        badges: ["PROTECTIVE"],
        inStock: true,
      },
    ];

    sampleProducts.forEach(product => {
      const id = this.currentProductId++;
      this.products.set(id, { ...product, id });
    });
  }

  private initializeSampleOrders() {
    const sampleOrders = [
      {
        sessionId: "user-123",
        total: "1298",
        paymentMethod: "UPI",
        address: "123 MG Road, Koramangala, Bangalore",
        phone: "+91 9876543210",
        status: "pending",
        items: JSON.stringify([
          { id: 1, name: "Vitamin D3 Tablets", brand: "HealthVit", price: "299", quantity: 2, image: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300" },
          { id: 2, name: "Vitamin C Serum", brand: "GlowSkin", price: "699", quantity: 1, image: "https://images.unsplash.com/photo-1570194065650-d99bf4d046f9?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300" }
        ]),
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
      },
      {
        sessionId: "user-456",
        total: "1999",
        paymentMethod: "Credit Card",
        address: "456 Indiranagar, Bangalore",
        phone: "+91 8765432109",
        status: "confirmed",
        items: JSON.stringify([
          { id: 8, name: "Bluetooth Earbuds Pro", brand: "SoundMax", price: "2999", quantity: 1, image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300" }
        ]),
        createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(), // 4 hours ago
      },
      {
        sessionId: "user-789",
        total: "899",
        paymentMethod: "COD",
        address: "789 Whitefield, Bangalore",
        phone: "+91 7654321098",
        status: "delivered",
        items: JSON.stringify([
          { id: 3, name: "Hydrating Face Cream", brand: "AquaGlow", price: "699", quantity: 1, image: "https://images.unsplash.com/photo-1596755389378-c31d21fd1273?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300" },
          { id: 4, name: "Immunity Tea Pack", brand: "TeaFit", price: "199", quantity: 1, image: "https://images.unsplash.com/photo-1563822249548-9a72b6353cd1?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300" }
        ]),
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
      },
      {
        sessionId: "user-101",
        total: "1599",
        paymentMethod: "UPI",
        address: "101 HSR Layout, Bangalore",
        phone: "+91 6543210987",
        status: "out_for_delivery",
        items: JSON.stringify([
          { id: 7, name: "Power Bank 10000mAh", brand: "TechCharge", price: "1299", quantity: 1, image: "https://images.unsplash.com/photo-1609592704166-2d4c6c6c9b3b?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300" },
          { id: 5, name: "Retinol Night Cream", brand: "YouthGlow", price: "1299", quantity: 1, image: "https://images.unsplash.com/photo-1570194065650-d99bf4d046f9?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300" }
        ]),
        createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(), // 30 minutes ago
      }
    ];

    sampleOrders.forEach(order => {
      const id = this.currentOrderId++;
      this.orders.set(id, { ...order, id });
    });
  }

  // Products
  async getProducts(): Promise<Product[]> {
    return Array.from(this.products.values());
  }

  async getProductsByCategory(category: string): Promise<Product[]> {
    return Array.from(this.products.values()).filter(product => product.category === category);
  }

  async getProduct(id: number): Promise<Product | undefined> {
    return this.products.get(id);
  }

  async createProduct(insertProduct: InsertProduct): Promise<Product> {
    const id = this.currentProductId++;
    const product: Product = { 
      ...insertProduct, 
      id,
      originalPrice: insertProduct.originalPrice ?? null,
      stock: insertProduct.stock ?? 0,
      discount: insertProduct.discount ?? null,
      badges: insertProduct.badges ?? null,
      inStock: insertProduct.inStock ?? true
    };
    this.products.set(id, product);
    return product;
  }

  async updateProductStock(id: number, stock: number): Promise<void> {
    const product = this.products.get(id);
    if (product) {
      product.stock = stock;
      product.inStock = stock > 0;
      this.products.set(id, product);
    }
  }

  // Cart
  async getCartItems(sessionId: string): Promise<CartItem[]> {
    return this.cartItems.get(sessionId) || [];
  }

  async addToCart(insertItem: InsertCartItem): Promise<CartItem> {
    const id = this.currentCartItemId++;
    const item: CartItem = { 
      ...insertItem, 
      id,
      quantity: insertItem.quantity ?? 1
    };
    
    const sessionItems = this.cartItems.get(insertItem.sessionId) || [];
    const existingItemIndex = sessionItems.findIndex(i => i.productId === insertItem.productId);
    
    if (existingItemIndex >= 0) {
      sessionItems[existingItemIndex].quantity += (insertItem.quantity ?? 1);
    } else {
      sessionItems.push(item);
    }
    
    this.cartItems.set(insertItem.sessionId, sessionItems);
    return item;
  }

  async updateCartItemQuantity(sessionId: string, productId: number, quantity: number): Promise<void> {
    const sessionItems = this.cartItems.get(sessionId) || [];
    const itemIndex = sessionItems.findIndex(i => i.productId === productId);
    
    if (itemIndex >= 0) {
      if (quantity <= 0) {
        sessionItems.splice(itemIndex, 1);
      } else {
        sessionItems[itemIndex].quantity = quantity;
      }
      this.cartItems.set(sessionId, sessionItems);
    }
  }

  async removeFromCart(sessionId: string, productId: number): Promise<void> {
    const sessionItems = this.cartItems.get(sessionId) || [];
    const filteredItems = sessionItems.filter(i => i.productId !== productId);
    this.cartItems.set(sessionId, filteredItems);
  }

  async clearCart(sessionId: string): Promise<void> {
    this.cartItems.set(sessionId, []);
  }

  // Orders
  async createOrder(insertOrder: InsertOrder): Promise<Order> {
    const id = this.currentOrderId++;
    const order: Order = { 
      ...insertOrder, 
      id,
      status: insertOrder.status ?? "pending"
    };
    this.orders.set(id, order);
    return order;
  }

  async getOrder(id: number): Promise<Order | undefined> {
    return this.orders.get(id);
  }

  async getOrdersBySession(sessionId: string): Promise<Order[]> {
    return Array.from(this.orders.values()).filter(order => order.sessionId === sessionId);
  }

  async getAllOrders(): Promise<Order[]> {
    return Array.from(this.orders.values()).sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  async updateOrderStatus(id: number, status: string): Promise<void> {
    const order = this.orders.get(id);
    if (order) {
      order.status = status;
    }
  }

  async updateProduct(id: number, insertProduct: InsertProduct): Promise<Product> {
    const existingProduct = this.products.get(id);
    if (!existingProduct) {
      throw new Error("Product not found");
    }
    
    const updatedProduct: Product = {
      ...existingProduct,
      ...insertProduct,
      id,
    };
    
    this.products.set(id, updatedProduct);
    return updatedProduct;
  }

  async deleteProduct(id: number): Promise<void> {
    this.products.delete(id);
  }
}

import { mongoStorage } from "./db";

// Initialize MongoDB connection
mongoStorage.connect().catch(console.error);

export const storage = mongoStorage;
