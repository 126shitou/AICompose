import { connectDB, User, Chat, Generation, Order } from '@/models';
import type { IUser, IChat, IGeneration, IOrder, GenerationType, OrderType } from '@/models';

export class DatabaseService {
  // 确保数据库连接
  static async ensureConnection() {
    await connectDB();
  }

  // 用户相关操作
  static async createUser(userData: Partial<IUser>) {
    await this.ensureConnection();
    const user = new User(userData);
    return await user.save();
  }

  static async getUserById(userId: string) {
    await this.ensureConnection();
    return await User.findById(userId).select('-password');
  }

  static async getUserByEmail(email: string) {
    await this.ensureConnection();
    return await User.findOne({ email: email.toLowerCase() }).select('-password');
  }

  static async updateUserCredits(userId: string, amount: number, operation: 'add' | 'deduct' = 'add') {
    await this.ensureConnection();
    const user = await User.findById(userId);
    if (!user) throw new Error('User not found');
    
    if (operation === 'add') {
      await user.addCredits(amount);
    } else {
      await user.deductCredits(amount);
    }
    
    return user;
  }

  static async updateUserUsageStats(userId: string, type: string, count: number = 1) {
    await this.ensureConnection();
    const user = await User.findById(userId);
    if (!user) throw new Error('User not found');
    
    await user.updateUsageStats(type, count);
    return user;
  }

  // 聊天相关操作
  static async createChat(userId: string, title: string = 'New Chat', modelName: string = 'gpt-3.5-turbo') {
    await this.ensureConnection();
    const chat = new Chat({
      userId,
      title,
      modelName,
      messages: [],
      tags: [],
      totalTokens: 0,
      totalCost: 0,
      isArchived: false
    });
    return await chat.save();
  }

  static async getChatById(chatId: string) {
    await this.ensureConnection();
    return await Chat.findById(chatId);
  }

  static async getUserChats(userId: string, includeArchived: boolean = false) {
    await this.ensureConnection();
    const filter: any = { userId };
    if (!includeArchived) {
      filter.isArchived = false;
    }
    return await Chat.find(filter).sort({ lastActivityAt: -1 });
  }

  static async addMessageToChat(chatId: string, message: any) {
    await this.ensureConnection();
    const chat = await Chat.findById(chatId);
    if (!chat) throw new Error('Chat not found');
    
    await chat.addMessage(message);
    return chat;
  }

  static async archiveChat(chatId: string) {
    await this.ensureConnection();
    const chat = await Chat.findById(chatId);
    if (!chat) throw new Error('Chat not found');
    
    await chat.archive();
    return chat;
  }

  // 生成内容相关操作
  static async createGeneration(generationData: Partial<IGeneration>) {
    await this.ensureConnection();
    const generation = new Generation(generationData);
    return await generation.save();
  }

  static async getGenerationById(generationId: string) {
    await this.ensureConnection();
    return await Generation.findById(generationId);
  }

  static async getUserGenerations(userId: string, type?: GenerationType) {
    await this.ensureConnection();
    const filter: any = { userId };
    if (type) filter.type = type;
    return await Generation.find(filter).sort({ createdAt: -1 });
  }

  static async updateGenerationStatus(generationId: string, status: string, result?: any, processingTime?: number) {
    await this.ensureConnection();
    const generation = await Generation.findById(generationId);
    if (!generation) throw new Error('Generation not found');
    
    switch (status) {
      case 'processing':
        await generation.markAsProcessing();
        break;
      case 'completed':
        await generation.markAsCompleted(result, processingTime);
        break;
      case 'failed':
        await generation.markAsFailed(result);
        break;
    }
    
    return generation;
  }

  static async getPublicGenerations(type?: GenerationType, limit?: number) {
    await this.ensureConnection();
    const filter: any = { isPublic: true, status: 'completed' };
    if (type) filter.type = type;
    
    let query = Generation.find(filter).sort({ likes: -1, createdAt: -1 });
    if (limit) query = query.limit(limit);
    
    return await query;
  }

  // 订单相关操作
  static async createOrder(orderData: Partial<IOrder>) {
    await this.ensureConnection();
    const order = new Order(orderData);
    return await order.save();
  }

  static async getOrderById(orderId: string) {
    await this.ensureConnection();
    return await Order.findById(orderId);
  }

  static async getOrderByNumber(orderNumber: string) {
    await this.ensureConnection();
    return await Order.findOne({ orderNumber: orderNumber.toUpperCase() });
  }

  static async getUserOrders(userId: string, status?: string) {
    await this.ensureConnection();
    const filter: any = { userId };
    if (status) filter.status = status;
    return await Order.find(filter).sort({ createdAt: -1 });
  }

  static async updateOrderStatus(orderId: string, status: string, paymentData?: any) {
    await this.ensureConnection();
    const order = await Order.findById(orderId);
    if (!order) throw new Error('Order not found');
    
    switch (status) {
      case 'paid':
        if (paymentData) {
          await order.markAsPaid(paymentData.paymentId, paymentData.paymentMethod);
        }
        break;
      case 'failed':
        await order.markAsFailed();
        break;
      case 'cancelled':
        await order.cancel();
        break;
      case 'refunded':
        if (paymentData) {
          await order.refund(paymentData.refundId, paymentData.refundAmount);
        }
        break;
    }
    
    return order;
  }

  // 统计相关操作
  static async getUserStats(userId: string) {
    await this.ensureConnection();
    
    const [user, chatCount, generationStats] = await Promise.all([
      User.findById(userId).select('usageStats credits membershipType'),
      Chat.countDocuments({ userId, isArchived: false }),
      Generation.aggregate([
        { $match: { userId } },
        {
          $group: {
            _id: '$type',
            count: { $sum: 1 },
            totalCost: { $sum: '$creditsCost' }
          }
        }
      ])
    ]);
    
    return {
      user,
      chatCount,
      generationStats
    };
  }

  static async getSystemStats() {
    await this.ensureConnection();
    
    const [userCount, chatCount, generationCount, orderStats] = await Promise.all([
      User.countDocuments(),
      Chat.countDocuments(),
      Generation.countDocuments(),
      Order.aggregate([
        { $match: { status: 'paid' } },
        {
          $group: {
            _id: '$currency',
            totalRevenue: { $sum: '$total' },
            orderCount: { $sum: 1 }
          }
        }
      ])
    ]);
    
    return {
      userCount,
      chatCount,
      generationCount,
      orderStats
    };
  }
}

export default DatabaseService; 