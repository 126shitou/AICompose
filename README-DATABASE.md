### 3. 数据库连接

数据库连接已在 `lib/db.ts` 中配置，支持连接缓存和热重载。

## 模型说明

### User 模型

用户模型包含以下主要字段：

```typescript
interface IUser {
  name: string;
  email: string;
  avatar?: string;
  credits: number;
  membershipType: 'Free' | 'Pro' | 'Enterprise';
  preferences: {
    language: string;
    theme: 'light' | 'dark' | 'system';
    notifications: object;
  };
  usageStats: {
    chatMessages: number;
    imagesGenerated: number;
    videosCreated: number;
    musicGenerated: number;
    audioGenerated: number;
    totalCreditsUsed: number;
  };
}
```

**主要方法：**
- `updateUsageStats(type, count)`: 更新使用统计
- `deductCredits(amount)`: 扣除积分
- `addCredits(amount)`: 添加积分

### Chat 模型

聊天会话模型：

```typescript
interface IChat {
  userId: string;
  title: string;
  messages: IMessage[];
  modelName: string;
  isArchived: boolean;
  tags: string[];
  totalTokens: number;
  totalCost: number;
}
```

**主要方法：**
- `addMessage(message)`: 添加消息
- `archive()`: 归档聊天
- `addTag(tag)`: 添加标签

### Generation 模型

AI生成内容模型：

```typescript
interface IGeneration {
  userId: string;
  type: 'image' | 'video' | 'audio' | 'music' | 'text';
  prompt: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  result?: {
    url?: string;
    urls?: string[];
    text?: string;
  };
  parameters: object;
  creditsCost: number;
  isPublic: boolean;
}
```

**主要方法：**
- `markAsProcessing()`: 标记为处理中
- `markAsCompleted(result)`: 标记为完成
- `markAsFailed(error)`: 标记为失败

### Order 模型

订单模型：

```typescript
interface IOrder {
  userId: string;
  orderNumber: string;
  type: 'credits' | 'subscription';
  status: 'pending' | 'paid' | 'failed' | 'refunded';
  items: IOrderItem[];
  total: number;
  currency: string;
  paymentMethod?: string;
}
```

**主要方法：**
- `markAsPaid(paymentId, method)`: 标记为已支付
- `cancel()`: 取消订单
- `refund(refundId, amount)`: 退款

## API 使用示例

### 用户相关 API

```typescript
// 创建用户
POST /api/users
{
  "name": "John Doe",
  "email": "john@example.com",
  "membershipType": "Free"
}

// 获取用户列表
GET /api/users?page=1&limit=10&membershipType=Pro
```

### 聊天相关 API

```typescript
// 创建聊天
POST /api/chats
{
  "userId": "user_id",
  "title": "New Chat",
  "modelName": "gpt-4"
}

// 添加消息
POST /api/chats/{chatId}/messages
{
  "userId": "user_id",
  "role": "user",
  "content": "Hello, AI!",
  "metadata": {
    "tokens": 10,
    "cost": 0.01
  }
}
```

### 生成内容 API

```typescript
// 创建生成任务
POST /api/generations
{
  "userId": "user_id",
  "type": "image",
  "prompt": "A beautiful sunset",
  "parameters": {
    "size": "1024x1024",
    "quality": "high"
  },
  "creditsCost": 10
}

// 获取生成列表
GET /api/generations?userId=user_id&type=image&status=completed
```

### 订单相关 API

```typescript
// 创建订单
POST /api/orders
{
  "userId": "user_id",
  "type": "credits",
  "items": [
    {
      "name": "1000 Credits",
      "quantity": 1,
      "unitPrice": 9.99,
      "totalPrice": 9.99
    }
  ],
  "currency": "USD"
}

// 获取订单列表
GET /api/orders?userId=user_id&status=paid
```

## 数据库服务类

使用 `DatabaseService` 类简化数据库操作：

```typescript
import DatabaseService from '@/lib/database-service';

// 创建用户
const user = await DatabaseService.createUser({
  name: 'John Doe',
  email: 'john@example.com'
});

// 更新积分
await DatabaseService.updateUserCredits(userId, 100, 'add');

// 创建聊天
const chat = await DatabaseService.createChat(userId, 'New Chat');

// 添加消息
await DatabaseService.addMessageToChat(chatId, {
  role: 'user',
  content: 'Hello!'
});

// 获取统计信息
const stats = await DatabaseService.getUserStats(userId);
```

## 索引优化

项目已为以下字段创建了索引以优化查询性能：

- User: `email` (唯一), `membershipType`, `createdAt`
- Chat: `userId + lastActivityAt`, `userId + isArchived`, `tags`
- Generation: `userId + createdAt`, `type + status`, `isPublic + likes`
- Order: `userId + createdAt`, `status + createdAt`, `orderNumber` (唯一)

## 数据验证

所有模型都包含完整的数据验证：

- 必填字段验证
- 数据类型验证
- 长度限制
- 格式验证（邮箱、URL、电话等）
- 枚举值验证

## 错误处理

API 返回统一的错误格式：

```json
{
  "success": false,
  "error": "Error message",
  "details": "Detailed error information"
}
```

## 最佳实践

1. **连接管理**: 使用连接池和缓存避免重复连接
2. **数据验证**: 在模型层和API层都进行验证
3. **错误处理**: 统一的错误处理和日志记录
4. **性能优化**: 合理使用索引和聚合查询
5. **安全性**: 敏感字段（如密码）默认不返回

## 部署注意事项

1. 确保 MongoDB 服务正常运行
2. 配置正确的数据库连接字符串
3. 在生产环境中使用环境变量管理敏感信息
4. 定期备份数据库
5. 监控数据库性能和连接状态 