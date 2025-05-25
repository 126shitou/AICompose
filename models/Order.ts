import mongoose, { Document, Schema } from 'mongoose';

export type OrderType = 'credits' | 'subscription';
export type OrderStatus = 'pending' | 'paid' | 'failed' | 'refunded' | 'cancelled';
export type PaymentMethod = 'stripe' | 'paypal' | 'wechat' | 'alipay';

export interface IOrderItem {
  name: string;
  description: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface IOrder extends Document {
  _id: string;
  userId: string;
  orderNumber: string;
  type: OrderType;
  status: OrderStatus;
  items: IOrderItem[];
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
  currency: string;
  paymentMethod?: PaymentMethod;
  paymentId?: string;
  paymentIntent?: string;
  refundId?: string;
  refundAmount?: number;
  metadata: {
    creditsAmount?: number;
    subscriptionPlan?: string;
    subscriptionDuration?: number;
    promoCode?: string;
    [key: string]: any;
  };
  billingAddress?: {
    name: string;
    email: string;
    country: string;
    state?: string;
    city?: string;
    address: string;
    zipCode: string;
  };
  invoiceUrl?: string;
  notes?: string;
  paidAt?: Date;
  refundedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const orderItemSchema = new Schema<IOrderItem>({
  name: {
    type: String,
    required: [true, 'Item name is required'],
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  quantity: {
    type: Number,
    required: [true, 'Quantity is required'],
    min: [1, 'Quantity must be at least 1']
  },
  unitPrice: {
    type: Number,
    required: [true, 'Unit price is required'],
    min: [0, 'Unit price cannot be negative']
  },
  totalPrice: {
    type: Number,
    required: [true, 'Total price is required'],
    min: [0, 'Total price cannot be negative']
  }
}, { _id: false });

const billingAddressSchema = new Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    lowercase: true,
    trim: true
  },
  country: {
    type: String,
    required: [true, 'Country is required'],
    trim: true
  },
  state: {
    type: String,
    trim: true
  },
  city: {
    type: String,
    trim: true
  },
  address: {
    type: String,
    required: [true, 'Address is required'],
    trim: true
  },
  zipCode: {
    type: String,
    required: [true, 'Zip code is required'],
    trim: true
  }
}, { _id: false });

const orderSchema = new Schema<IOrder>({
  userId: {
    type: String,
    required: [true, 'User ID is required'],
    index: true
  },
  orderNumber: {
    type: String,
    required: [true, 'Order number is required'],
    unique: true,
    uppercase: true
  },
  type: {
    type: String,
    enum: ['credits', 'subscription'],
    required: [true, 'Order type is required']
  },
  status: {
    type: String,
    enum: ['pending', 'paid', 'failed', 'refunded', 'cancelled'],
    default: 'pending'
  },
  items: [orderItemSchema],
  subtotal: {
    type: Number,
    required: [true, 'Subtotal is required'],
    min: [0, 'Subtotal cannot be negative']
  },
  tax: {
    type: Number,
    default: 0,
    min: [0, 'Tax cannot be negative']
  },
  discount: {
    type: Number,
    default: 0,
    min: [0, 'Discount cannot be negative']
  },
  total: {
    type: Number,
    required: [true, 'Total is required'],
    min: [0, 'Total cannot be negative']
  },
  currency: {
    type: String,
    required: [true, 'Currency is required'],
    uppercase: true,
    enum: ['USD', 'EUR', 'GBP', 'CNY', 'JPY']
  },
  paymentMethod: {
    type: String,
    enum: ['stripe', 'paypal', 'wechat', 'alipay']
  },
  paymentId: {
    type: String,
    index: true
  },
  paymentIntent: {
    type: String
  },
  refundId: {
    type: String
  },
  refundAmount: {
    type: Number,
    min: [0, 'Refund amount cannot be negative']
  },
  metadata: {
    creditsAmount: {
      type: Number,
      min: 0
    },
    subscriptionPlan: {
      type: String,
      enum: ['pro_monthly', 'pro_yearly', 'enterprise_monthly', 'enterprise_yearly']
    },
    subscriptionDuration: {
      type: Number,
      min: 1
    },
    promoCode: {
      type: String,
      uppercase: true
    }
  },
  billingAddress: billingAddressSchema,
  invoiceUrl: {
    type: String
  },
  notes: {
    type: String,
    trim: true,
    maxlength: [1000, 'Notes cannot exceed 1000 characters']
  },
  paidAt: {
    type: Date
  },
  refundedAt: {
    type: Date
  }
}, {
  timestamps: true
});

// 索引
orderSchema.index({ userId: 1, createdAt: -1 });
orderSchema.index({ status: 1, createdAt: -1 });
orderSchema.index({ orderNumber: 1 }, { unique: true });
orderSchema.index({ paymentId: 1 });
orderSchema.index({ type: 1, status: 1 });

// 实例方法
orderSchema.methods.markAsPaid = function(paymentId: string, paymentMethod: PaymentMethod) {
  this.status = 'paid';
  this.paymentId = paymentId;
  this.paymentMethod = paymentMethod;
  this.paidAt = new Date();
  return this.save();
};

orderSchema.methods.markAsFailed = function() {
  this.status = 'failed';
  return this.save();
};

orderSchema.methods.cancel = function() {
  if (this.status === 'pending') {
    this.status = 'cancelled';
    return this.save();
  }
  throw new Error('Cannot cancel order with status: ' + this.status);
};

orderSchema.methods.refund = function(refundId: string, refundAmount?: number) {
  if (this.status !== 'paid') {
    throw new Error('Cannot refund order with status: ' + this.status);
  }
  this.status = 'refunded';
  this.refundId = refundId;
  this.refundAmount = refundAmount || this.total;
  this.refundedAt = new Date();
  return this.save();
};

orderSchema.methods.addNote = function(note: string) {
  this.notes = this.notes ? `${this.notes}\n${note}` : note;
  return this.save();
};

// 静态方法
orderSchema.statics.findByUserId = function(userId: string, status?: OrderStatus) {
  const filter: any = { userId };
  if (status) {
    filter.status = status;
  }
  return this.find(filter).sort({ createdAt: -1 });
};

orderSchema.statics.findByOrderNumber = function(orderNumber: string) {
  return this.findOne({ orderNumber: orderNumber.toUpperCase() });
};

orderSchema.statics.findByPaymentId = function(paymentId: string) {
  return this.findOne({ paymentId });
};

orderSchema.statics.getTotalRevenue = function(startDate?: Date, endDate?: Date) {
  const match: any = { status: 'paid' };
  if (startDate || endDate) {
    match.paidAt = {};
    if (startDate) match.paidAt.$gte = startDate;
    if (endDate) match.paidAt.$lte = endDate;
  }
  
  return this.aggregate([
    { $match: match },
    {
      $group: {
        _id: '$currency',
        totalRevenue: { $sum: '$total' },
        orderCount: { $sum: 1 }
      }
    }
  ]);
};

orderSchema.statics.generateOrderNumber = function() {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substr(2, 4).toUpperCase();
  return `ORD-${timestamp}-${random}`;
};

// 中间件
orderSchema.pre('save', function(next) {
  // 生成订单号
  if (this.isNew && !this.orderNumber) {
    this.orderNumber = (this.constructor as any).generateOrderNumber();
  }
  
  // 计算总额
  if (this.isModified('subtotal') || this.isModified('tax') || this.isModified('discount')) {
    this.total = this.subtotal + this.tax - this.discount;
  }
  
  next();
});

export default mongoose.models.Order || mongoose.model<IOrder>('Order', orderSchema); 