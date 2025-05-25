import { NextRequest, NextResponse } from 'next/server';
import { connectDB, Generation, User } from '@/models';
import type { GenerationType } from '@/models';

// GET /api/generations - 获取生成内容列表
export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const type = searchParams.get('type') as GenerationType;
    const status = searchParams.get('status');
    const isPublic = searchParams.get('isPublic');
    const tag = searchParams.get('tag');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    
    const skip = (page - 1) * limit;
    
    // 构建查询条件
    const filter: any = {};
    if (userId) filter.userId = userId;
    if (type) filter.type = type;
    if (status) filter.status = status;
    if (isPublic !== null) filter.isPublic = isPublic === 'true';
    if (tag) filter.tags = tag;
    
    const [generations, total] = await Promise.all([
      Generation.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Generation.countDocuments(filter)
    ]);
    
    return NextResponse.json({
      success: true,
      data: {
        generations,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    console.error('Get generations error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch generations' },
      { status: 500 }
    );
  }
}

// POST /api/generations - 创建新的生成任务
export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    const body = await request.json();
    const {
      userId,
      type,
      prompt,
      negativePrompt,
      parameters = {},
      creditsCost
    } = body;
    
    // 验证必填字段
    if (!userId || !type || !prompt || creditsCost === undefined) {
      return NextResponse.json(
        { success: false, error: 'userId, type, prompt, and creditsCost are required' },
        { status: 400 }
      );
    }
    
    // 验证生成类型
    const validTypes: GenerationType[] = ['image', 'video', 'audio', 'music', 'text'];
    if (!validTypes.includes(type)) {
      return NextResponse.json(
        { success: false, error: 'Invalid generation type' },
        { status: 400 }
      );
    }
    
    // 检查用户是否存在且有足够积分
    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }
    
    if (user.credits < creditsCost) {
      return NextResponse.json(
        { success: false, error: 'Insufficient credits' },
        { status: 400 }
      );
    }
    
    // 创建生成任务
    const generation = new Generation({
      userId,
      type,
      prompt,
      negativePrompt,
      parameters,
      creditsCost,
      status: 'pending'
    });
    
    await generation.save();
    
    // 扣除积分
    try {
      await user.deductCredits(creditsCost);
      await user.updateUsageStats(type, 1);
    } catch (error) {
      // 如果扣除积分失败，删除生成任务
      await Generation.findByIdAndDelete(generation._id);
      return NextResponse.json(
        { success: false, error: 'Failed to deduct credits' },
        { status: 400 }
      );
    }
    
    return NextResponse.json({
      success: true,
      data: generation,
      message: 'Generation task created successfully'
    }, { status: 201 });
    
  } catch (error: any) {
    console.error('Create generation error:', error);
    
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((err: any) => err.message);
      return NextResponse.json(
        { success: false, error: messages.join(', ') },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { success: false, error: 'Failed to create generation task' },
      { status: 500 }
    );
  }
} 