import mongoose, { Document, Schema, Model } from 'mongoose';

export interface IUser extends Document {
  _id: string;
  name: string;
  email: string;
  avatar?: string;
  password?: string;
  credits: number;
  membershipType: 'Free' | 'Pro' | 'Enterprise';
  joinDate: Date;
  location?: string;
  phone?: string;
  bio?: string;
  website?: string;
  isEmailVerified: boolean;
  lastLoginAt?: Date;
  preferences: {
    language: string;
    theme: 'light' | 'dark' | 'system';
    notifications: {
      email: boolean;
      push: boolean;
      sms: boolean;
    };
  };
  usageStats: {
    chatMessages: number;
    imagesGenerated: number;
    videosCreated: number;
    musicGenerated: number;
    audioGenerated: number;
    totalCreditsUsed: number;
  };
  createdAt: Date;
  updatedAt: Date;
  
  // 实例方法
  updateUsageStats(type: string, count?: number): Promise<IUser>;
  deductCredits(amount: number): Promise<IUser>;
  addCredits(amount: number): Promise<IUser>;
}

export interface IUserModel extends Model<IUser> {
  findByEmail(email: string): Promise<IUser | null>;
}

const userSchema = new Schema<IUser>({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxlength: [100, 'Name cannot exceed 100 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  avatar: {
    type: String,
    default: null
  },
  password: {
    type: String,
    minlength: [6, 'Password must be at least 6 characters'],
    select: false // 默认不返回密码字段
  },
  credits: {
    type: Number,
    default: 100,
    min: [0, 'Credits cannot be negative']
  },
  membershipType: {
    type: String,
    enum: ['Free', 'Pro', 'Enterprise'],
    default: 'Free'
  },
  joinDate: {
    type: Date,
    default: Date.now
  },
  location: {
    type: String,
    trim: true,
    maxlength: [200, 'Location cannot exceed 200 characters']
  },
  phone: {
    type: String,
    trim: true,
    match: [/^[\+]?[1-9][\d]{0,15}$/, 'Please enter a valid phone number']
  },
  bio: {
    type: String,
    trim: true,
    maxlength: [500, 'Bio cannot exceed 500 characters']
  },
  website: {
    type: String,
    trim: true,
    match: [/^https?:\/\/[^\s/$.?#].[^\s]*$/, 'Please enter a valid URL']
  },
  isEmailVerified: {
    type: Boolean,
    default: false
  },
  lastLoginAt: {
    type: Date,
    default: null
  },
  preferences: {
    language: {
      type: String,
      default: 'en',
      enum: ['en', 'zh', 'es', 'fr', 'de', 'ja', 'ko']
    },
    theme: {
      type: String,
      enum: ['light', 'dark', 'system'],
      default: 'system'
    },
    notifications: {
      email: {
        type: Boolean,
        default: true
      },
      push: {
        type: Boolean,
        default: true
      },
      sms: {
        type: Boolean,
        default: false
      }
    }
  },
  usageStats: {
    chatMessages: {
      type: Number,
      default: 0,
      min: 0
    },
    imagesGenerated: {
      type: Number,
      default: 0,
      min: 0
    },
    videosCreated: {
      type: Number,
      default: 0,
      min: 0
    },
    musicGenerated: {
      type: Number,
      default: 0,
      min: 0
    },
    audioGenerated: {
      type: Number,
      default: 0,
      min: 0
    },
    totalCreditsUsed: {
      type: Number,
      default: 0,
      min: 0
    }
  }
}, {
  timestamps: true
});

// 索引
userSchema.index({ email: 1 }, { unique: true });
userSchema.index({ membershipType: 1 });
userSchema.index({ createdAt: -1 });

// 实例方法
userSchema.methods.updateUsageStats = function(type: string, count: number = 1) {
  switch (type) {
    case 'chat':
      this.usageStats.chatMessages += count;
      break;
    case 'image':
      this.usageStats.imagesGenerated += count;
      break;
    case 'video':
      this.usageStats.videosCreated += count;
      break;
    case 'music':
      this.usageStats.musicGenerated += count;
      break;
    case 'audio':
      this.usageStats.audioGenerated += count;
      break;
  }
  return this.save();
};

userSchema.methods.deductCredits = function(amount: number) {
  if (this.credits < amount) {
    throw new Error('Insufficient credits');
  }
  this.credits -= amount;
  this.usageStats.totalCreditsUsed += amount;
  return this.save();
};

userSchema.methods.addCredits = function(amount: number) {
  this.credits += amount;
  return this.save();
};

// 静态方法
userSchema.statics.findByEmail = function(email: string) {
  return this.findOne({ email: email.toLowerCase() });
};

export default (mongoose.models.User as IUserModel) || mongoose.model<IUser, IUserModel>('User', userSchema);
