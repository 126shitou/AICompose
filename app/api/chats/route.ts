import { NextRequest, NextResponse } from 'next/server';
import { connectDB, Chat } from '@/models';
import { verifyAuth } from '@/lib/auth-utils';

// GET /api/chats - 获取用户的聊天列表
export async function GET(request: NextRequest) {
  try {
    // 验证用户认证
    const authResult = await verifyAuth(request);
    if (!authResult.success) {
      return NextResponse.json(
        { success: false, error: authResult.error },
        { status: authResult.status }
      );
    }

    await connectDB();

    const { searchParams } = new URL(request.url);
    // 使用认证用户的ID而不是查询参数中的userId
    const userId = authResult.userId;
    const includeArchived = searchParams.get('includeArchived') === 'true';

    // 构建查询条件
    let filter: any = { userId };
    if (!includeArchived) {
      filter.isArchived = false;
    }

    const chats = await Chat.find(filter).sort({ lastActivityAt: -1 });

    return NextResponse.json({
      success: true,
      data: chats
    });
  } catch (error) {
    console.error('Get chats error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch chats' },
      { status: 500 }
    );
  }
}

// POST /api/chats - 创建新聊天
export async function POST(request: NextRequest) {
  try {
    // 验证用户认证
    const authResult = await verifyAuth(request);
    if (!authResult.success) {
      return NextResponse.json(
        { success: false, error: authResult.error },
        { status: authResult.status }
      );
    }

    await connectDB();

    const body = await request.json();
    const { title = 'New Chat', modelName = 'deepseek' } = body;
    
    // 使用认证用户的ID
    const userId = authResult.userId;

    // 创建新聊天
    const chat = new Chat({
      userId,
      title,
      modelName,
      messages: [],
      tags: [],
      isArchived: false
    });

    await chat.save();

    return NextResponse.json({
      success: true,
      data: chat,
      message: 'Chat created successfully'
    }, { status: 201 });

  } catch (error: any) {
    console.error('Create chat error:', error);

    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((err: any) => err.message);
      return NextResponse.json(
        { success: false, error: messages.join(', ') },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, error: 'Failed to create chat' },
      { status: 500 }
    );
  }
} 