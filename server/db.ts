import { MongoClient, Db, Collection } from 'mongodb';
import type { Product, CartItem, Order, InsertProduct, InsertCartItem, InsertOrder } from '@shared/schema';
import type { IStorage } from './storage-interface';

const uri = "mongodb+srv://me:1234@m-886829.bzv6ep5.mongodb.net/?retryWrites=true&w=majority&appName=m-886829";

class MongoStorage implements IStorage {
  private client: MongoClient;
  private db: Db | null = null;
  private products: Collection<Product> | null = null;
  private cartItems: Collection<CartItem> | null = null;
  private orders: Collection<Order> | null = null;

  constructor() {
    this.client = new MongoClient(uri);
  }

  async connect(): Promise<void> {
    try {
      await this.client.connect();
      this.db = this.client.db('bellu_ecommerce');
      this.products = this.db.collection<Product>('products');
      this.cartItems = this.db.collection<CartItem>('cart_items');
      this.orders = this.db.collection<Order>('orders');
      
      console.log('Connected to MongoDB successfully');
      
      // Initialize with sample data if collections are empty
      await this.initializeSampleData();
    } catch (error) {
      console.error('Failed to connect to MongoDB:', error);
      throw error;
    }
  }

  private async initializeSampleData(): Promise<void> {
    if (!this.products || !this.orders) return;

    // Check if products collection is empty
    const productCount = await this.products.countDocuments();
    if (productCount === 0) {
      await this.initializeProducts();
    }

    // Check if orders collection is empty
    const orderCount = await this.orders.countDocuments();
    if (orderCount === 0) {
      await this.initializeOrders();
    }
  }

