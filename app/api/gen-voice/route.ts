import { NextRequest, NextResponse } from 'next/server';
import { connectDB, User, Generation } from '@/models';

// 强制动态渲染
export const dynamic = 'force-dynamic';

const REPLICATE_API_TOKEN = process.env.REPLICATE_API_TOKEN;

if (!REPLICATE_API_TOKEN) {
    console.warn('REPLICATE_API_TOKEN is not set in environment variables');
}

interface VoiceGenParams {
    text: string;
    speed?: number;
    voice?: string;
}

// 可用的声音选项 (基于Kokoro模型支持的声音)
const AVAILABLE_VOICES = [
    'af_nicole', 'af_sarah', 'af_sky', 'af_bella', 'af_alloy',
    'am_michael', 'am_adam', 'am_echo', 'am_fable', 'am_onyx',
    'am_nova', 'am_shimmer'
] as const;

export async function POST(request: NextRequest) {
    try {
        await connectDB();

        const body = await request.json();
        const {
            userId,
            text,
            speed = 1.0,
            voice = 'af_nicole'
        }: { userId: string } & VoiceGenParams = body;

        // 验证必填字段
        if (!userId || !text) {
            return NextResponse.json(
                { success: false, error: 'User ID and text are required' },
                { status: 400 }
            );
        }

        // 验证文本长度
        if (text.length < 1) {
            return NextResponse.json(
                { success: false, error: 'Text cannot be empty' },
                { status: 400 }
            );
        }

        if (text.length > 5000) {
            return NextResponse.json(
                { success: false, error: 'Text cannot exceed 5000 characters' },
                { status: 400 }
            );
        }

        // 验证声音选项
        if (!AVAILABLE_VOICES.includes(voice as any)) {
            return NextResponse.json(
                { success: false, error: `Invalid voice. Available voices: ${AVAILABLE_VOICES.join(', ')}` },
                { status: 400 }
            );
        }

        // 验证速度范围
        if (speed < 0.1 || speed > 2.0) {
            return NextResponse.json(
                { success: false, error: 'Speed must be between 0.1 and 2.0' },
                { status: 400 }
            );
        }

        if (!REPLICATE_API_TOKEN) {
            return NextResponse.json(
                { success: false, error: 'Voice generation service not configured' },
                { status: 503 }
            );
        }

        // // 检查用户是否存在
        // const user = await User.findById(userId);
        // if (!user) {
        //     return NextResponse.json(
        //         { success: false, error: 'User not found' },
        //         { status: 404 }
        //     );
        // }

        // // 计算积分消耗 (基于文本长度，每100字符消耗1积分，最少1积分)
        // const creditsCost = Math.max(1, Math.ceil(text.length / 100));

        // // 检查积分是否足够
        // if (user.credits < creditsCost) {
        //     return NextResponse.json(
        //         { success: false, error: 'Insufficient credits' },
        //         { status: 400 }
        //     );
        // }

        // // 创建生成记录
        // const generation = new Generation({
        //     userId,
        //     type: 'audio',
        //     prompt: text,
        //     parameters: {
        //         text,
        //         speed,
        //         voice,
        //         model: 'kokoro-82m',
        //         characterCount: text.length,
        //         estimatedDuration: Math.ceil(text.length / 15) // 估算音频时长(秒)
        //     },
        //     creditsCost,
        //     status: 'processing'
        // });

        // await generation.save();

        // // 扣除积分
        // try {
        //     await user.deductCredits(creditsCost);
        //     await user.updateUsageStats('audio', 1);
        // } catch (error) {
        //     // 如果扣除积分失败，删除生成记录
        //     await Generation.findByIdAndDelete(generation._id);
        //     return NextResponse.json(
        //         { success: false, error: 'Failed to deduct credits' },
        //         { status: 400 }
        //     );
        // }

        const startTime = Date.now();

        try {
            // 调用 Replicate API (Kokoro TTS)
            const replicateResponse = await fetch(
                'https://api.replicate.com/v1/predictions',
                {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${REPLICATE_API_TOKEN}`,
                        'Content-Type': 'application/json',
                        'Prefer': 'wait'
                    },
                    body: JSON.stringify({
                        version: 'jaaari/kokoro-82m:f559560eb822dc509045f3921a1921234918b91739db4bf3daab2169b71c7a13',
                        input: {
                            text,
                            speed,
                            voice
                        }
                    })
                }
            );

            if (!replicateResponse.ok) {
                const errorData = await replicateResponse.text();
                throw new Error(`Replicate API error: ${replicateResponse.status} - ${errorData}`);
            }

            const replicateResult = await replicateResponse.json();
            const processingTime = Date.now() - startTime;
            console.log("replicateResult", replicateResult);

            return NextResponse.json({
                success: true,
                data: {
                    audioUrl: Array.isArray(replicateResult.output) ? replicateResult.output[0] : replicateResult.output,
                },
                message: 'Audio generated successfully'
            });



            // // 更新生成记录为成功状态
            // generation.status = 'completed';
            // generation.result = {
            //     urls: Array.isArray(replicateResult.output) ? replicateResult.output : [replicateResult.output],
            //     metadata: {
            //         replicateId: replicateResult.id,
            //         model: 'kokoro-82m',
            //         version: replicateResult.version,
            //         voice,
            //         speed,
            //         characterCount: text.length,
            //         actualDuration: replicateResult.metrics?.predict_time || null
            //     }
            // };
            // generation.processingTime = processingTime;
            // await generation.save();

            // return NextResponse.json({
            //     success: true,
            //     data: {
            //         id: generation._id,
            //         audioUrl: Array.isArray(replicateResult.output) ? replicateResult.output[0] : replicateResult.output,
            //         parameters: generation.parameters,
            //         creditsCost,
            //         processingTime,
            //         metadata: {
            //             voice,
            //             speed,
            //             characterCount: text.length,
            //             estimatedDuration: Math.ceil(text.length / 15), // 字符数/15 ≈ 音频时长(秒)
            //             actualDuration: replicateResult.metrics?.predict_time || null
            //         }
            //     },
            //     message: 'Audio generated successfully'
            // });

        } catch (error: any) {
            const processingTime = Date.now() - startTime;

            // // 更新生成记录为失败状态
            // generation.status = 'failed';
            // generation.errorMessage = error.message;
            // generation.processingTime = processingTime;
            // await generation.save();

            // // 如果API调用失败，退还积分
            // try {
            //     await user.addCredits(creditsCost);
            //     await user.updateUsageStats('audio', -1); // 回退统计
            // } catch (refundError) {
            //     console.error('Failed to refund credits:', refundError);
            // }

            console.error('Voice generation error:', error);
            return NextResponse.json(
                {
                    success: false,
                    error: 'Failed to generate audio',
                    details: error.message
                },
                { status: 500 }
            );
        }

    } catch (error: any) {
        console.error('Voice generation API error:', error);

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

// GET /api/gen-voice - 获取可用声音列表和配置信息
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get('userId');

        // 声音描述信息
        const voiceDescriptions = {
            'af_nicole': 'Nicole - Professional female voice',
            'af_sarah': 'Sarah - Warm female voice',
            'af_sky': 'Sky - Clear female voice',
            'af_bella': 'Bella - Elegant female voice',
            'af_alloy': 'Alloy - Modern female voice',
            'am_michael': 'Michael - Deep male voice',
            'am_adam': 'Adam - Professional male voice',
            'am_echo': 'Echo - Clear male voice',
            'am_fable': 'Fable - Storytelling male voice',
            'am_onyx': 'Onyx - Rich male voice',
            'am_nova': 'Nova - Energetic male voice',
            'am_shimmer': 'Shimmer - Smooth male voice'
        };

        if (userId) {
            await connectDB();
            const user = await User.findById(userId);
            if (!user) {
                return NextResponse.json(
                    { success: false, error: 'User not found' },
                    { status: 404 }
                );
            }

            return NextResponse.json({
                success: true,
                data: {
                    availableVoices: AVAILABLE_VOICES,
                    voiceDescriptions,
                    voiceCategories: {
                        female: AVAILABLE_VOICES.filter(v => v.startsWith('af_')),
                        male: AVAILABLE_VOICES.filter(v => v.startsWith('am_'))
                    },
                    speedRange: { min: 0.1, max: 2.0, default: 1.0 },
                    maxTextLength: 5000,
                    minTextLength: 1,
                    creditsCostPer100Chars: 1,
                    estimatedDurationFormula: 'characterCount / 15 seconds',
                    userCredits: user.credits,
                    usageStats: user.usageStats,
                    model: {
                        name: 'Kokoro TTS',
                        version: 'kokoro-82m',
                        description: 'High-quality text-to-speech based on StyleTTS2'
                    }
                }
            });
        }

        return NextResponse.json({
            success: true,
            data: {
                availableVoices: AVAILABLE_VOICES,
                voiceDescriptions,
                voiceCategories: {
                    female: AVAILABLE_VOICES.filter(v => v.startsWith('af_')),
                    male: AVAILABLE_VOICES.filter(v => v.startsWith('am_'))
                },
                speedRange: { min: 0.1, max: 2.0, default: 1.0 },
                maxTextLength: 5000,
                minTextLength: 1,
                creditsCostPer100Chars: 1,
                estimatedDurationFormula: 'characterCount / 15 seconds',
                model: {
                    name: 'Kokoro TTS',
                    version: 'kokoro-82m',
                    description: 'High-quality text-to-speech based on StyleTTS2'
                }
            }
        });

    } catch (error) {
        console.error('Get voice config error:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to fetch configuration' },
            { status: 500 }
        );
    }
}
