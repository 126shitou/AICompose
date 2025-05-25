import { NextRequest, NextResponse } from 'next/server';
import { connectDB, Chat } from '@/models';

// GET /api/chats - 获取用户的聊天列表
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    // 不活跃的
    const includeArchived = searchParams.get('includeArchived') === 'true';

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'User ID is required' },
        { status: 400 }
      );
    }


    // 构建查询条件
    let filter: any = { userId };
    if (!includeArchived) {
      filter.isArchived = false;
    }


    const chats = await Chat.find(filter).sort({ lastActivityAt: -1 })


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
    await connectDB();

    const body = await request.json();
    const { userId, title = 'New Chat', modelName = 'deepseek' } = body;

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'User ID is required' },
        { status: 400 }
      );
    }

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