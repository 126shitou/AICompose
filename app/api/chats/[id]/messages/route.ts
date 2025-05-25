import { NextRequest, NextResponse } from 'next/server';
import { connectDB, Chat, User } from '@/models';

// POST /api/chats/[id]/messages - 添加消息到聊天
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    
    const { id: chatId } = params;
    const body = await request.json();
    const { role, content, userId, metadata } = body;
    
    // 验证必填字段
    if (!role || !content || !userId) {
      return NextResponse.json(
        { success: false, error: 'Role, content, and userId are required' },
        { status: 400 }
      );
    }
    
    // 验证角色
    if (!['user', 'assistant', 'system'].includes(role)) {
      return NextResponse.json(
        { success: false, error: 'Invalid role' },
        { status: 400 }
      );
    }
    
    // 查找聊天
    const chat = await Chat.findById(chatId);
    if (!chat) {
      return NextResponse.json(
        { success: false, error: 'Chat not found' },
        { status: 404 }
      );
    }
    
    // 验证用户权限
    if (chat.userId !== userId) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 403 }
      );
    }
    
    // 添加消息
    await chat.addMessage({
      role,
      content,
      metadata
    });
    
    // 如果是用户消息，更新用户使用统计
    if (role === 'user') {
      const user = await User.findById(userId);
      if (user) {
        await user.updateUsageStats('chat', 1);
      }
    }
    
    // 如果是AI回复且有token信息，扣除积分
    if (role === 'assistant' && metadata?.tokens && metadata?.cost) {
      const user = await User.findById(userId);
      if (user) {
        try {
          await user.deductCredits(metadata.cost);
        } catch (error) {
          console.warn('Failed to deduct credits:', error);
        }
      }
    }
    
    // 重新获取更新后的聊天
    const updatedChat = await Chat.findById(chatId);
    
    return NextResponse.json({
      success: true,
      data: updatedChat,
      message: 'Message added successfully'
    });
    
  } catch (error: any) {
    console.error('Add message error:', error);
    
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((err: any) => err.message);
      return NextResponse.json(
        { success: false, error: messages.join(', ') },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { success: false, error: 'Failed to add message' },
      { status: 500 }
    );
  }
}

// GET /api/chats/[id]/messages - 获取聊天消息
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    
    const { id: chatId } = params;
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    
    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'User ID is required' },
        { status: 400 }
      );
    }
    
    // 查找聊天
    const chat = await Chat.findById(chatId);
    if (!chat) {
      return NextResponse.json(
        { success: false, error: 'Chat not found' },
        { status: 404 }
      );
    }
    
    // 验证用户权限
    if (chat.userId !== userId) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 403 }
      );
    }
    
    return NextResponse.json({
      success: true,
      data: {
        chatId: chat._id,
        title: chat.title,
        messages: chat.messages,
        totalTokens: chat.totalTokens,
        totalCost: chat.totalCost
      }
    });
    
  } catch (error) {
    console.error('Get messages error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch messages' },
      { status: 500 }
    );
  }
} 