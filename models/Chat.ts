import mongoose, { Document, Schema } from 'mongoose';

export interface IMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  metadata?: {
    modelName?: string;
    tokens?: number;
    cost?: number;
    attachments?: string[];
  };
}

export interface IChat extends Document {
  _id: string;
  userId: string;
  title: string;
  messages: IMessage[];
  modelName: string;
  isArchived: boolean;
  tags: string[];
  totalTokens: number;
  totalCost: number;
  lastActivityAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const messageSchema = new Schema<IMessage>({
  id: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['user', 'assistant', 'system'],
    required: true
  },
  content: {
    type: String,
    required: true,
    maxlength: [10000, 'Message content cannot exceed 10000 characters']
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  metadata: {
    modelName: {
      type: String,
      default: null
    },
    tokens: {
      type: Number,
      default: 0,
      min: 0
    },
    cost: {
      type: Number,
      default: 0,
      min: 0
    },
    attachments: [{
      type: String
    }]
  }
}, { _id: false });

const chatSchema = new Schema<IChat>({
  userId: {
    type: String,
    required: [true, 'User ID is required'],
    index: true
  },
  title: {
    type: String,
    required: [true, 'Chat title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters'],
    default: 'New Chat'
  },
  messages: [messageSchema],
  modelName: {
    type: String,
    default: 'gpt-3.5-turbo',
    enum: ['gpt-3.5-turbo', 'gpt-4', 'claude-3', 'gemini-pro']
  },
  isArchived: {
    type: Boolean,
    default: false
  },
  tags: [{
    type: String,
    trim: true,
    maxlength: [50, 'Tag cannot exceed 50 characters']
  }],
  lastActivityAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// 索引
chatSchema.index({ userId: 1, lastActivityAt: -1 });
chatSchema.index({ userId: 1, isArchived: 1 });
chatSchema.index({ tags: 1 });
chatSchema.index({ createdAt: -1 });

// 实例方法
chatSchema.methods.addMessage = function(message: Omit<IMessage, 'id' | 'timestamp'>) {
  const newMessage: IMessage = {
    id: new mongoose.Types.ObjectId().toString(),
    timestamp: new Date(),
    ...message
  };
  
  this.messages.push(newMessage);
  this.lastActivityAt = new Date();
  
  // 更新统计信息
  if (message.metadata?.tokens) {
    this.totalTokens += message.metadata.tokens;
  }
  if (message.metadata?.cost) {
    this.totalCost += message.metadata.cost;
  }
  
  return this.save();
};

chatSchema.methods.updateTitle = function(title: string) {
  this.title = title;
  return this.save();
};

chatSchema.methods.archive = function() {
  this.isArchived = true;
  return this.save();
};

chatSchema.methods.unarchive = function() {
  this.isArchived = false;
  return this.save();
};

chatSchema.methods.addTag = function(tag: string) {
  if (!this.tags.includes(tag)) {
    this.tags.push(tag);
    return this.save();
  }
  return this;
};

chatSchema.methods.removeTag = function(tag: string) {
  this.tags = this.tags.filter((t: string) => t !== tag);
  return this.save();
};

// 静态方法
chatSchema.statics.findByUserId = function(userId: string, includeArchived: boolean = false) {
  const filter: any = { userId };
  if (!includeArchived) {
    filter.isArchived = false;
  }
  return this.find(filter).sort({ lastActivityAt: -1 });
};

chatSchema.statics.findActiveChats = function(userId: string) {
  return this.find({ 
    userId, 
    isArchived: false 
  }).sort({ lastActivityAt: -1 });
};

chatSchema.statics.findByTag = function(userId: string, tag: string) {
  return this.find({ 
    userId, 
    tags: tag,
    isArchived: false 
  }).sort({ lastActivityAt: -1 });
};

// 中间件
chatSchema.pre('save', function(next) {
  if (this.isModified('messages')) {
    this.lastActivityAt = new Date();
  }
  next();
});

export default mongoose.models.Chat || mongoose.model<IChat>('Chat', chatSchema); 