  private async initializeProducts(): Promise<void> {
    if (!this.products) return;

    const sampleProducts = [
      {
        id: 1,
        name: "Vitamin D3 Tablets",
        brand: "HealthVit",
        price: "299",
        originalPrice: "399",
        description: "Essential vitamin D3 supplement for bone health and immunity. Each tablet contains 2000 IU of vitamin D3 for optimal absorption.",
        image: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
        images: [
          "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
          "https://images.unsplash.com/photo-1584362917165-526a968579e8?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300"
        ],
        category: "wellness",
        deliveryTime: 10,
        stock: 45,
        discount: 25,
        badges: ["NEW"],
        inStock: true,
      },
      {
        id: 2,
        name: "Vitamin C Serum",
        brand: "GlowSkin",
        price: "699",
        originalPrice: "999",
        description: "Brightening vitamin C serum with 20% L-ascorbic acid. Reduces dark spots and enhances skin radiance.",
        image: "https://images.unsplash.com/photo-1570194065650-d99bf4d046f9?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
        images: [
          "https://images.unsplash.com/photo-1570194065650-d99bf4d046f9?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
          "https://images.unsplash.com/photo-1596755389378-c31d21fd1273?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300"
        ],
        category: "skincare",
        deliveryTime: 8,
        stock: 32,
        discount: 30,
        badges: ["BESTSELLER"],
        inStock: true,
      },
      {
        id: 3,
        name: "Hydrating Face Cream",
        brand: "AquaGlow",
        price: "699",
        originalPrice: null,
        description: "Deep hydrating face cream with hyaluronic acid and ceramides. Perfect for dry and sensitive skin.",
        image: "https://images.unsplash.com/photo-1596755389378-c31d21fd1273?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
        images: [
          "https://images.unsplash.com/photo-1596755389378-c31d21fd1273?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
          "https://images.unsplash.com/photo-1570194065650-d99bf4d046f9?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300"
        ],
        category: "skincare",
        deliveryTime: 10,
        stock: 28,
        discount: null,
        badges: null,
        inStock: true,
      },
      {
        id: 4,
        name: "Immunity Tea Pack",
        brand: "TeaFit",
        price: "199",
        originalPrice: "249",
        description: "Herbal immunity tea blend with tulsi, ginger, and turmeric. Boosts natural immunity and aids digestion.",
        image: "https://images.unsplash.com/photo-1563822249548-9a72b6353cd1?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
        images: [
          "https://images.unsplash.com/photo-1563822249548-9a72b6353cd1?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
          "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300"
        ],
        category: "wellness",
        deliveryTime: 7,
        stock: 50,
        discount: 20,
        badges: ["TRENDING"],
        inStock: true,
      },
      {
        id: 5,
        name: "Retinol Night Cream",
        brand: "YouthGlow",
        price: "1299",
        originalPrice: "1699",
        description: "Anti-aging night cream with 0.5% retinol. Reduces fine lines and improves skin texture overnight.",
        image: "https://images.unsplash.com/photo-1570194065650-d99bf4d046f9?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
        images: [
          "https://images.unsplash.com/photo-1570194065650-d99bf4d046f9?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
          "https://images.unsplash.com/photo-1596755389378-c31d21fd1273?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300"
        ],
        category: "skincare",
        deliveryTime: 9,
        stock: 15,
        discount: 24,
        badges: ["NEW", "BESTSELLER"],
        inStock: true,
      },
      {
        id: 6,
        name: "Wireless Charging Pad",
        brand: "TechFast",
        price: "899",
        originalPrice: "1299",
        description: "Fast wireless charging pad compatible with all Qi-enabled devices. LED indicator and safety features included.",
        image: "https://images.unsplash.com/photo-1586953208448-b95a79798f07?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
        images: [
          "https://images.unsplash.com/photo-1586953208448-b95a79798f07?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
          "https://images.unsplash.com/photo-1609592704166-2d4c6c6c9b3b?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300"
        ],
        category: "electronics",
        deliveryTime: 5,
        stock: 22,
        discount: 31,
        badges: ["TRENDING"],
        inStock: true,
      },
      {
        id: 7,
        name: "Power Bank 10000mAh",
        brand: "TechCharge",
        price: "1299",
        originalPrice: "1799",
        description: "Compact 10000mAh power bank with fast charging and dual USB ports. Perfect for travel and emergencies.",
        image: "https://images.unsplash.com/photo-1609592704166-2d4c6c6c9b3b?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
        images: [
          "https://images.unsplash.com/photo-1609592704166-2d4c6c6c9b3b?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
          "https://images.unsplash.com/photo-1586953208448-b95a79798f07?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300"
        ],
        category: "electronics",
        deliveryTime: 6,
        stock: 35,
        discount: 28,
        badges: ["BESTSELLER"],
        inStock: true,
      },
      {
        id: 8,
        name: "Bluetooth Earbuds Pro",
        brand: "SoundMax",
        price: "2999",
        originalPrice: "3999",
        description: "Premium wireless earbuds with active noise cancellation and 24-hour battery life. Crystal clear audio quality.",
        image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
        images: [
          "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
          "https://images.unsplash.com/photo-1609592704166-2d4c6c6c9b3b?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300"
        ],
        category: "electronics",
        deliveryTime: 8,
        stock: 18,
        discount: 25,
        badges: ["NEW", "TRENDING"],
        inStock: true,
      },
      {
        id: 9,
        name: "Smart Fitness Watch",
        brand: "FitTrack",
        price: "4999",
        originalPrice: "6999",
        description: "Advanced fitness tracking watch with heart rate monitor, GPS, and 7-day battery life. Water resistant design.",
        image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
        images: [
          "https://images.unsplash.com/photo-1523275335684-37898b6baf30?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
          "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300"
        ],
        category: "electronics",
        deliveryTime: 10,
        stock: 12,
        discount: 29,
        badges: ["NEW"],
        inStock: true,
      },
      {
        id: 10,
        name: "Blue Light Blocking Glasses",
        brand: "EyeShield",
        price: "599",
        originalPrice: "899",
        description: "Computer glasses with blue light blocking technology. Reduces eye strain and improves sleep quality.",
        image: "https://images.unsplash.com/photo-1574258495973-f010dfbb5371?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
        images: [
          "https://images.unsplash.com/photo-1574258495973-f010dfbb5371?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
          "https://images.unsplash.com/photo-1523275335684-37898b6baf30?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300"
        ],
        category: "electronics",
        deliveryTime: 5,
        stock: 40,
        discount: 33,
        badges: ["PROTECTIVE"],
        inStock: true,
      }
    ];

    await this.products.insertMany(sampleProducts);
    console.log('Sample products initialized in MongoDB');
  }

