'use client';

import { useState, useEffect, useRef } from 'react';
import { useTranslation } from '@/hooks/use-translation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Slider } from '@/components/ui/slider';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import {
  Download,
  Play,
  Pause,
  Volume2,
  Mic,
  RefreshCw,
  Sparkles,
  Crown,
  Star,
  Globe,
  User,
  Users
} from 'lucide-react';
import { cn } from '@/lib/utils';

// 使用Kokoro模型的声音配置
const kokoroVoices = [
  { id: 'af_nicole', name: 'Nicole', gender: 'female', description: 'Professional female voice' },
  { id: 'af_sarah', name: 'Sarah', gender: 'female', description: 'Warm female voice' },
  { id: 'af_sky', name: 'Sky', gender: 'female', description: 'Clear female voice' },
  { id: 'af_bella', name: 'Bella', gender: 'female', description: 'Elegant female voice' },
  { id: 'af_alloy', name: 'Alloy', gender: 'female', description: 'Modern female voice' },
  { id: 'am_michael', name: 'Michael', gender: 'male', description: 'Deep male voice' },
  { id: 'am_adam', name: 'Adam', gender: 'male', description: 'Professional male voice' },
  { id: 'am_echo', name: 'Echo', gender: 'male', description: 'Clear male voice' },
  { id: 'am_fable', name: 'Fable', gender: 'male', description: 'Storytelling male voice' },
  { id: 'am_onyx', name: 'Onyx', gender: 'male', description: 'Rich male voice' },
  { id: 'am_nova', name: 'Nova', gender: 'male', description: 'Energetic male voice' },
  { id: 'am_shimmer', name: 'Shimmer', gender: 'male', description: 'Smooth male voice' }
];

interface AudioParams {
  text: string;
  voice: string;
  speed: number;
}

interface VoiceConfig {
  availableVoices: string[];
  voiceDescriptions: Record<string, string>;
  voiceCategories: {
    female: string[];
    male: string[];
  };
  speedRange: { min: number; max: number; default: number };
  maxTextLength: number;
  creditsCostPer100Chars: number;
  userCredits?: number;
}

