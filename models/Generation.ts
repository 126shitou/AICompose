import mongoose, { Document, Schema } from 'mongoose';

export type GenerationType = 'image' | 'video' | 'audio' | 'music' | 'text';

export interface IGeneration extends Document {
  _id: string;
  userId: string;
  type: GenerationType;
  prompt: string;
  negativePrompt?: string;
  result?: {
    url?: string;
    urls?: string[];
    text?: string;
    duration?: number;
    metadata?: Record<string, any>;
  };
  parameters: {
    model?: string;
    style?: string;
    quality?: string;
    size?: string;
    steps?: number;
    cfgScale?: number;
    seed?: number;
    [key: string]: any;
  };
  creditsCost: number;
  processingTime?: number;
  errorMessage?: string;
  isPublic: boolean;
  tags: string[];
  likes: number;
  downloads: number;
  createdAt: Date;
  updatedAt: Date;
}

const generationSchema = new Schema<IGeneration>({
  userId: {
    type: String,
    required: [true, 'User ID is required'],
    index: true
  },
  type: {
    type: String,
    enum: ['image', 'video', 'audio', 'music', 'text'],
    required: [true, 'Generation type is required']
  },
  prompt: {
    type: String,
    required: [true, 'Prompt is required'],
    trim: true,
    maxlength: [2000, 'Prompt cannot exceed 2000 characters']
  },
  negativePrompt: {
    type: String,
    trim: true,
    maxlength: [1000, 'Negative prompt cannot exceed 1000 characters']
  },
  result: {
    url: {
      type: String,
      default: null
    },
    urls: [{
      type: String
    }],
    text: {
      type: String,
      default: null
    },
    duration: {
      type: Number,
      min: 0
    },
    metadata: {
      type: Schema.Types.Mixed,
      default: {}
    }
  },
  parameters: {
    model: {
      type: String,
      default: null
    },
    style: {
      type: String,
      default: null
    },
    quality: {
      type: String,
      enum: ['draft', 'standard', 'high', 'ultra'],
      default: 'standard'
    },
    size: {
      type: String,
      default: '1024x1024'
    },
    steps: {
      type: Number,
      min: 1,
      max: 100,
      default: 20
    },
    cfgScale: {
      type: Number,
      min: 1,
      max: 20,
      default: 7
    },
    seed: {
      type: Number,
      default: null
    }
  },
  creditsCost: {
    type: Number,
    required: [true, 'Credits cost is required'],
    min: [0, 'Credits cost cannot be negative']
  },
  processingTime: {
    type: Number,
    min: 0
  },
  errorMessage: {
    type: String,
    default: null
  },
  isPublic: {
    type: Boolean,
    default: false
  },
  likes: {
    type: Number,
    default: 0,
    min: 0
  },
  downloads: {
    type: Number,
    default: 0,
    min: 0
  }
}, {
  timestamps: true
});

// 索引
generationSchema.index({ userId: 1, createdAt: -1 });
generationSchema.index({ isPublic: 1, likes: -1 });


generationSchema.methods.incrementLikes = function () {
  this.likes += 1;
  return this.save();
};

generationSchema.methods.incrementDownloads = function () {
  this.downloads += 1;
  return this.save();
};

generationSchema.methods.togglePublic = function () {
  this.isPublic = !this.isPublic;
  return this.save();
};

generationSchema.methods.addTag = function (tag: string) {
  if (!this.tags.includes(tag)) {
    this.tags.push(tag);
    return this.save();
  }
  return this;
};

generationSchema.methods.removeTag = function (tag: string) {
  this.tags = this.tags.filter((t: string) => t !== tag);
  return this.save();
};

// 静态方法
generationSchema.statics.findByUserId = function (userId: string, type?: GenerationType) {
  const filter: any = { userId };
  if (type) {
    filter.type = type;
  }
  return this.find(filter).sort({ createdAt: -1 });
};



generationSchema.statics.findPublicGenerations = function (type?: GenerationType, limit?: number) {
  const filter: any = { isPublic: true };
  if (type) {
    filter.type = type;
  }
  let query = this.find(filter).sort({ likes: -1, createdAt: -1 });
  if (limit) {
    query = query.limit(limit);
  }
  return query;
};

generationSchema.statics.findByTag = function (tag: string, isPublic?: boolean) {
  const filter: any = { tags: tag };
  if (isPublic !== undefined) {
    filter.isPublic = isPublic;
  }
  return this.find(filter).sort({ createdAt: -1 });
};

generationSchema.statics.getStatsByUserId = function (userId: string) {
  return this.aggregate([
    { $match: { userId } },
    {
      $group: {
        _id: '$type',
        count: { $sum: 1 },
        totalCost: { $sum: '$creditsCost' },
        avgProcessingTime: { $avg: '$processingTime' }
      }
    }
  ]);
};

// 中间件
generationSchema.pre('save', function (next) {
  // 自动生成种子值
  if (this.isNew && !this.parameters.seed) {
    this.parameters.seed = Math.floor(Math.random() * 1000000);
  }
  next();
});

export default mongoose.models.Generation || mongoose.model<IGeneration>('Generation', generationSchema); 