  private async initializeOrders(): Promise<void> {
    if (!this.orders) return;

    const sampleOrders = [
      {
        id: 1,
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
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: 2,
        sessionId: "user-456",
        total: "2999",
        paymentMethod: "Credit Card",
        address: "456 Indiranagar, Bangalore",
        phone: "+91 8765432109",
        status: "confirmed",
        items: JSON.stringify([
          { id: 8, name: "Bluetooth Earbuds Pro", brand: "SoundMax", price: "2999", quantity: 1, image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300" }
        ]),
        createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: 3,
        sessionId: "user-789",
        total: "898",
        paymentMethod: "COD",
        address: "789 Whitefield, Bangalore",
        phone: "+91 7654321098",
        status: "delivered",
        items: JSON.stringify([
          { id: 3, name: "Hydrating Face Cream", brand: "AquaGlow", price: "699", quantity: 1, image: "https://images.unsplash.com/photo-1596755389378-c31d21fd1273?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300" },
          { id: 4, name: "Immunity Tea Pack", brand: "TeaFit", price: "199", quantity: 1, image: "https://images.unsplash.com/photo-1563822249548-9a72b6353cd1?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300" }
        ]),
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: 4,
        sessionId: "user-101",
        total: "2598",
        paymentMethod: "UPI",
        address: "101 HSR Layout, Bangalore",
        phone: "+91 6543210987",
        status: "out_for_delivery",
        items: JSON.stringify([
          { id: 7, name: "Power Bank 10000mAh", brand: "TechCharge", price: "1299", quantity: 1, image: "https://images.unsplash.com/photo-1609592704166-2d4c6c6c9b3b?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300" },
          { id: 5, name: "Retinol Night Cream", brand: "YouthGlow", price: "1299", quantity: 1, image: "https://images.unsplash.com/photo-1570194065650-d99bf4d046f9?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300" }
        ]),
        createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
      }
    ];

    await this.orders.insertMany(sampleOrders);
    console.log('Sample orders initialized in MongoDB');
  }

  // Products
  async getProducts(): Promise<Product[]> {
    if (!this.products) throw new Error('Database not connected');
    return await this.products.find({}).toArray();
  }

  async getProductsByCategory(category: string): Promise<Product[]> {
    if (!this.products) throw new Error('Database not connected');
    return await this.products.find({ category }).toArray();
  }

  async getProduct(id: number): Promise<Product | undefined> {
    if (!this.products) throw new Error('Database not connected');
    const product = await this.products.findOne({ id });
    return product || undefined;
  }

  async createProduct(product: InsertProduct): Promise<Product> {
    if (!this.products) throw new Error('Database not connected');
    
    // Get the next ID
    const lastProduct = await this.products.findOne({}, { sort: { id: -1 } });
    const nextId = (lastProduct?.id || 0) + 1;
    
    const newProduct: Product = {
      ...product,
      id: nextId,
      originalPrice: product.originalPrice ?? null,
      stock: product.stock ?? 0,
      discount: product.discount ?? null,
      badges: product.badges ?? null,
      inStock: product.inStock ?? true
    };
    
    await this.products.insertOne(newProduct);
    return newProduct;
  }

  async updateProduct(id: number, product: InsertProduct): Promise<Product> {
    if (!this.products) throw new Error('Database not connected');
    
    const updatedProduct: Product = {
      ...product,
      id,
      originalPrice: product.originalPrice ?? null,
      stock: product.stock ?? 0,
      discount: product.discount ?? null,
      badges: product.badges ?? null,
      inStock: product.inStock ?? true
    };
    
    await this.products.replaceOne({ id }, updatedProduct);
    return updatedProduct;
  }

  async deleteProduct(id: number): Promise<void> {
    if (!this.products) throw new Error('Database not connected');
    await this.products.deleteOne({ id });
  }

  async updateProductStock(id: number, stock: number): Promise<void> {
    if (!this.products) throw new Error('Database not connected');
    await this.products.updateOne({ id }, { $set: { stock, inStock: stock > 0 } });
  }

  // Cart (keeping in-memory for session-based cart)
  private cartItemsMap: Map<string, CartItem[]> = new Map();
  private currentCartItemId = 1;

  async getCartItems(sessionId: string): Promise<CartItem[]> {
    return this.cartItemsMap.get(sessionId) || [];
  }

  async addToCart(insertItem: InsertCartItem): Promise<CartItem> {
    const id = this.currentCartItemId++;
    const item: CartItem = { 
      ...insertItem, 
      id,
      quantity: insertItem.quantity ?? 1
    };
    
    const sessionItems = this.cartItemsMap.get(insertItem.sessionId) || [];
    const existingItemIndex = sessionItems.findIndex(i => i.productId === insertItem.productId);
    
    if (existingItemIndex >= 0) {
      sessionItems[existingItemIndex].quantity += (insertItem.quantity ?? 1);
    } else {
      sessionItems.push(item);
    }
    
    this.cartItemsMap.set(insertItem.sessionId, sessionItems);
    return item;
  }

  async updateCartItemQuantity(sessionId: string, productId: number, quantity: number): Promise<void> {
    const sessionItems = this.cartItemsMap.get(sessionId) || [];
    const itemIndex = sessionItems.findIndex(i => i.productId === productId);
    
    if (itemIndex >= 0) {
      if (quantity <= 0) {
        sessionItems.splice(itemIndex, 1);
      } else {
        sessionItems[itemIndex].quantity = quantity;
      }
      this.cartItemsMap.set(sessionId, sessionItems);
    }
  }

  async removeFromCart(sessionId: string, productId: number): Promise<void> {
    const sessionItems = this.cartItemsMap.get(sessionId) || [];
    const filteredItems = sessionItems.filter(item => item.productId !== productId);
    this.cartItemsMap.set(sessionId, filteredItems);
  }

  async clearCart(sessionId: string): Promise<void> {
    this.cartItemsMap.set(sessionId, []);
  }

  // Orders
  async createOrder(order: InsertOrder): Promise<Order> {
    if (!this.orders) throw new Error('Database not connected');
    
    // Get the next ID
    const lastOrder = await this.orders.findOne({}, { sort: { id: -1 } });
    const nextId = (lastOrder?.id || 0) + 1;
    
    const newOrder: Order = { 
      ...order, 
      id: nextId,
      createdAt: new Date().toISOString()
    };
    
    await this.orders.insertOne(newOrder);
    return newOrder;
  }

  async getOrder(id: number): Promise<Order | undefined> {
    if (!this.orders) throw new Error('Database not connected');
    const order = await this.orders.findOne({ id });
    return order || undefined;
  }

  async getOrdersBySession(sessionId: string): Promise<Order[]> {
    if (!this.orders) throw new Error('Database not connected');
    return await this.orders.find({ sessionId }).toArray();
  }

  async getAllOrders(): Promise<Order[]> {
    if (!this.orders) throw new Error('Database not connected');
    return await this.orders.find({}).sort({ createdAt: -1 }).toArray();
  }

  async updateOrderStatus(id: number, status: string): Promise<void> {
    if (!this.orders) throw new Error('Database not connected');
    await this.orders.updateOne({ id }, { $set: { status } });
  }

  async disconnect(): Promise<void> {
    await this.client.close();
  }
}

export const mongoStorage = new MongoStorage();