export default function AudioPage() {
  const { t } = useTranslation();
  const [params, setParams] = useState<AudioParams>({
    text: '',
    voice: 'af_nicole',
    speed: 1.0,
  });

  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [generatedAudio, setGeneratedAudio] = useState<string | null>(null);
  const [selectedGender, setSelectedGender] = useState<string>('all');
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPlayingSample, setIsPlayingSample] = useState<string | null>(null);
  const [voiceConfig, setVoiceConfig] = useState<VoiceConfig | null>(null);
  const [userCredits, setUserCredits] = useState<number>(100);
  const [error, setError] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const generateButtonRef = useRef<HTMLButtonElement>(null);

  // 使用模拟用户ID - 在真实应用中应该从认证系统获取
  const userId = "675fc7c9bfe52d51e82e37d8";

  // 加载语音配置
  // useEffect(() => {
  //   const loadVoiceConfig = async () => {
  //     try {
  //       const response = await fetch(`/api/gen-voice?userId=${userId}`);
  //       if (response.ok) {
  //         const result = await response.json();
  //         setVoiceConfig(result.data);
  //         setUserCredits(result.data.userCredits || 0);
  //       } else {
  //         console.error('Failed to load voice config');
  //       }
  //     } catch (error) {
  //       console.error('Error loading voice config:', error);
  //     }
  //   };

  //   loadVoiceConfig();
  // }, [userId]);

  // Filter voices based on selected gender
  const filteredVoices = kokoroVoices.filter(voice => {
    const genderMatch = selectedGender === 'all' || voice.gender === selectedGender;
    return genderMatch;
  });

  const selectedVoice = kokoroVoices.find(v => v.id === params.voice) || kokoroVoices[0];

  const handleGenerate = async () => {
    if (isGenerating) return;

    if (params.text.trim() === '') {
      alert('Please enter text to convert');
      return;
    }

    setIsGenerating(true);
    setProgress(0);
    setError(null);

    // 开始进度模拟
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev + 2;
        if (newProgress >= 90) {
          clearInterval(progressInterval);
          return 90;
        }
        return newProgress;
      });
    }, 100);

    try {
      const response = await fetch('/api/gen-voice', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          text: params.text,
          speed: params.speed,
          voice: params.voice
        }),
      });

      const result = await response.json();

      clearInterval(progressInterval);
      setProgress(100);

      if (result.success && result.data.audioUrl) {
        setGeneratedAudio(result.data.audioUrl);
        setUserCredits(prev => prev - result.data.creditsCost);
        setTimeout(() => {
          setIsGenerating(false);
        }, 500);
      } else {
        throw new Error(result.error || 'Failed to generate audio');
      }
    } catch (error: any) {
      clearInterval(progressInterval);
      setError(error.message);
      setIsGenerating(false);
      setProgress(0);
      console.error('Audio generation error:', error);
    }
  };

  const handlePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handlePlaySample = (voiceId: string) => {
    // Mock sample play for now
    setIsPlayingSample(voiceId);
    setTimeout(() => {
      setIsPlayingSample(null);
    }, 2000);
  };

  const downloadAudio = async () => {
    if (!generatedAudio) return;

    try {
      const response = await fetch(generatedAudio);
      if (!response.ok) {
        throw new Error('Failed to fetch audio file');
      }

      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);

      const a = document.createElement('a');
      a.href = blobUrl;
      const timestamp = new Date().toISOString().slice(0, 19).replace(/[:]/g, '-');
      const promptSnippet = params.text.slice(0, 30).replace(/[^a-zA-Z0-9]/g, '_');
      a.download = `kokoro_speech_${promptSnippet}_${timestamp}.wav`;
      a.style.display = 'none';

      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error('Error downloading audio:', error);
      alert('Failed to download audio. Please try again.');
    }
  };

  // 计算积分消耗
  const creditsCost = Math.max(1, Math.ceil(params.text.length / 100));

  return (
    <div className="min-h-[calc(100vh-120px)]">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-[#F59E0B] to-[#F59E0B]/70 bg-clip-text text-transparent">
          🎤 {t('audio.title', 'Voice Generation')}
        </h1>
        <p className="text-muted-foreground">
          Convert text to speech using Kokoro AI voice synthesis
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Text Input and Parameters */}
        <Card className="col-span-1 lg:col-span-2 p-6 light-theme-card dark:border-white/10 dark:bg-black/20 backdrop-blur-sm">
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">
              📝 {t('audio.text', 'Text to Convert')}
            </label>
            <Textarea
              placeholder={t('audio.textPlaceholder', 'Enter the text you want to convert to speech...')}
              value={params.text}
              onChange={(e) => setParams({ ...params, text: e.target.value })}
              className="h-32 bg-background/50 dark:bg-black/20 border-[#F59E0B]/20 dark:border-[#F59E0B]/30 focus-visible:ring-[#F59E0B] focus-visible:border-[#F59E0B]/30"
              maxLength={5000}
            />
            <div className="mt-2 flex justify-between text-sm text-muted-foreground">
              <span>{params.text.length} / 5000 characters</span>
              <span>Est. duration: ~{Math.ceil(params.text.length / 15)}s</span>
            </div>
          </div>

          {/* Voice Selection */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <label className="block text-sm font-medium">
                🗣️ {t('audio.selectVoice', 'Select Voice')}
              </label>
              <div className="flex gap-2">
                <Select value={selectedGender} onValueChange={setSelectedGender}>
                  <SelectTrigger className="w-24 bg-background/50 dark:bg-black/20 border-[#F59E0B]/20 dark:border-[#F59E0B]/30">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-64 overflow-y-auto">
              {filteredVoices.map((voice) => (
                <div
                  key={voice.id}
                  className={cn(
                    "p-3 rounded-lg border-2 cursor-pointer transition-all hover:shadow-md",
                    params.voice === voice.id
                      ? "border-[#F59E0B] bg-[#F59E0B]/10"
                      : "border-[#F59E0B]/20 hover:border-[#F59E0B]/40"
                  )}
                  onClick={() => setParams({ ...params, voice: voice.id })}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-[#F59E0B]/20 flex items-center justify-center">
                        {voice.gender === 'male' ? <User className="h-4 w-4 text-[#F59E0B]" /> : <Users className="h-4 w-4 text-[#F59E0B]" />}
                      </div>
                      <div>
                        <div className="font-medium text-sm flex items-center gap-1">
                          {voice.name}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {voice.description}
                        </div>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-6 w-6 p-0 hover:bg-[#F59E0B]/20"
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePlaySample(voice.id);
                      }}
                    >
                      {isPlayingSample === voice.id ? (
                        <Pause className="h-3 w-3" />
                      ) : (
                        <Play className="h-3 w-3" />
                      )}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Audio Parameters */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium mb-1">
                ⚡ {t('audio.speed', 'Speed')} ({params.speed}x)
              </label>
              <Slider
                value={[params.speed]}
                min={0.1}
                max={2.0}
                step={0.1}
                onValueChange={(value) => setParams({ ...params, speed: value[0] })}
                className="py-2"
              />
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>0.1x (Slow)</span>
                <span>2.0x (Fast)</span>
              </div>
            </div>

          </div>

          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-600 text-sm">
              ❌ {error}
            </div>
          )}

          <div className="flex justify-between items-center">
            <div className="text-sm text-muted-foreground">
              💳 {t('audio.credits', 'Credits: ')}
              <span className="font-medium text-[#F59E0B] mr-2">
                {userCredits}
              </span>
              <span className="text-xs">
                (Cost: {creditsCost})
              </span>
            </div>
            <Button
              ref={generateButtonRef}
              onClick={handleGenerate}
              disabled={params.text.trim() === '' || isGenerating || userCredits < creditsCost}
              className="bg-[#F59E0B] hover:bg-[#F59E0B]/80 text-white relative overflow-hidden"
            >
              {isGenerating && (
                <div
                  className="absolute left-0 top-0 bottom-0 bg-white/20"
                  style={{ width: `${progress}%` }}
                />
              )}
              <span className="relative flex items-center">
                {isGenerating ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    {t('audio.generating', 'Generating...')} {progress}%
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-4 w-4" />
                    {t('audio.generate', 'Generate Speech')}
                  </>
                )}
              </span>
            </Button>
          </div>
        </Card>

        {/* Audio Preview */}
        <Card className="col-span-1 p-6 light-theme-card dark:border-white/10 dark:bg-black/20 backdrop-blur-sm flex flex-col">
          <h2 className="text-xl font-semibold mb-4">🎧 {t('audio.preview', 'Audio Preview')}</h2>

          <div className="flex-grow flex flex-col items-center justify-center">
            {params.text ? (
              <div className="w-full">
                {generatedAudio ? (
                  <div className="space-y-4">
                    <div className="flex items-center justify-center">
                      <div className="w-32 h-32 rounded-full bg-gradient-to-br from-[#F59E0B]/20 to-[#F59E0B]/40 flex items-center justify-center border-4 border-[#F59E0B]/30">
                        <Button
                          size="lg"
                          variant="ghost"
                          className="w-16 h-16 rounded-full bg-[#F59E0B] hover:bg-[#F59E0B]/80 text-white"
                          onClick={handlePlayPause}
                        >
                          {isPlaying ? <Pause className="h-8 w-8" /> : <Play className="h-8 w-8" />}
                        </Button>
                      </div>
                    </div>

                    <div className="text-center">
                      <div className="font-medium text-[#F59E0B] mb-1">
                        {selectedVoice.name}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Kokoro TTS • {selectedVoice.gender} • {params.speed}x speed
                      </div>
                    </div>

                    <audio
                      ref={audioRef}
                      src={generatedAudio}
                      onEnded={() => setIsPlaying(false)}
                      className="hidden"
                    />

                    <div className="flex justify-center gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-[#F59E0B]/40 text-[#F59E0B] hover:bg-[#F59E0B]/10"
                        onClick={downloadAudio}
                      >
                        <Download className="h-4 w-4 mr-1" />
                        {t('audio.download', 'Download')}
                      </Button>
                    </div>

                    <div className="text-xs text-muted-foreground text-center">
                      Voice: {selectedVoice.description}
                    </div>
                  </div>
                ) : (
                  <div
                    className={cn(
                      "relative border-2 border-dashed border-[#F59E0B]/30 dark:border-[#F59E0B]/40 rounded-lg p-8 flex flex-col items-center justify-center bg-muted/30 dark:bg-black/30",
                      isGenerating && "animate-pulse"
                    )}
                  >
                    <Volume2 className="h-12 w-12 text-[#F59E0B]/50 mb-3" />
                    <p className="text-sm text-muted-foreground text-center mb-3">
                      {isGenerating
                        ? `🔄 ${t('audio.creating', 'Creating your audio...')} ${progress}%`
                        : t('audio.readyToGenerate', 'Ready to generate')}
                    </p>
                    {isGenerating && (
                      <div className="w-full bg-muted dark:bg-white/10 rounded-full h-1.5 border border-[#F59E0B]/20">
                        <div
                          className="bg-gradient-to-r from-[#F59E0B] to-[#F59E0B]/80 h-full rounded-full transition-all shadow-sm"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center p-8">
                <Mic className="h-12 w-12 text-[#F59E0B]/30 mx-auto mb-3" />
                <h3 className="text-lg font-medium mb-2">
                  {t('audio.enterText', 'Enter text to convert')}
                </h3>
                <p className="text-sm text-muted-foreground max-w-xs mx-auto">
                  {t('audio.textHint', 'Type or paste the text you want to convert to speech using Kokoro AI')}
                </p>
              </div>
            )}
          </div>

          {/* Voice Info Panel */}
          <div className="mt-6 p-4 bg-muted/50 dark:bg-black/30 rounded-lg">
            <div className="text-sm">
              <div className="font-medium text-[#F59E0B] mb-2">Current Settings:</div>
              <div className="space-y-1 text-xs text-muted-foreground">
                <div>🗣️ Voice: {selectedVoice.name}</div>
                <div>⚡ Speed: {params.speed}x</div>
                <div>📏 Length: {params.text.length} chars</div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
