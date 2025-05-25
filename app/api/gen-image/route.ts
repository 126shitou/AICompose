import { NextRequest, NextResponse } from 'next/server';
import { connectDB, User, Generation } from '@/models';

const REPLICATE_API_TOKEN = process.env.REPLICATE_API_TOKEN;

if (!REPLICATE_API_TOKEN) {
    console.warn('REPLICATE_API_TOKEN is not set in environment variables');
}

interface ImageGenParams {
    prompt: string;
    aspect_ratio: string;
    num_outputs: number;
    num_inference_steps: number;
    seed?: number;
    output_format: string;
    output_quality: number;
    megapixels: string;
    go_fast?: boolean;
}

export async function POST(request: NextRequest) {
    try {
        await connectDB();

        const body = await request.json();
        const {
            userId,
            prompt,
            aspect_ratio = '1:1',
            num_outputs = 1,
            num_inference_steps = 4,
            seed,
            output_format = 'webp',
            output_quality = 80,
            megapixels = '1',
            go_fast = true
        }: { userId: string } & ImageGenParams = body;

        // 验证必填字段
        if (!userId || !prompt) {
            return NextResponse.json(
                { success: false, error: 'User ID and prompt are required' },
                { status: 400 }
            );
        }

        if (!REPLICATE_API_TOKEN) {
            return NextResponse.json(
                { success: false, error: 'Image generation service not configured' },
                { status: 503 }
            );
        }

        // // 检查用户是否存在
        // const user = await User.findById(userId);
        // if (!user) {
        //   return NextResponse.json(
        //     { success: false, error: 'User not found' },
        //     { status: 404 }
        //   );
        // }

        // // 计算积分消耗 (基于输出数量和推理步数)
        // const creditsCost = num_outputs * Math.ceil(num_inference_steps / 2);

        // // 检查积分是否足够
        // if (user.credits < creditsCost) {
        //   return NextResponse.json(
        //     { success: false, error: 'Insufficient credits' },
        //     { status: 400 }
        //   );
        // }

        // // 创建生成记录
        // const generation = new Generation({
        //   userId,
        //   type: 'image',
        //   prompt,
        //   parameters: {
        //     aspect_ratio,
        //     num_outputs,
        //     num_inference_steps,
        //     seed: seed || Math.floor(Math.random() * 1000000),
        //     output_format,
        //     output_quality,
        //     megapixels,
        //     go_fast
        //   },
        //   creditsCost,
        //   status: 'processing'
        // });

        // await generation.save();

        // // 扣除积分
        // try {
        //   await user.deductCredits(creditsCost);
        //   await user.updateUsageStats('image', num_outputs);
        // } catch (error) {
        //   // 如果扣除积分失败，删除生成记录
        //   await Generation.findByIdAndDelete(generation._id);
        //   return NextResponse.json(
        //     { success: false, error: 'Failed to deduct credits' },
        //     { status: 400 }
        //   );
        // }

        const startTime = Date.now();

        try {
            // 调用 Replicate API
            const replicateResponse = await fetch(
                'https://api.replicate.com/v1/models/black-forest-labs/flux-schnell/predictions',
                {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${REPLICATE_API_TOKEN}`,
                        'Content-Type': 'application/json',
                        'Prefer': 'wait'
                    },
                    body: JSON.stringify({
                        input: {
                            prompt,
                            go_fast,
                            megapixels,
                            num_outputs,
                            aspect_ratio,
                            output_format,
                            output_quality,
                            num_inference_steps,
                            ...(seed && { seed })
                        }
                    })
                }
            );

            if (!replicateResponse.ok) {
                const errorData = await replicateResponse.text();
                throw new Error(`Replicate API error: ${replicateResponse.status} - ${errorData}`);
            }

            const replicateResult = await replicateResponse.json();
            console.log("replicateResult", replicateResult);
            
            return NextResponse.json({
                success: true,
                data: {
                    images: replicateResult.output || [],
                },
                message: 'Images generated successfully'
            });

            //   const processingTime = Date.now() - startTime;

            //   // 更新生成记录为成功状态
            //   generation.status = 'completed';
            //   generation.result = {
            //     urls: replicateResult.output || [],
            //     metadata: {
            //       replicateId: replicateResult.id,
            //       model: 'flux-schnell',
            //       version: replicateResult.version
            //     }
            //   };
            //   generation.processingTime = processingTime;
            //   await generation.save();

            //   return NextResponse.json({
            //     success: true,
            //     data: {
            //       id: generation._id,
            //       images: replicateResult.output || [],
            //       parameters: generation.parameters,
            //       creditsCost,
            //       processingTime
            //     },
            //     message: 'Images generated successfully'
            //   });

        } catch (error: any) {
            //   const processingTime = Date.now() - startTime;

            //   // 更新生成记录为失败状态
            //   generation.status = 'failed';
            //   generation.errorMessage = error.message;
            //   generation.processingTime = processingTime;
            //   await generation.save();

            //   // 如果API调用失败，退还积分
            //   try {
            //     await user.addCredits(creditsCost);
            //     await user.updateUsageStats('image', -num_outputs); // 回退统计
            //   } catch (refundError) {
            //     console.error('Failed to refund credits:', refundError);
            //   }

            console.error('Image generation error:', error);
            return NextResponse.json(
                {
                    success: false,
                    error: 'Failed to generate image',
                    details: error.message
                },
                { status: 500 }
            );
        }

    } catch (error: any) {
        console.error('Image generation API error:', error);

        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map((err: any) => err.message);
            return NextResponse.json(
                { success: false, error: messages.join(', ') },
                { status: 400 }
            );
        }

        return NextResponse.json(
            { success: false, error: 'Internal server error' },
            { status: 500 }
        );
    }
}
