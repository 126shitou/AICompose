import { NextRequest, NextResponse } from 'next/server';
import { connectDB, Order, User } from '@/models';
import type { OrderType, PaymentMethod } from '@/models';

// GET /api/orders - 获取订单列表
export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const status = searchParams.get('status');
    const type = searchParams.get('type') as OrderType;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    
    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'User ID is required' },
        { status: 400 }
      );
    }
    
    const skip = (page - 1) * limit;
    
    // 构建查询条件
    const filter: any = { userId };
    if (status) filter.status = status;
    if (type) filter.type = type;
    
    const [orders, total] = await Promise.all([
      Order.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Order.countDocuments(filter)
    ]);
    
    return NextResponse.json({
      success: true,
      data: {
        orders,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    console.error('Get orders error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch orders' },
      { status: 500 }
    );
  }
}

// POST /api/orders - 创建新订单
export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    const body = await request.json();
    const {
      userId,
      type,
      items,
      currency = 'USD',
      billingAddress,
      metadata = {}
    } = body;
    
    // 验证必填字段
    if (!userId || !type || !items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { success: false, error: 'userId, type, and items are required' },
        { status: 400 }
      );
    }
    
    // 验证订单类型
    if (!['credits', 'subscription'].includes(type)) {
      return NextResponse.json(
        { success: false, error: 'Invalid order type' },
        { status: 400 }
      );
    }
    
    // 检查用户是否存在
    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }
    
    // 计算订单金额
    let subtotal = 0;
    const processedItems = items.map((item: any) => {
      const totalPrice = item.quantity * item.unitPrice;
      subtotal += totalPrice;
      return {
        ...item,
        totalPrice
      };
    });
    
    // 应用折扣（如果有促销码）
    let discount = 0;
    if (metadata.promoCode) {
      // 这里可以添加促销码验证逻辑
      // discount = calculateDiscount(metadata.promoCode, subtotal);
    }
    
    // 计算税费（简化处理）
    const tax = subtotal * 0.1; // 10% 税率
    const total = subtotal + tax - discount;
    
    // 创建订单
    const order = new Order({
      userId,
      type,
      items: processedItems,
      subtotal,
      tax,
      discount,
      total,
      currency,
      billingAddress,
      metadata,
      status: 'pending'
    });
    
    await order.save();
    
    return NextResponse.json({
      success: true,
      data: order,
      message: 'Order created successfully'
    }, { status: 201 });
    
  } catch (error: any) {
    console.error('Create order error:', error);
    
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((err: any) => err.message);
      return NextResponse.json(
        { success: false, error: messages.join(', ') },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { success: false, error: 'Failed to create order' },
      { status: 500 }
    );
  }
} 